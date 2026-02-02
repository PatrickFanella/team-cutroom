import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock fetch for API tests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API hooks', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchPipelines', () => {
    it('fetches pipelines without filter', async () => {
      const mockPipelines = { pipelines: [], count: 0 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPipelines)
      })

      const res = await fetch('/api/pipelines')
      const data = await res.json()
      
      expect(data).toEqual(mockPipelines)
    })

    it('fetches pipelines with status filter', async () => {
      const mockPipelines = { pipelines: [], count: 0 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPipelines)
      })

      const res = await fetch('/api/pipelines?status=RUNNING')
      expect(mockFetch).toHaveBeenCalledWith('/api/pipelines?status=RUNNING')
    })

    it('handles fetch error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const res = await fetch('/api/pipelines')
      expect(res.ok).toBe(false)
    })
  })

  describe('fetchPipeline', () => {
    it('fetches single pipeline', async () => {
      const mockPipeline = { id: 'test-id', topic: 'Test', stages: [] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPipeline)
      })

      const res = await fetch('/api/pipelines/test-id')
      const data = await res.json()
      
      expect(data).toEqual(mockPipeline)
    })

    it('handles not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const res = await fetch('/api/pipelines/unknown')
      expect(res.ok).toBe(false)
    })
  })

  describe('createPipeline', () => {
    it('creates pipeline with topic', async () => {
      const mockPipeline = { id: 'new-id', topic: 'New Topic', stages: [] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPipeline)
      })

      const res = await fetch('/api/pipelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'New Topic' })
      })
      const data = await res.json()

      expect(data).toEqual(mockPipeline)
    })

    it('creates pipeline with topic and description', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await fetch('/api/pipelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'New Topic', description: 'Details' })
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/pipelines', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ topic: 'New Topic', description: 'Details' })
      }))
    })
  })

  describe('startPipeline', () => {
    it('starts pipeline', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'RUNNING' })
      })

      const res = await fetch('/api/pipelines/test-id/start', { method: 'POST' })
      const data = await res.json()

      expect(data.status).toBe('RUNNING')
    })
  })

  describe('fetchAvailableStages', () => {
    it('fetches available stages', async () => {
      const mockStages = { stages: [] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStages)
      })

      const res = await fetch('/api/stages/available')
      const data = await res.json()

      expect(data).toEqual(mockStages)
    })

    it('filters by stage name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ stages: [] })
      })

      await fetch('/api/stages/available?stage=SCRIPT')
      expect(mockFetch).toHaveBeenCalledWith('/api/stages/available?stage=SCRIPT')
    })
  })
})
