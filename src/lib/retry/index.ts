/**
 * Retry Utilities
 * 
 * Helpers for retrying failed operations with exponential backoff.
 */

export interface RetryConfig {
  maxAttempts: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  shouldRetry?: (error: Error, attempt: number) => boolean
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate delay for a given attempt using exponential backoff
 */
export function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1)
  return Math.min(delay, config.maxDelayMs)
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= fullConfig.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Check if we should retry
      if (fullConfig.shouldRetry && !fullConfig.shouldRetry(lastError, attempt)) {
        throw lastError
      }

      // If this was the last attempt, throw
      if (attempt === fullConfig.maxAttempts) {
        throw lastError
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, fullConfig)
      await sleep(delay)
    }
  }

  // This shouldn't happen, but TypeScript needs it
  throw lastError || new Error('Retry failed')
}

/**
 * Common retry predicates
 */
export const retryPredicates = {
  // Retry on network errors
  networkErrors: (error: Error) => {
    const message = error.message.toLowerCase()
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('enotfound')
    )
  },

  // Retry on rate limit errors (429)
  rateLimitErrors: (error: Error) => {
    return error.message.includes('429') || error.message.includes('rate limit')
  },

  // Retry on server errors (5xx)
  serverErrors: (error: Error) => {
    return /5\d\d/.test(error.message)
  },

  // Retry on transient errors (network, rate limit, server)
  transientErrors: (error: Error) => {
    return (
      retryPredicates.networkErrors(error) ||
      retryPredicates.rateLimitErrors(error) ||
      retryPredicates.serverErrors(error)
    )
  },
}

/**
 * Retry with common transient error handling
 */
export async function retryTransient<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  return retry(fn, {
    ...config,
    shouldRetry: (error) => retryPredicates.transientErrors(error),
  })
}
