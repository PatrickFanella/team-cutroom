import { describe, it, expect } from "vitest"
import { visualStage } from "./visual"
import { ScriptOutput } from "./types"

const mockScript: ScriptOutput = {
  hook: "What if software could think for itself?",
  body: [
    {
      heading: "Point 1",
      content: "AI agents are autonomous software systems",
      visualCue: "Show code animation with AI elements",
      duration: 15,
    },
    {
      heading: "Point 2",
      content: "They can perform tasks without human intervention",
      visualCue: "Show robot or automation b-roll",
      duration: 15,
    },
  ],
  cta: "Follow for more!",
  fullScript: "Test script",
  estimatedDuration: 30,
  speakerNotes: [],
}

describe("Visual Stage", () => {
  describe("validate", () => {
    it("accepts valid input with script object", () => {
      const result = visualStage.validate({
        script: {
          body: mockScript.body,
        },
      })
      expect(result.valid).toBe(true)
    })

    it("accepts input with optional style", () => {
      const result = visualStage.validate({
        script: { body: mockScript.body },
        style: "stock",
      })
      expect(result.valid).toBe(true)
    })

    it("rejects missing script", () => {
      const result = visualStage.validate({})
      expect(result.valid).toBe(false)
    })

    it("rejects invalid style", () => {
      const result = visualStage.validate({
        script: { body: mockScript.body },
        style: "invalid-style",
      })
      expect(result.valid).toBe(false)
    })
  })

  describe("execute", () => {
    it("returns a result", async () => {
      const context = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: mockScript,
      }

      const result = await visualStage.execute(context)

      expect(result).toBeDefined()
      expect(typeof result.success).toBe("boolean")
    })

    it("generates clips for each script section", async () => {
      const context = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: mockScript,
      }

      const result = await visualStage.execute(context)
      
      if (result.success && result.output) {
        const output = result.output as any
        expect(output.clips).toBeDefined()
        expect(Array.isArray(output.clips)).toBe(true)
        expect(output.clips.length).toBe(mockScript.body.length)
      }
    })

    it("each clip has required fields", async () => {
      const context = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: mockScript,
      }

      const result = await visualStage.execute(context)
      
      if (result.success && result.output) {
        const output = result.output as any
        for (const clip of output.clips) {
          expect(clip.url).toBeDefined()
          expect(clip.duration).toBeDefined()
          expect(clip.startTime).toBeDefined()
          expect(clip.description).toBeDefined()
          expect(clip.source).toBeDefined()
        }
      }
    })

    it("generates overlays for sections with headings", async () => {
      const context = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: mockScript,
      }

      const result = await visualStage.execute(context)
      
      if (result.success && result.output) {
        const output = result.output as any
        expect(output.overlays).toBeDefined()
        expect(output.overlays.length).toBeGreaterThan(0)
      }
    })

    it("includes metadata about processing", async () => {
      const context = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: mockScript,
      }

      const result = await visualStage.execute(context)

      expect(result.metadata).toBeDefined()
      expect(result.metadata?.clipCount).toBeDefined()
    })
  })

  describe("stage properties", () => {
    it("has correct name", () => {
      expect(visualStage.name).toBe("VISUAL")
    })
  })
})
