import { describe, it, expect } from 'vitest'
import { cn, formatDate, formatRelativeTime, STAGE_META, STAGE_WEIGHTS } from './utils'

describe('cn (classname merge)', () => {
  it('merges classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('dedupes tailwind classes', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })
})

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-06-15T14:30:00')
    const result = formatDate(date)
    expect(result).toMatch(/Jun/)
    expect(result).toMatch(/15/)
  })

  it('handles string dates', () => {
    const result = formatDate('2024-06-15T14:30:00')
    expect(result).toMatch(/Jun/)
  })
})

describe('formatRelativeTime', () => {
  it('formats recent time as "just now"', () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe('just now')
  })

  it('formats minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago')
  })

  it('formats hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago')
  })

  it('formats days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago')
  })
})

describe('STAGE_META', () => {
  it('has all pipeline stages', () => {
    const stages = ['RESEARCH', 'SCRIPT', 'VOICE', 'MUSIC', 'VISUAL', 'EDITOR', 'PUBLISH']
    stages.forEach(stage => {
      expect(STAGE_META[stage]).toBeDefined()
      expect(STAGE_META[stage].emoji).toBeDefined()
      expect(STAGE_META[stage].label).toBeDefined()
      expect(STAGE_META[stage].description).toBeDefined()
    })
  })

  it('has correct labels', () => {
    expect(STAGE_META.RESEARCH.label).toBe('Research')
    expect(STAGE_META.SCRIPT.label).toBe('Script')
    expect(STAGE_META.EDITOR.label).toBe('Editor')
  })
})

describe('STAGE_WEIGHTS', () => {
  it('has weights for all stages', () => {
    const stages = ['RESEARCH', 'SCRIPT', 'VOICE', 'MUSIC', 'VISUAL', 'EDITOR', 'PUBLISH']
    stages.forEach(stage => {
      expect(STAGE_WEIGHTS[stage]).toBeDefined()
      expect(typeof STAGE_WEIGHTS[stage]).toBe('number')
    })
  })

  it('weights sum to 100', () => {
    const total = Object.values(STAGE_WEIGHTS).reduce((sum, w) => sum + w, 0)
    expect(total).toBe(100)
  })

  it('has appropriate relative weights', () => {
    // Script should be highest (most creative work)
    expect(STAGE_WEIGHTS.SCRIPT).toBeGreaterThan(STAGE_WEIGHTS.RESEARCH)
    // Publish should be lowest (mostly mechanical)
    expect(STAGE_WEIGHTS.PUBLISH).toBeLessThan(STAGE_WEIGHTS.VOICE)
  })
})
