import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { NextRequest } from 'next/server'

// Mock prisma
vi.mock('@/lib/db/client', () => ({
  default: {
    pipeline: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    stage: {
      deleteMany: vi.fn(),
    },
    attribution: {
      deleteMany: vi.fn(),
    },
  },
}))

import prisma from '@/lib/db/client'

function createMockRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/demo/seed', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

describe('GET /api/demo/seed', () => {
  it('returns available demo topics', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.availableTopics).toHaveLength(5)
    expect(data.usage).toBeDefined()
  })

  it('includes usage instructions', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.usage.method).toBe('POST')
    expect(data.usage.body).toHaveProperty('count')
    expect(data.usage.body).toHaveProperty('clearExisting')
  })
})

describe('POST /api/demo/seed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates demo pipelines', async () => {
    const mockPipeline = {
      id: 'pipe-1',
      topic: 'AI Agents: The Future of Work',
      status: 'DRAFT',
      stages: [
        { id: 's1', name: 'RESEARCH', status: 'PENDING' },
        { id: 's2', name: 'SCRIPT', status: 'PENDING' },
        { id: 's3', name: 'VOICE', status: 'PENDING' },
        { id: 's4', name: 'MUSIC', status: 'PENDING' },
        { id: 's5', name: 'VISUAL', status: 'PENDING' },
        { id: 's6', name: 'EDITOR', status: 'PENDING' },
        { id: 's7', name: 'PUBLISH', status: 'PENDING' },
      ],
    }

    vi.mocked(prisma.pipeline.create).mockResolvedValue(mockPipeline as any)

    const request = createMockRequest({ count: 1 })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.pipelines).toHaveLength(1)
  })

  it('defaults to 3 pipelines', async () => {
    const mockPipeline = {
      id: 'pipe-1',
      topic: 'Test',
      status: 'DRAFT',
      stages: [],
    }

    vi.mocked(prisma.pipeline.create).mockResolvedValue(mockPipeline as any)

    const request = createMockRequest({})
    const response = await POST(request)
    const data = await response.json()

    expect(prisma.pipeline.create).toHaveBeenCalledTimes(3)
  })

  it('limits to max 5 pipelines', async () => {
    const mockPipeline = {
      id: 'pipe-1',
      topic: 'Test',
      status: 'DRAFT',
      stages: [],
    }

    vi.mocked(prisma.pipeline.create).mockResolvedValue(mockPipeline as any)

    const request = createMockRequest({ count: 100 })
    const response = await POST(request)

    expect(prisma.pipeline.create).toHaveBeenCalledTimes(5)
  })

  it('clears existing data when requested', async () => {
    const mockPipeline = {
      id: 'pipe-1',
      topic: 'Test',
      status: 'DRAFT',
      stages: [],
    }

    vi.mocked(prisma.pipeline.create).mockResolvedValue(mockPipeline as any)
    vi.mocked(prisma.attribution.deleteMany).mockResolvedValue({ count: 0 })
    vi.mocked(prisma.stage.deleteMany).mockResolvedValue({ count: 0 })
    vi.mocked(prisma.pipeline.deleteMany).mockResolvedValue({ count: 0 })

    const request = createMockRequest({ count: 1, clearExisting: true })
    await POST(request)

    expect(prisma.attribution.deleteMany).toHaveBeenCalled()
    expect(prisma.stage.deleteMany).toHaveBeenCalled()
    expect(prisma.pipeline.deleteMany).toHaveBeenCalled()
  })

  it('returns helpful hint', async () => {
    const mockPipeline = {
      id: 'pipe-1',
      topic: 'Test',
      status: 'DRAFT',
      stages: [],
    }

    vi.mocked(prisma.pipeline.create).mockResolvedValue(mockPipeline as any)

    const request = createMockRequest({ count: 1 })
    const response = await POST(request)
    const data = await response.json()

    expect(data.hint).toContain('/api/stages/available')
  })
})
