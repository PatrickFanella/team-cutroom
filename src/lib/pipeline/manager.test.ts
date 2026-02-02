import { describe, it, expect } from 'vitest'
import { STAGE_ORDER, getNextStageName } from './manager'

describe('Pipeline Manager', () => {
  describe('STAGE_ORDER', () => {
    it('should have 7 stages in correct order', () => {
      expect(STAGE_ORDER).toHaveLength(7)
      expect(STAGE_ORDER[0]).toBe('RESEARCH')
      expect(STAGE_ORDER[6]).toBe('PUBLISH')
    })

    it('should have all required stages', () => {
      const required = ['RESEARCH', 'SCRIPT', 'VOICE', 'MUSIC', 'VISUAL', 'EDITOR', 'PUBLISH']
      required.forEach(stage => {
        expect(STAGE_ORDER).toContain(stage)
      })
    })
  })

  describe('getNextStageName', () => {
    it('should return next stage for RESEARCH', () => {
      expect(getNextStageName('RESEARCH')).toBe('SCRIPT')
    })

    it('should return next stage for SCRIPT', () => {
      expect(getNextStageName('SCRIPT')).toBe('VOICE')
    })

    it('should return null for PUBLISH (last stage)', () => {
      expect(getNextStageName('PUBLISH')).toBeNull()
    })

    it('should return null for invalid stage', () => {
      expect(getNextStageName('INVALID' as any)).toBeNull()
    })
  })
})
