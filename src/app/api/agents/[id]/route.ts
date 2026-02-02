import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/client'

/**
 * Get Agent Details
 * 
 * GET /api/agents/[id]
 * 
 * Returns an agent's profile, completed work, and attribution history.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    
    // Get attributions
    const attributions = await prisma.attribution.findMany({
      where: { agentId },
      include: {
        pipeline: {
          select: {
            id: true,
            topic: true,
            status: true,
          },
        },
        stage: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    if (attributions.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found or has no completed work' },
        { status: 404 }
      )
    }
    
    // Calculate stats
    const totalContribution = attributions.reduce((sum, a) => sum + a.percentage, 0)
    const stageBreakdown: Record<string, number> = {}
    
    for (const attr of attributions) {
      const stageName = attr.stage.name
      stageBreakdown[stageName] = (stageBreakdown[stageName] || 0) + 1
    }
    
    // Get recent completed stages
    const recentStages = await prisma.stage.findMany({
      where: {
        agentId,
        status: 'COMPLETE',
      },
      include: {
        pipeline: {
          select: {
            topic: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 10,
    })
    
    return NextResponse.json({
      agentId,
      agentName: attributions[0].agentName,
      stats: {
        totalContribution,
        pipelinesContributed: new Set(attributions.map(a => a.pipelineId)).size,
        stagesCompleted: attributions.length,
        stageBreakdown,
      },
      recentWork: recentStages.map(s => ({
        stage: s.name,
        topic: s.pipeline.topic,
        completedAt: s.completedAt,
      })),
      attributions: attributions.map(a => ({
        pipelineId: a.pipelineId,
        topic: a.pipeline.topic,
        stageName: a.stage.name,
        percentage: a.percentage,
        createdAt: a.createdAt,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
