import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/client'
import { claimStage, startStage, completeStage, failStage, getPreviousStageOutput } from '@/lib/pipeline/manager'
import { getStageHandler, StageContext, STAGE_ORDER } from '@/lib/stages'
import { StageName } from '@prisma/client'

/**
 * Agent Work Queue
 * 
 * POST /api/queue/claim
 * 
 * Allows an agent to claim the next available stage matching their capabilities.
 * This is the primary endpoint for autonomous agents.
 * 
 * Body:
 * {
 *   agentId: string,
 *   agentName: string,
 *   capabilities: StageName[],  // Which stages this agent can handle
 *   autoExecute?: boolean,      // If true, execute immediately after claiming
 * }
 * 
 * Returns the claimed stage with context, or null if no work available.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, agentName, capabilities, autoExecute = false } = body

    if (!agentId || !agentName) {
      return NextResponse.json(
        { error: 'agentId and agentName are required' },
        { status: 400 }
      )
    }

    if (!capabilities || !Array.isArray(capabilities) || capabilities.length === 0) {
      return NextResponse.json(
        { error: 'capabilities must be a non-empty array of stage names' },
        { status: 400 }
      )
    }

    // Find available work matching capabilities
    // Priority: earlier stages first (to unblock downstream work)
    const runningPipelines = await prisma.pipeline.findMany({
      where: { status: 'RUNNING' },
      include: { 
        stages: { 
          orderBy: { createdAt: 'asc' } 
        } 
      },
    })

    let claimedStage = null
    let claimedPipeline = null

    // Sort capabilities by stage order for priority
    const sortedCapabilities = [...capabilities].sort(
      (a, b) => STAGE_ORDER.indexOf(a as StageName) - STAGE_ORDER.indexOf(b as StageName)
    )

    outer: for (const capability of sortedCapabilities) {
      for (const pipeline of runningPipelines) {
        for (let i = 0; i < pipeline.stages.length; i++) {
          const stage = pipeline.stages[i]
          
          // Check if this stage matches capability and is available
          if (stage.name !== capability) continue
          if (stage.status !== 'PENDING') continue
          
          // Check if previous stage is complete
          if (i > 0) {
            const prevStage = pipeline.stages[i - 1]
            if (!['COMPLETE', 'SKIPPED'].includes(prevStage.status)) continue
          }
          
          // Claim this stage
          try {
            claimedStage = await claimStage(pipeline.id, stage.name, agentId, agentName)
            claimedPipeline = pipeline
            break outer
          } catch {
            // Stage might have been claimed by another agent, continue
            continue
          }
        }
      }
    }

    if (!claimedStage) {
      return NextResponse.json({
        claimed: false,
        message: 'No available work matching your capabilities',
        queueStatus: {
          runningPipelines: runningPipelines.length,
          yourCapabilities: capabilities,
        },
      })
    }

    // Get previous stage output for context
    const previousOutput = await getPreviousStageOutput(claimedStage.pipelineId, claimedStage.name)

    const response: Record<string, unknown> = {
      claimed: true,
      stage: claimedStage,
      pipeline: {
        id: claimedPipeline!.id,
        topic: claimedPipeline!.topic,
        description: claimedPipeline!.description,
      },
      context: {
        previousOutput,
      },
    }

    // If autoExecute, run the stage now
    if (autoExecute) {
      const handler = getStageHandler(claimedStage.name)
      
      await startStage(claimedStage.id)
      
      const context: StageContext = {
        pipelineId: claimedStage.pipelineId,
        stageId: claimedStage.id,
        input: {
          topic: claimedPipeline!.topic,
          description: claimedPipeline!.description || undefined,
        },
        previousOutput,
      }
      
      const result = await handler.execute(context)
      
      if (result.success) {
        const artifacts = result.artifacts?.map(a => a.url) || []
        const { stage: completedStage, pipeline } = await completeStage(
          claimedStage.id, 
          result.output, 
          artifacts
        )
        
        response.execution = {
          success: true,
          stage: completedStage,
          pipeline,
          output: result.output,
        }
      } else {
        await failStage(claimedStage.id, result.error || 'Unknown error')
        response.execution = {
          success: false,
          error: result.error,
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * Get Queue Status
 * 
 * GET /api/queue/claim
 * 
 * Returns current queue status — how much work is available.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const capability = searchParams.get('capability') as StageName | null

    // Count available stages
    const runningPipelines = await prisma.pipeline.findMany({
      where: { status: 'RUNNING' },
      include: { stages: { orderBy: { createdAt: 'asc' } } },
    })

    const availableByStage: Record<string, number> = {}
    
    for (const pipeline of runningPipelines) {
      for (let i = 0; i < pipeline.stages.length; i++) {
        const stage = pipeline.stages[i]
        
        if (stage.status !== 'PENDING') continue
        
        // Check if previous is complete
        if (i > 0 && !['COMPLETE', 'SKIPPED'].includes(pipeline.stages[i - 1].status)) continue
        
        if (capability && stage.name !== capability) continue
        
        availableByStage[stage.name] = (availableByStage[stage.name] || 0) + 1
      }
    }

    const totalAvailable = Object.values(availableByStage).reduce((a, b) => a + b, 0)

    return NextResponse.json({
      totalAvailable,
      byStage: availableByStage,
      runningPipelines: runningPipelines.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
