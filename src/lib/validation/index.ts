import { z } from 'zod'

/**
 * Validation Utilities
 * 
 * Common validation schemas and helpers.
 */

// Common ID patterns
export const idSchema = z.string().min(1).max(100)
export const cuidSchema = z.string().regex(/^c[a-z0-9]{24}$/, 'Invalid CUID')

// Stage name validation
export const stageNameSchema = z.enum([
  'RESEARCH',
  'SCRIPT', 
  'VOICE',
  'MUSIC',
  'VISUAL',
  'EDITOR',
  'PUBLISH',
])

// Pipeline status validation
export const pipelineStatusSchema = z.enum([
  'DRAFT',
  'RUNNING',
  'COMPLETE',
  'FAILED',
])

// Stage status validation  
export const stageStatusSchema = z.enum([
  'PENDING',
  'CLAIMED',
  'RUNNING',
  'COMPLETE',
  'FAILED',
  'SKIPPED',
])

// Agent info
export const agentSchema = z.object({
  agentId: z.string().min(1).max(100),
  agentName: z.string().min(1).max(100),
})

// Pagination
export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

// URL validation
export const urlSchema = z.string().url()
export const optionalUrlSchema = z.string().url().optional()

// Percentage (0-100)
export const percentageSchema = z.number().min(0).max(100)

// Duration in seconds
export const durationSchema = z.number().min(0)

// Wallet address (basic Ethereum format)
export const walletAddressSchema = z.string().regex(
  /^0x[a-fA-F0-9]{40}$/,
  'Invalid Ethereum address'
)

/**
 * Validate and parse with a schema, returning result object
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError['errors'] } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return { success: false, errors: result.error.errors }
}

/**
 * Validate or throw
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Create a validation middleware result
 */
export function validationError(errors: z.ZodError['errors']) {
  return {
    error: 'Validation failed',
    details: errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    })),
  }
}
