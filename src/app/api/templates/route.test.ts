import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'

function createMockRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'))
}

describe('GET /api/templates', () => {
  it('returns all templates', async () => {
    const request = createMockRequest('http://localhost/api/templates')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.templates).toBeDefined()
    expect(Array.isArray(data.templates)).toBe(true)
    expect(data.templates.length).toBeGreaterThan(0)
    expect(data.total).toBe(data.templates.length)
  })

  it('returns template summary fields', async () => {
    const request = createMockRequest('http://localhost/api/templates')
    const response = await GET(request)
    const data = await response.json()

    const template = data.templates[0]
    expect(template.id).toBeDefined()
    expect(template.name).toBeDefined()
    expect(template.description).toBeDefined()
    expect(template.category).toBeDefined()
    expect(template.platforms).toBeDefined()
    
    // Should NOT include full config in list
    expect(template.voice).toBeUndefined()
    expect(template.visuals).toBeUndefined()
  })

  it('filters by category', async () => {
    const request = createMockRequest('http://localhost/api/templates?category=educational')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    data.templates.forEach((t: any) => {
      expect(t.category).toBe('educational')
    })
  })

  it('filters by platform', async () => {
    const request = createMockRequest('http://localhost/api/templates?platform=youtube')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    data.templates.forEach((t: any) => {
      expect(t.platforms).toContain('youtube')
    })
  })

  it('searches by query', async () => {
    const request = createMockRequest('http://localhost/api/templates?search=reddit')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.templates.length).toBeGreaterThan(0)
    
    // Should find reddit-related templates
    const hasReddit = data.templates.some((t: any) => 
      t.name.toLowerCase().includes('reddit') ||
      t.description.toLowerCase().includes('reddit') ||
      t.tags?.some((tag: string) => tag.includes('reddit'))
    )
    expect(hasReddit).toBe(true)
  })
})
