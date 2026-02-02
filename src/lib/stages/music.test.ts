import { describe, it, expect, vi, beforeEach } from "vitest"
import { musicStage } from "./music"
import { StageContext, ScriptOutput, MusicOutput } from "./types"

describe("Music Stage", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("validate", () => {
    it("accepts empty input", () => {
      const result = musicStage.validate({})
      expect(result.valid).toBe(true)
    })

    it("accepts valid duration", () => {
      const result = musicStage.validate({ duration: 60 })
      expect(result.valid).toBe(true)
    })

    it("rejects duration too short", () => {
      const result = musicStage.validate({ duration: 5 })
      expect(result.valid).toBe(false)
    })

    it("rejects duration too long", () => {
      const result = musicStage.validate({ duration: 1000 })
      expect(result.valid).toBe(false)
    })

    it("accepts valid mood", () => {
      const result = musicStage.validate({ mood: "upbeat" })
      expect(result.valid).toBe(true)
    })

    it("rejects invalid mood", () => {
      const result = musicStage.validate({ mood: "angry" })
      expect(result.valid).toBe(false)
    })

    it("accepts valid genre", () => {
      const result = musicStage.validate({ genre: "lofi" })
      expect(result.valid).toBe(true)
    })
  })

  describe("execute", () => {
    const mockScript: ScriptOutput = {
      hook: "Test hook",
      body: [{ heading: "Test", content: "Test content", visualCue: "test", duration: 10 }],
      cta: "Test CTA",
      fullScript: "This is an amazing test script with exciting content",
      estimatedDuration: 60,
      speakerNotes: [],
    }

    it("returns a music track", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: mockScript,
      }

      const result = await musicStage.execute(context)

      expect(result.success).toBe(true)
      const output = result.output as MusicOutput
      expect(output.audioUrl).toBeDefined()
      expect(output.duration).toBeGreaterThan(0)
      expect(output.source).toBeDefined()
    })

    it("uses input duration when provided", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: { duration: 120, genre: "ambient" },
        previousOutput: mockScript,
      }

      const result = await musicStage.execute(context)

      expect(result.success).toBe(true)
      expect(result.metadata?.requestedGenre).toBe("ambient")
    })

    it("infers mood from script content", async () => {
      const excitingScript: ScriptOutput = {
        ...mockScript,
        fullScript: "This is an amazing and exciting revolutionary product!",
      }

      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: excitingScript,
      }

      const result = await musicStage.execute(context)

      expect(result.success).toBe(true)
      expect(result.metadata?.requestedMood).toBe("upbeat")
    })

    it("handles missing previous output", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: { duration: 90 },
      }

      const result = await musicStage.execute(context)

      expect(result.success).toBe(true)
      const output = result.output as MusicOutput
      expect(output.duration).toBeGreaterThan(0)
    })

    it("returns metadata about the selection", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: { mood: "calm", genre: "lofi" },
        previousOutput: mockScript,
      }

      const result = await musicStage.execute(context)

      expect(result.success).toBe(true)
      expect(result.metadata).toHaveProperty("requestedMood")
      expect(result.metadata).toHaveProperty("requestedGenre")
      expect(result.metadata).toHaveProperty("matchedTrack")
    })
  })
})
