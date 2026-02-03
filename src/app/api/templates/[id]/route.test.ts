import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'

function createMockRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'))
}

describe('GET /api/templates/[id]', () => {
  it('returns full template by ID', async () => {
    const request = createMockRequest('http://localhost/api/templates/explainer-pro')
    const response = await GET(request, { params: Promise.resolve({ id: 'explainer-pro' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.template).toBeDefined()
    expect(data.template.id).toBe('explainer-pro')
    expect(data.template.name).toBe('Professional Explainer')
    
    // Should include full config
    expect(data.template.voice).toBeDefined()
    expect(data.template.visuals).toBeDefined()
    expect(data.template.audio).toBeDefined()
    expect(data.template.layout).toBeDefined()
    expect(data.template.structure).toBeDefined()
  })

  it('returns 404 for unknown template', async () => {
    const request = createMockRequest('http://localhost/api/templates/unknown-template')
    const response = await GET(request, { params: Promise.resolve({ id: 'unknown-template' }) })

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toBe('Template not found')
  })

  it('returns reddit-minecraft template', async () => {
    const request = createMockRequest('http://localhost/api/templates/reddit-minecraft')
    const response = await GET(request, { params: Promise.resolve({ id: 'reddit-minecraft' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.template.id).toBe('reddit-minecraft')
    expect(data.template.category).toBe('entertainment')
    expect(data.template.visuals.background.game).toBe('minecraft-parkour')
  })

  it('returns bedtime-story template', async () => {
    const request = createMockRequest('http://localhost/api/templates/bedtime-story')
    const response = await GET(request, { params: Promise.resolve({ id: 'bedtime-story' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.template.id).toBe('bedtime-story')
    expect(data.template.category).toBe('story')
    expect(data.template.voice.narrator.style).toBe('calm')
    expect(data.template.audio.ambient?.type).toBe('rain')
  })
})
