import { describe, it, expect, vi } from 'vitest'
import {
  sleep,
  calculateDelay,
  retry,
  retryTransient,
  retryPredicates,
  DEFAULT_RETRY_CONFIG,
} from './index'

describe('Retry Utilities', () => {
  describe('sleep', () => {
    it('should wait for specified time', async () => {
      const start = Date.now()
      await sleep(50)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(45)
    })
  })

  describe('calculateDelay', () => {
    it('should return initial delay for first attempt', () => {
      const delay = calculateDelay(1, DEFAULT_RETRY_CONFIG)
      expect(delay).toBe(1000)
    })

    it('should increase delay exponentially', () => {
      const delay1 = calculateDelay(1, DEFAULT_RETRY_CONFIG)
      const delay2 = calculateDelay(2, DEFAULT_RETRY_CONFIG)
      const delay3 = calculateDelay(3, DEFAULT_RETRY_CONFIG)

      expect(delay2).toBe(delay1 * 2)
      expect(delay3).toBe(delay1 * 4)
    })

    it('should cap at maxDelayMs', () => {
      const config = { ...DEFAULT_RETRY_CONFIG, maxDelayMs: 5000 }
      const delay = calculateDelay(10, config)
      expect(delay).toBe(5000)
    })
  })

  describe('retry', () => {
    it('should return result on first success', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      
      const result = await retry(fn)
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      
      const result = await retry(fn, { initialDelayMs: 10 })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should throw after max attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('always fails'))
      
      await expect(retry(fn, { maxAttempts: 3, initialDelayMs: 10 }))
        .rejects.toThrow('always fails')
      
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should respect shouldRetry predicate', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('do not retry'))
      const shouldRetry = vi.fn().mockReturnValue(false)
      
      await expect(retry(fn, { shouldRetry, initialDelayMs: 10 }))
        .rejects.toThrow('do not retry')
      
      expect(fn).toHaveBeenCalledTimes(1)
      expect(shouldRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('retryPredicates', () => {
    it('networkErrors should match network-related errors', () => {
      expect(retryPredicates.networkErrors(new Error('network error'))).toBe(true)
      expect(retryPredicates.networkErrors(new Error('ECONNREFUSED'))).toBe(true)
      expect(retryPredicates.networkErrors(new Error('timeout'))).toBe(true)
      expect(retryPredicates.networkErrors(new Error('not found'))).toBe(false)
    })

    it('rateLimitErrors should match rate limit errors', () => {
      expect(retryPredicates.rateLimitErrors(new Error('429 Too Many Requests'))).toBe(true)
      expect(retryPredicates.rateLimitErrors(new Error('rate limit exceeded'))).toBe(true)
      expect(retryPredicates.rateLimitErrors(new Error('bad request'))).toBe(false)
    })

    it('serverErrors should match 5xx errors', () => {
      expect(retryPredicates.serverErrors(new Error('500 Internal Server Error'))).toBe(true)
      expect(retryPredicates.serverErrors(new Error('503 Service Unavailable'))).toBe(true)
      expect(retryPredicates.serverErrors(new Error('400 Bad Request'))).toBe(false)
    })

    it('transientErrors should match all transient error types', () => {
      expect(retryPredicates.transientErrors(new Error('network error'))).toBe(true)
      expect(retryPredicates.transientErrors(new Error('429'))).toBe(true)
      expect(retryPredicates.transientErrors(new Error('500'))).toBe(true)
      expect(retryPredicates.transientErrors(new Error('invalid input'))).toBe(false)
    })
  })

  describe('retryTransient', () => {
    it('should retry on transient errors', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue('success')
      
      const result = await retryTransient(fn, { initialDelayMs: 10 })
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should not retry on non-transient errors', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('invalid input'))
      
      await expect(retryTransient(fn, { initialDelayMs: 10 }))
        .rejects.toThrow('invalid input')
      
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })
})
