import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, createLogger, logPipeline, logStage } from './index'

describe('Logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('logger', () => {
    it('should log debug messages', () => {
      logger.debug('test message')
      expect(console.debug).toHaveBeenCalled()
    })

    it('should log info messages', () => {
      logger.info('test message')
      expect(console.info).toHaveBeenCalled()
    })

    it('should log warn messages', () => {
      logger.warn('test message')
      expect(console.warn).toHaveBeenCalled()
    })

    it('should log error messages', () => {
      logger.error('test message')
      expect(console.error).toHaveBeenCalled()
    })

    it('should include context in log', () => {
      logger.info('test', { key: 'value' })
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('"key":"value"')
      )
    })

    it('should include timestamp in log', () => {
      logger.info('test')
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}/)
      )
    })

    it('should include level in log', () => {
      logger.info('test')
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]')
      )
    })
  })

  describe('createLogger', () => {
    it('should create logger with base context', () => {
      const childLogger = createLogger({ component: 'test' })
      childLogger.info('message')
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('"component":"test"')
      )
    })

    it('should merge additional context', () => {
      const childLogger = createLogger({ component: 'test' })
      childLogger.info('message', { extra: 'data' })
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('"component":"test"')
      )
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('"extra":"data"')
      )
    })
  })

  describe('logPipeline', () => {
    it('should log with pipelineId', () => {
      logPipeline('pipe-123', 'Pipeline started')
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('"pipelineId":"pipe-123"')
      )
    })
  })

  describe('logStage', () => {
    it('should log with pipelineId and stage', () => {
      logStage('pipe-123', 'RESEARCH', 'Stage claimed')
      
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('"pipelineId":"pipe-123"')
      )
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('"stage":"RESEARCH"')
      )
    })
  })
})
