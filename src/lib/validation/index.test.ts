import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  idSchema,
  cuidSchema,
  stageNameSchema,
  pipelineStatusSchema,
  stageStatusSchema,
  agentSchema,
  paginationSchema,
  urlSchema,
  percentageSchema,
  walletAddressSchema,
  validate,
  validateOrThrow,
  validationError,
} from './index'

describe('Validation Utilities', () => {
  describe('idSchema', () => {
    it('should accept valid ids', () => {
      expect(idSchema.safeParse('abc123').success).toBe(true)
      expect(idSchema.safeParse('a').success).toBe(true)
    })

    it('should reject empty ids', () => {
      expect(idSchema.safeParse('').success).toBe(false)
    })
  })

  describe('cuidSchema', () => {
    it('should accept valid CUIDs', () => {
      expect(cuidSchema.safeParse('clm1234567890123456789012').success).toBe(true)
    })

    it('should reject invalid CUIDs', () => {
      expect(cuidSchema.safeParse('not-a-cuid').success).toBe(false)
      expect(cuidSchema.safeParse('').success).toBe(false)
    })
  })

  describe('stageNameSchema', () => {
    it('should accept valid stage names', () => {
      expect(stageNameSchema.safeParse('RESEARCH').success).toBe(true)
      expect(stageNameSchema.safeParse('SCRIPT').success).toBe(true)
      expect(stageNameSchema.safeParse('PUBLISH').success).toBe(true)
    })

    it('should reject invalid stage names', () => {
      expect(stageNameSchema.safeParse('INVALID').success).toBe(false)
      expect(stageNameSchema.safeParse('research').success).toBe(false)
    })
  })

  describe('pipelineStatusSchema', () => {
    it('should accept valid statuses', () => {
      expect(pipelineStatusSchema.safeParse('DRAFT').success).toBe(true)
      expect(pipelineStatusSchema.safeParse('RUNNING').success).toBe(true)
      expect(pipelineStatusSchema.safeParse('COMPLETE').success).toBe(true)
      expect(pipelineStatusSchema.safeParse('FAILED').success).toBe(true)
    })
  })

  describe('stageStatusSchema', () => {
    it('should accept valid statuses', () => {
      expect(stageStatusSchema.safeParse('PENDING').success).toBe(true)
      expect(stageStatusSchema.safeParse('CLAIMED').success).toBe(true)
      expect(stageStatusSchema.safeParse('COMPLETE').success).toBe(true)
    })
  })

  describe('agentSchema', () => {
    it('should accept valid agent data', () => {
      const result = agentSchema.safeParse({
        agentId: 'agent-123',
        agentName: 'TestBot',
      })
      expect(result.success).toBe(true)
    })

    it('should reject missing fields', () => {
      expect(agentSchema.safeParse({ agentId: 'test' }).success).toBe(false)
      expect(agentSchema.safeParse({ agentName: 'test' }).success).toBe(false)
    })
  })

  describe('paginationSchema', () => {
    it('should use defaults', () => {
      const result = paginationSchema.parse({})
      expect(result.limit).toBe(20)
      expect(result.offset).toBe(0)
    })

    it('should coerce string numbers', () => {
      const result = paginationSchema.parse({ limit: '50', offset: '10' })
      expect(result.limit).toBe(50)
      expect(result.offset).toBe(10)
    })

    it('should cap limit at 100', () => {
      expect(paginationSchema.safeParse({ limit: 200 }).success).toBe(false)
    })
  })

  describe('urlSchema', () => {
    it('should accept valid URLs', () => {
      expect(urlSchema.safeParse('https://example.com').success).toBe(true)
      expect(urlSchema.safeParse('http://localhost:3000').success).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(urlSchema.safeParse('not-a-url').success).toBe(false)
    })
  })

  describe('percentageSchema', () => {
    it('should accept valid percentages', () => {
      expect(percentageSchema.safeParse(0).success).toBe(true)
      expect(percentageSchema.safeParse(50).success).toBe(true)
      expect(percentageSchema.safeParse(100).success).toBe(true)
    })

    it('should reject out of range', () => {
      expect(percentageSchema.safeParse(-1).success).toBe(false)
      expect(percentageSchema.safeParse(101).success).toBe(false)
    })
  })

  describe('walletAddressSchema', () => {
    it('should accept valid addresses', () => {
      expect(walletAddressSchema.safeParse('0x1234567890123456789012345678901234567890').success).toBe(true)
    })

    it('should reject invalid addresses', () => {
      expect(walletAddressSchema.safeParse('0x123').success).toBe(false)
      expect(walletAddressSchema.safeParse('not-an-address').success).toBe(false)
    })
  })

  describe('validate', () => {
    it('should return success with data', () => {
      const result = validate(z.string(), 'test')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test')
      }
    })

    it('should return errors on failure', () => {
      const result = validate(z.string(), 123)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0)
      }
    })
  })

  describe('validateOrThrow', () => {
    it('should return data on success', () => {
      expect(validateOrThrow(z.string(), 'test')).toBe('test')
    })

    it('should throw on failure', () => {
      expect(() => validateOrThrow(z.string(), 123)).toThrow()
    })
  })

  describe('validationError', () => {
    it('should format errors', () => {
      const result = z.object({ name: z.string() }).safeParse({})
      if (!result.success) {
        const formatted = validationError(result.error.errors)
        expect(formatted.error).toBe('Validation failed')
        expect(formatted.details).toHaveLength(1)
        expect(formatted.details[0].path).toBe('name')
      }
    })
  })
})
