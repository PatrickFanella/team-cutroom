import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'

// Mock database
vi.mock('@/lib/db/client', () => ({
  default: {
    pipeline: {
      create: vi.fn().mockResolvedValue({
        id: 'test-pipeline-id',
        topic: 'Test topic',
        status: 'DRAFT',
        stages: [],
      }),
    },
  },
}))

function createMockRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required topic field', async () => {
    const request = createMockRequest({})
    const response = await POST(request)
    
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Invalid request')
  })

  it('returns 404 for unknown template', async () => {
    const request = createMockRequest({
      topic: 'Test topic',
      templateId: 'nonexistent-template',
    })
    const response = await POST(request)
    
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toContain('Template not found')
  })

  it('runs pipeline in dry run mode', async () => {
    const request = createMockRequest({
      topic: 'Why cats are great',
      dryRun: true,
    })
    const response = await POST(request)
    
    // Should succeed even without API keys in dry run
    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.metadata.dryRun).toBe(true)
    expect(data.metadata.stagesCompleted).toContain('research')
    expect(data.metadata.stagesCompleted).toContain('script')
  })

  it('accepts duration parameter', async () => {
    const request = createMockRequest({
      topic: 'Quick facts',
      duration: 30,
      dryRun: true,
    })
    const response = await POST(request)
    
    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it('rejects invalid duration', async () => {
    const request = createMockRequest({
      topic: 'Test',
      duration: 5, // Too short (min 15)
    })
    const response = await POST(request)
    
    expect(response.status).toBe(400)
  })

  it('works with template', async () => {
    const request = createMockRequest({
      topic: 'Why the sky is blue',
      templateId: 'explainer-pro',
      dryRun: true,
    })
    const response = await POST(request)
    
    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.templateId).toBe('explainer-pro')
  })

  it('returns video metadata', async () => {
    const request = createMockRequest({
      topic: 'Test video',
      dryRun: true,
    })
    const response = await POST(request)
    
    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.video).toBeDefined()
    expect(data.video.url).toBeDefined()
    expect(data.script).toBeDefined()
    expect(data.script.hook).toBeDefined()
  })
})
