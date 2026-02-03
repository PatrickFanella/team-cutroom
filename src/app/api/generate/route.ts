/**
 * POST /api/generate
 * 
 * One-shot video generation endpoint.
 * Creates a pipeline, runs all stages, returns the video.
 * 
 * This is a convenience endpoint for demos — in production,
 * you'd use the queue-based pipeline system.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getVideoTemplate } from '@/lib/templates'
import { createPipeline, createPipelineWithTemplate } from '@/lib/pipeline/manager'
import { researchStage } from '@/lib/stages/research'
import { scriptStage } from '@/lib/stages/script'
import { voiceStage } from '@/lib/stages/voice'
import { editorStage } from '@/lib/stages/editor'

const GenerateRequestSchema = z.object({
  topic: z.string().min(1),
  templateId: z.string().optional(),
  customization: z.any().optional(),
  duration: z.number().min(15).max(180).optional(), // 15s - 3min
  dryRun: z.boolean().optional(), // Skip actual API calls
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const input = GenerateRequestSchema.parse(body)
    
    // Load template if specified
    let template = undefined
    if (input.templateId) {
      template = getVideoTemplate(input.templateId)
      if (!template) {
        return NextResponse.json(
          { error: `Template not found: ${input.templateId}` },
          { status: 404 }
        )
      }
    }

    // Create pipeline
    let pipeline
    if (template) {
      pipeline = await createPipelineWithTemplate(input.topic, template, {
        customization: input.customization,
        targetDuration: input.duration,
      })
    } else {
      pipeline = await createPipeline(input.topic)
    }

    const pipelineId = pipeline.id
    const dryRun = input.dryRun ?? false

    // Stage context builder
    const createContext = (stageName: string, stageInput: any, previousOutput?: any) => ({
      pipelineId,
      stageId: `${pipelineId}-${stageName}`,
      agentId: 'generate-api',
      input: stageInput,
      previousOutput,
      dryRun,
    })

    // Run stages sequentially
    const results: Record<string, any> = {}

    // 1. Research
    const researchInput = {
      topic: input.topic,
      targetDuration: input.duration || 60,
    }
    const researchResult = await researchStage.execute(createContext('research', researchInput))
    if (!researchResult.success) {
      return NextResponse.json({
        error: 'Research stage failed',
        details: researchResult.error,
        stage: 'research',
      }, { status: 500 })
    }
    results.research = researchResult.output

    // 2. Script
    const scriptInput = {
      research: results.research,
      duration: input.duration || 60,
      structure: template?.structure,
      voice: template?.voice,
    }
    const scriptResult = await scriptStage.execute(
      createContext('script', scriptInput, results.research)
    )
    if (!scriptResult.success) {
      return NextResponse.json({
        error: 'Script stage failed',
        details: scriptResult.error,
        stage: 'script',
      }, { status: 500 })
    }
    results.script = scriptResult.output

    // 3. Voice (generate audio)
    const voiceInput = {
      script: results.script,
      voice: template?.voice,
    }
    const voiceResult = await voiceStage.execute(
      createContext('voice', voiceInput, results.script)
    )
    if (!voiceResult.success) {
      return NextResponse.json({
        error: 'Voice stage failed',
        details: voiceResult.error,
        stage: 'voice',
      }, { status: 500 })
    }
    results.voice = voiceResult.output

    // 4. Editor (render video)
    // Note: In dry run or without visuals, we create placeholder clips
    const editorInput = {
      voice: results.voice,
      visual: {
        clips: results.script.body.map((section: any, i: number) => ({
          url: section.visualCue || `placeholder-${i}`,
          startTime: i * 15,
          duration: section.duration || 15,
        })),
        overlays: [],
      },
      templateId: input.templateId,
      template: template,
    }
    const editorResult = await editorStage.execute(
      createContext('editor', editorInput)
    )
    if (!editorResult.success) {
      return NextResponse.json({
        error: 'Editor stage failed',
        details: editorResult.error,
        stage: 'editor',
      }, { status: 500 })
    }
    results.editor = editorResult.output

    const totalTime = (Date.now() - startTime) / 1000

    return NextResponse.json({
      success: true,
      pipelineId,
      templateId: input.templateId,
      video: {
        url: results.editor.videoUrl,
        thumbnailUrl: results.editor.thumbnailUrl,
        duration: results.editor.duration,
        format: results.editor.format,
      },
      script: {
        hook: results.script.hook,
        sections: results.script.body.length,
        cta: results.script.cta,
      },
      metadata: {
        totalTimeSeconds: totalTime,
        dryRun,
        stagesCompleted: ['research', 'script', 'voice', 'editor'],
      },
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request',
        details: error.errors,
      }, { status: 400 })
    }

    console.error('Generate error:', error)
    return NextResponse.json({
      error: 'Generation failed',
      details: (error as Error).message,
    }, { status: 500 })
  }
}
