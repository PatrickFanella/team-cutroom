/**
 * GET /api/templates/presets
 * 
 * List available presets for each category (voice, visuals, audio, layout).
 * Used for building custom templates or understanding customization options.
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  listVoicePresets,
  listVisualPresets,
  listAudioPresets,
  listLayoutPresets,
} from '@/lib/templates'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    const result: Record<string, { id: string; preset: unknown }[]> = {}

    if (!type || type === 'voice') {
      result.voice = listVoicePresets()
    }
    if (!type || type === 'visuals') {
      result.visuals = listVisualPresets()
    }
    if (!type || type === 'audio') {
      result.audio = listAudioPresets()
    }
    if (!type || type === 'layout') {
      result.layout = listLayoutPresets()
    }

    return NextResponse.json({
      presets: result,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch presets' },
      { status: 500 }
    )
  }
}
