/**
 * Simple Event Emitter
 * 
 * Lightweight pub/sub for internal events.
 */

type EventHandler<T = unknown> = (data: T) => void | Promise<void>

interface EventSubscription {
  unsubscribe: () => void
}

class EventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  /**
   * Subscribe to an event
   */
  on<T = unknown>(event: string, handler: EventHandler<T>): EventSubscription {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    
    this.handlers.get(event)!.add(handler as EventHandler)
    
    return {
      unsubscribe: () => {
        this.handlers.get(event)?.delete(handler as EventHandler)
      },
    }
  }

  /**
   * Subscribe to an event for one emission only
   */
  once<T = unknown>(event: string, handler: EventHandler<T>): EventSubscription {
    const wrappedHandler: EventHandler<T> = (data) => {
      this.off(event, wrappedHandler as EventHandler)
      return handler(data)
    }
    
    return this.on(event, wrappedHandler)
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler)
  }

  /**
   * Emit an event
   */
  async emit<T = unknown>(event: string, data: T): Promise<void> {
    const handlers = this.handlers.get(event)
    if (!handlers) return

    const promises = Array.from(handlers).map(handler => {
      try {
        return Promise.resolve(handler(data))
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error)
        return Promise.resolve()
      }
    })

    await Promise.all(promises)
  }

  /**
   * Remove all handlers for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.handlers.delete(event)
    } else {
      this.handlers.clear()
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.handlers.get(event)?.size ?? 0
  }

  /**
   * Get all event names with listeners
   */
  eventNames(): string[] {
    return Array.from(this.handlers.keys())
  }
}

// Global event bus for the application
export const eventBus = new EventEmitter()

// Event type constants
export const EVENTS = {
  // Pipeline events
  PIPELINE_CREATED: 'pipeline.created',
  PIPELINE_STARTED: 'pipeline.started',
  PIPELINE_COMPLETED: 'pipeline.completed',
  PIPELINE_FAILED: 'pipeline.failed',
  
  // Stage events
  STAGE_CLAIMED: 'stage.claimed',
  STAGE_STARTED: 'stage.started',
  STAGE_COMPLETED: 'stage.completed',
  STAGE_FAILED: 'stage.failed',
  
  // Agent events
  AGENT_REGISTERED: 'agent.registered',
  AGENT_WORK_ASSIGNED: 'agent.work_assigned',
} as const

export { EventEmitter }
export type { EventHandler, EventSubscription }
