import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventEmitter, eventBus, EVENTS } from './index'

describe('Event Emitter', () => {
  let emitter: EventEmitter

  beforeEach(() => {
    emitter = new EventEmitter()
  })

  describe('on', () => {
    it('should register a handler', () => {
      const handler = vi.fn()
      emitter.on('test', handler)
      
      expect(emitter.listenerCount('test')).toBe(1)
    })

    it('should call handler when event is emitted', async () => {
      const handler = vi.fn()
      emitter.on('test', handler)
      
      await emitter.emit('test', { data: 'value' })
      
      expect(handler).toHaveBeenCalledWith({ data: 'value' })
    })

    it('should return subscription with unsubscribe', () => {
      const handler = vi.fn()
      const subscription = emitter.on('test', handler)
      
      expect(emitter.listenerCount('test')).toBe(1)
      
      subscription.unsubscribe()
      
      expect(emitter.listenerCount('test')).toBe(0)
    })

    it('should support multiple handlers', async () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      emitter.on('test', handler1)
      emitter.on('test', handler2)
      
      await emitter.emit('test', 'data')
      
      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })
  })

  describe('once', () => {
    it('should only call handler once', async () => {
      const handler = vi.fn()
      emitter.once('test', handler)
      
      await emitter.emit('test', 'first')
      await emitter.emit('test', 'second')
      
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith('first')
    })
  })

  describe('off', () => {
    it('should remove a handler', async () => {
      const handler = vi.fn()
      emitter.on('test', handler)
      emitter.off('test', handler)
      
      await emitter.emit('test', 'data')
      
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('emit', () => {
    it('should do nothing for events with no handlers', async () => {
      await expect(emitter.emit('nonexistent', {})).resolves.toBeUndefined()
    })

    it('should handle async handlers', async () => {
      const results: number[] = []
      
      emitter.on('test', async () => {
        await new Promise(r => setTimeout(r, 10))
        results.push(1)
      })
      
      await emitter.emit('test', null)
      
      expect(results).toEqual([1])
    })

    it('should catch handler errors', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      emitter.on('test', () => {
        throw new Error('handler error')
      })
      
      await expect(emitter.emit('test', null)).resolves.toBeUndefined()
      
      expect(errorSpy).toHaveBeenCalled()
      errorSpy.mockRestore()
    })
  })

  describe('removeAllListeners', () => {
    it('should remove all listeners for an event', () => {
      emitter.on('test1', vi.fn())
      emitter.on('test1', vi.fn())
      emitter.on('test2', vi.fn())
      
      emitter.removeAllListeners('test1')
      
      expect(emitter.listenerCount('test1')).toBe(0)
      expect(emitter.listenerCount('test2')).toBe(1)
    })

    it('should remove all listeners when no event specified', () => {
      emitter.on('test1', vi.fn())
      emitter.on('test2', vi.fn())
      
      emitter.removeAllListeners()
      
      expect(emitter.eventNames()).toEqual([])
    })
  })

  describe('listenerCount', () => {
    it('should return 0 for unknown events', () => {
      expect(emitter.listenerCount('unknown')).toBe(0)
    })

    it('should return correct count', () => {
      emitter.on('test', vi.fn())
      emitter.on('test', vi.fn())
      
      expect(emitter.listenerCount('test')).toBe(2)
    })
  })

  describe('eventNames', () => {
    it('should return all event names', () => {
      emitter.on('event1', vi.fn())
      emitter.on('event2', vi.fn())
      
      const names = emitter.eventNames()
      
      expect(names).toContain('event1')
      expect(names).toContain('event2')
    })
  })

  describe('eventBus', () => {
    it('should be a global instance', () => {
      expect(eventBus).toBeInstanceOf(EventEmitter)
    })
  })

  describe('EVENTS constants', () => {
    it('should have pipeline events', () => {
      expect(EVENTS.PIPELINE_CREATED).toBe('pipeline.created')
      expect(EVENTS.PIPELINE_COMPLETED).toBe('pipeline.completed')
    })

    it('should have stage events', () => {
      expect(EVENTS.STAGE_CLAIMED).toBe('stage.claimed')
      expect(EVENTS.STAGE_COMPLETED).toBe('stage.completed')
    })

    it('should have agent events', () => {
      expect(EVENTS.AGENT_REGISTERED).toBe('agent.registered')
    })
  })
})
