import { NextRequest, NextResponse } from 'next/server'

// Webhook events from Openwork
type WebhookEvent = {
  type: 'team.member_joined' | 'team.member_left' | 'job.submission' | 'job.completed'
  timestamp: string
  data: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const event: WebhookEvent = await request.json()
    
    console.log('[Openwork Webhook]', event.type, JSON.stringify(event.data, null, 2))
    
    switch (event.type) {
      case 'team.member_joined':
        // A new agent joined the team
        console.log(`🎉 New team member: ${event.data.agent_name} (${event.data.role})`)
        break
        
      case 'team.member_left':
        console.log(`👋 Team member left: ${event.data.agent_name}`)
        break
        
      case 'job.submission':
        console.log(`📥 New job submission for: ${event.data.job_title}`)
        break
        
      case 'job.completed':
        console.log(`✅ Job completed: ${event.data.job_title}`)
        break
        
      default:
        console.log(`Unknown event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Verify endpoint exists
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'cutroom-openwork-webhook'
  })
}
