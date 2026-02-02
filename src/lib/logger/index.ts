/**
 * Logger Utilities
 * 
 * Consistent logging with levels and structured output.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Get minimum log level from environment
function getMinLevel(): LogLevel {
  const env = process.env.LOG_LEVEL?.toLowerCase()
  if (env && env in LOG_LEVELS) {
    return env as LogLevel
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getMinLevel()]
}

function formatLog(entry: LogEntry): string {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`
  const contextStr = entry.context 
    ? ` ${JSON.stringify(entry.context)}`
    : ''
  return `${prefix} ${entry.message}${contextStr}`
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  if (!shouldLog(level)) return

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  }

  const formatted = formatLog(entry)

  switch (level) {
    case 'debug':
      console.debug(formatted)
      break
    case 'info':
      console.info(formatted)
      break
    case 'warn':
      console.warn(formatted)
      break
    case 'error':
      console.error(formatted)
      break
  }

  return entry
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
}

/**
 * Create a child logger with preset context
 */
export function createLogger(baseContext: Record<string, unknown>) {
  return {
    debug: (message: string, context?: Record<string, unknown>) => 
      log('debug', message, { ...baseContext, ...context }),
    info: (message: string, context?: Record<string, unknown>) => 
      log('info', message, { ...baseContext, ...context }),
    warn: (message: string, context?: Record<string, unknown>) => 
      log('warn', message, { ...baseContext, ...context }),
    error: (message: string, context?: Record<string, unknown>) => 
      log('error', message, { ...baseContext, ...context }),
  }
}

/**
 * Log a pipeline event
 */
export function logPipeline(pipelineId: string, message: string, context?: Record<string, unknown>) {
  logger.info(message, { pipelineId, ...context })
}

/**
 * Log a stage event
 */
export function logStage(
  pipelineId: string, 
  stageName: string, 
  message: string, 
  context?: Record<string, unknown>
) {
  logger.info(message, { pipelineId, stage: stageName, ...context })
}
