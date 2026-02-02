import { describe, it, expect, vi, beforeEach } from "vitest"
import { publishStage } from "./publish"
import { StageContext, EditorOutput, PublishOutput } from "./types"

describe("Publish Stage", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("validate", () => {
    it("accepts empty input", () => {
      const result = publishStage.validate({})
      expect(result.valid).toBe(true)
    })

    it("accepts valid platforms array", () => {
      const result = publishStage.validate({ platforms: ["youtube", "tiktok"] })
      expect(result.valid).toBe(true)
    })

    it("rejects invalid platform", () => {
      const result = publishStage.validate({ platforms: ["myspace"] })
      expect(result.valid).toBe(false)
    })

    it("accepts valid title and description", () => {
      const result = publishStage.validate({
        title: "Test Video",
        description: "A test video description",
        tags: ["test", "demo"],
      })
      expect(result.valid).toBe(true)
    })

    it("accepts scheduled time", () => {
      const result = publishStage.validate({
        scheduled: "2024-12-31T23:59:59Z",
      })
      expect(result.valid).toBe(true)
    })
  })

  describe("execute", () => {
    const mockEditorOutput: EditorOutput = {
      videoUrl: "https://storage.example.com/video.mp4",
      duration: 60,
      thumbnailUrl: "https://storage.example.com/thumb.jpg",
      format: { width: 1080, height: 1920, fps: 30 },
      renderTime: 120,
    }

    it("publishes to default platform (YouTube)", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: mockEditorOutput,
      }

      const result = await publishStage.execute(context)

      expect(result.success).toBe(true)
      const output = result.output as PublishOutput
      expect(output.platforms).toHaveLength(1)
      expect(output.platforms[0].platform).toBe("youtube")
      expect(output.publishedAt).toBeDefined()
    })

    it("publishes to multiple platforms", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: { platforms: ["youtube", "tiktok", "twitter"] },
        previousOutput: mockEditorOutput,
      }

      const result = await publishStage.execute(context)

      expect(result.success).toBe(true)
      const output = result.output as PublishOutput
      expect(output.platforms).toHaveLength(3)
    })

    it("includes post URLs in results", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: { platforms: ["youtube"] },
        previousOutput: mockEditorOutput,
      }

      const result = await publishStage.execute(context)

      expect(result.success).toBe(true)
      const output = result.output as PublishOutput
      expect(output.platforms[0].url).toContain("youtube.com")
      expect(output.platforms[0].postId).toBeDefined()
    })

    it("fails when no video URL provided", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
        previousOutput: { videoUrl: null },
      }

      const result = await publishStage.execute(context)

      expect(result.success).toBe(false)
      expect(result.error).toContain("No video URL")
    })

    it("fails when previous output is missing", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {},
      }

      const result = await publishStage.execute(context)

      expect(result.success).toBe(false)
    })

    it("returns metadata about publish results", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: { platforms: ["youtube", "tiktok"] },
        previousOutput: mockEditorOutput,
      }

      const result = await publishStage.execute(context)

      expect(result.metadata).toHaveProperty("platformCount", 2)
      expect(result.metadata).toHaveProperty("successCount")
      expect(result.metadata).toHaveProperty("failureCount")
    })

    it("uses provided title and description", async () => {
      const context: StageContext = {
        pipelineId: "test-pipeline",
        stageId: "test-stage",
        input: {
          platforms: ["youtube"],
          title: "My Custom Title",
          description: "My custom description",
          tags: ["custom", "video"],
        },
        previousOutput: mockEditorOutput,
      }

      const result = await publishStage.execute(context)

      expect(result.success).toBe(true)
    })
  })
})
