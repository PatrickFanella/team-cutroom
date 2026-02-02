import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/client'

/**
 * Demo Seed Endpoint
 * 
 * POST /api/demo/seed
 * 
 * Creates sample pipelines for demo and testing purposes.
 * Useful for hackathon presentations and development.
 */

const DEMO_TOPICS = [
  {
    topic: 'AI Agents: The Future of Work',
    description: 'Exploring how AI agents are transforming productivity and collaboration',
  },
  {
    topic: 'Why Robots Will Take Your Job (And Why That\'s Good)',
    description: 'A humorous take on automation anxiety and the benefits of AI',
  },
  {
    topic: 'Building Your First AI Agent',
    description: 'Step-by-step guide for developers getting started with agent frameworks',
  },
  {
    topic: 'The $10,000 Hackathon Challenge',
    description: 'Inside the Clawathon: AI agents competing to build the best project',
  },
  {
    topic: 'Crypto for AI Agents',
    description: 'How blockchain enables autonomous agent economies',
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const count = Math.min(body.count || 3, 5) // Max 5 pipelines
    const clearExisting = body.clearExisting === true

    // Optionally clear existing demo data
    if (clearExisting) {
      await prisma.attribution.deleteMany({
        where: {
          pipeline: {
            topic: { in: DEMO_TOPICS.map(t => t.topic) },
          },
        },
      })
      await prisma.stage.deleteMany({
        where: {
          pipeline: {
            topic: { in: DEMO_TOPICS.map(t => t.topic) },
          },
        },
      })
      await prisma.pipeline.deleteMany({
        where: {
          topic: { in: DEMO_TOPICS.map(t => t.topic) },
        },
      })
    }

    // Create demo pipelines
    const selectedTopics = DEMO_TOPICS.slice(0, count)
    const pipelines = []

    for (const topicData of selectedTopics) {
      const pipeline = await prisma.pipeline.create({
        data: {
          topic: topicData.topic,
          description: topicData.description,
          status: 'DRAFT',
          currentStage: 'RESEARCH',
          stages: {
            create: [
              { name: 'RESEARCH', status: 'PENDING' },
              { name: 'SCRIPT', status: 'PENDING' },
              { name: 'VOICE', status: 'PENDING' },
              { name: 'MUSIC', status: 'PENDING' },
              { name: 'VISUAL', status: 'PENDING' },
              { name: 'EDITOR', status: 'PENDING' },
              { name: 'PUBLISH', status: 'PENDING' },
            ],
          },
        },
        include: {
          stages: true,
        },
      })
      pipelines.push(pipeline)
    }

    return NextResponse.json({
      success: true,
      message: `Created ${pipelines.length} demo pipelines`,
      pipelines: pipelines.map(p => ({
        id: p.id,
        topic: p.topic,
        status: p.status,
        stageCount: p.stages.length,
      })),
      hint: 'Use GET /api/stages/available to see claimable work',
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/demo/seed
 * 
 * Returns available demo topics
 */
export async function GET() {
  return NextResponse.json({
    availableTopics: DEMO_TOPICS,
    usage: {
      method: 'POST',
      body: {
        count: 'number (1-5, default 3)',
        clearExisting: 'boolean (default false)',
      },
    },
  })
}
