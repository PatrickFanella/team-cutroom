import { describe, it, expect, beforeEach } from 'vitest'
import {
  registerWebhook,
  unregisterWebhook,
  listWebhooks,
  sendWebhook,
  WebhookEvent,
} from './index'

describe('Webhook System', () => {
  beforeEach(() => {
    // Clear all webhooks between tests
    for (const webhook of listWebhooks()) {
      unregisterWebhook(webhook.id)
    }
  })

  describe('registerWebhook', () => {
    it('should register a webhook', () => {
      registerWebhook('test-1', 'https://example.com/webhook', ['pipeline.created'])
      
      const webhooks = listWebhooks()
      expect(webhooks).toHaveLength(1)
      expect(webhooks[0].id).toBe('test-1')
      expect(webhooks[0].url).toBe('https://example.com/webhook')
      expect(webhooks[0].events).toContain('pipeline.created')
    })

    it('should register multiple webhooks', () => {
      registerWebhook('test-1', 'https://example.com/hook1', ['pipeline.created'])
      registerWebhook('test-2', 'https://example.com/hook2', ['stage.completed'])
      
      const webhooks = listWebhooks()
      expect(webhooks).toHaveLength(2)
    })

    it('should overwrite existing webhook with same id', () => {
      registerWebhook('test-1', 'https://old.com/webhook', ['pipeline.created'])
      registerWebhook('test-1', 'https://new.com/webhook', ['stage.completed'])
      
      const webhooks = listWebhooks()
      expect(webhooks).toHaveLength(1)
      expect(webhooks[0].url).toBe('https://new.com/webhook')
    })
  })

  describe('unregisterWebhook', () => {
    it('should remove a webhook', () => {
      registerWebhook('test-1', 'https://example.com/webhook', ['pipeline.created'])
      expect(listWebhooks()).toHaveLength(1)
      
      unregisterWebhook('test-1')
      expect(listWebhooks()).toHaveLength(0)
    })

    it('should handle non-existent webhook gracefully', () => {
      expect(() => unregisterWebhook('non-existent')).not.toThrow()
    })
  })

  describe('listWebhooks', () => {
    it('should return empty array when no webhooks', () => {
      expect(listWebhooks()).toEqual([])
    })

    it('should return all registered webhooks', () => {
      registerWebhook('hook-1', 'https://a.com', ['pipeline.created'])
      registerWebhook('hook-2', 'https://b.com', ['stage.completed', 'stage.failed'])
      
      const webhooks = listWebhooks()
      expect(webhooks).toHaveLength(2)
      
      const hook2 = webhooks.find(w => w.id === 'hook-2')
      expect(hook2?.events).toHaveLength(2)
    })
  })

  describe('sendWebhook', () => {
    it('should return empty results when no webhooks registered', async () => {
      const results = await sendWebhook('pipeline.created', { test: true })
      expect(results).toEqual([])
    })

    it('should only send to webhooks subscribed to the event', async () => {
      registerWebhook('hook-1', 'https://a.com', ['pipeline.created'])
      registerWebhook('hook-2', 'https://b.com', ['stage.completed'])
      
      // This would attempt to send to hook-1 but not hook-2
      // Since we can't mock fetch in this simple test, we just verify the logic
      const results = await sendWebhook('pipeline.created', { test: true })
      
      // Results will be rejected since the URLs don't exist, but that's expected
      expect(results).toHaveLength(1) // Only hook-1 subscribed to pipeline.created
    })
  })

  describe('webhook events', () => {
    const allEvents: WebhookEvent[] = [
      'pipeline.created',
      'pipeline.started',
      'pipeline.completed',
      'pipeline.failed',
      'stage.claimed',
      'stage.started',
      'stage.completed',
      'stage.failed',
    ]

    it('should support all event types', () => {
      registerWebhook('all-events', 'https://example.com', allEvents)
      
      const webhooks = listWebhooks()
      expect(webhooks[0].events).toHaveLength(8)
    })
  })
})
