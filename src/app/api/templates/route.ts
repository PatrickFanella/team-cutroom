/**
 * GET /api/templates
 * 
 * List available video templates with optional filtering.
 * 
 * Query params:
 * - category: Filter by category (educational, entertainment, etc.)
 * - search: Search by name, description, or tags
 * - platform: Filter by platform support
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  listVideoTemplates, 
  listTemplatesByCategory, 
  searchTemplates,
  TemplateCategory,
} from '@/lib/templates'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const platform = searchParams.get('platform')

  try {
    let templates = listVideoTemplates().map(({ template }) => template)

    // Filter by category
    if (category) {
      templates = listTemplatesByCategory(category as TemplateCategory)
    }

    // Search
    if (search) {
      templates = searchTemplates(search)
    }

    // Filter by platform
    if (platform) {
      templates = templates.filter(t => 
        t.platforms.includes(platform as any)
      )
    }

    // Return summary (not full config)
    const summary = templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      thumbnail: t.thumbnail,
      platforms: t.platforms,
      tags: t.tags,
    }))

    return NextResponse.json({
      templates: summary,
      total: summary.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
