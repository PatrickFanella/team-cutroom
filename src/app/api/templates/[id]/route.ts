/**
 * GET /api/templates/[id]
 * 
 * Get full template configuration by ID.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVideoTemplate } from '@/lib/templates'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const template = getVideoTemplate(id)

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      template,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}
