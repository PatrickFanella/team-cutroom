import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/client'
import { z } from 'zod'
import { StageName } from '@prisma/client'

// Agent registration schema
const AgentSchema = z.object({
  agentId: z.string().min(1),
  agentName: z.string().min(1),
  capabilities: z.array(z.enum(['RESEARCH', 'SCRIPT', 'VOICE', 'MUSIC', 'VISUAL', 'EDITOR', 'PUBLISH'])),
  walletAddress: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

/**
 * Register Agent
 * 
 * POST /api/agents
 * 
 * Registers an agent to work on pipelines.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = AgentSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.errors },
        { status: 400 }
      )
    }
    
    const { agentId, agentName, capabilities, walletAddress, metadata } = result.data
    
    // For now, just store in a simple format
    // In production, would use a proper agents table
    const agent = {
      agentId,
      agentName,
      capabilities,
      walletAddress,
      metadata,
      registeredAt: new Date().toISOString(),
    }
    
    // Get agent's completed work
    const completedStages = await prisma.stage.count({
      where: {
        agentId,
        status: 'COMPLETE',
      },
    })
    
    const totalContribution = await prisma.attribution.aggregate({
      where: { agentId },
      _sum: { percentage: true },
    })
    
    return NextResponse.json({
      agent,
      stats: {
        completedStages,
        totalContribution: totalContribution._sum.percentage || 0,
      },
      message: 'Agent registered successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * List Agents
 * 
 * GET /api/agents
 * 
 * Returns agents with their stats based on attribution records.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const capability = searchParams.get('capability') as StageName | null
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    
    // Get unique agents from attributions
    const agents = await prisma.attribution.groupBy({
      by: ['agentId', 'agentName'],
      _sum: { percentage: true },
      _count: true,
      orderBy: { _sum: { percentage: 'desc' } },
      take: limit,
    })
    
    // If filtering by capability, get agents who have completed that stage
    let filtered = agents
    if (capability) {
      const agentsWithCapability = await prisma.stage.findMany({
        where: {
          name: capability,
          status: 'COMPLETE',
          agentId: { not: null },
        },
        select: { agentId: true },
        distinct: ['agentId'],
      })
      
      const validAgentIds = new Set(agentsWithCapability.map(a => a.agentId))
      filtered = agents.filter(a => validAgentIds.has(a.agentId))
    }
    
    return NextResponse.json({
      agents: filtered.map(a => ({
        agentId: a.agentId,
        agentName: a.agentName,
        stagesCompleted: a._count,
        totalContribution: a._sum.percentage,
      })),
      total: filtered.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
