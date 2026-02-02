import { z } from "zod"
import {
  StageHandler,
  StageContext,
  StageResult,
  ValidationResult,
  MusicOutput,
  ScriptOutput,
} from "./types"

// Input schema - expects script output for duration/mood context
const MusicInputSchema = z.object({
  duration: z.number().min(10).max(600).optional(),
  mood: z.enum(["upbeat", "calm", "dramatic", "neutral"]).optional(),
  genre: z.enum(["electronic", "acoustic", "ambient", "cinematic", "lofi"]).optional(),
})

// Free royalty-free music sources we could integrate
const MUSIC_SOURCES = {
  // Pixabay Music API (free, no attribution required for most)
  pixabay: "https://pixabay.com/api/videos/",
  // FreePD - public domain music
  freepd: "https://freepd.com/",
  // Free Music Archive
  fma: "https://freemusicarchive.org/",
}

export const musicStage: StageHandler = {
  name: "MUSIC",

  validate(input: unknown): ValidationResult {
    const result = MusicInputSchema.safeParse(input)
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      }
    }
    return { valid: true }
  },

  async execute(context: StageContext): Promise<StageResult> {
    try {
      // Get script from previous stage for duration context
      const script = context.previousOutput as ScriptOutput | undefined
      const input = context.input as z.infer<typeof MusicInputSchema>
      
      // Determine target duration from script or input
      const duration = input.duration || script?.estimatedDuration || 60
      const mood = input.mood || inferMoodFromScript(script)
      const genre = input.genre || "ambient"

      // For now, use curated free tracks
      // In production, would call a music API
      const track = selectTrack(duration, mood, genre)

      const output: MusicOutput = {
        audioUrl: track.url,
        duration: track.duration,
        bpm: track.bpm,
        genre: track.genre,
        source: track.source,
      }

      return {
        success: true,
        output,
        metadata: {
          requestedMood: mood,
          requestedGenre: genre,
          matchedTrack: track.name,
        },
      }
    } catch (error) {
      return {
        success: false,
        output: null,
        error: (error as Error).message,
      }
    }
  },
}

function inferMoodFromScript(script: ScriptOutput | undefined): "upbeat" | "calm" | "dramatic" | "neutral" {
  if (!script) return "neutral"
  
  const text = script.fullScript.toLowerCase()
  
  // Simple keyword-based mood detection
  const upbeatWords = ["exciting", "amazing", "incredible", "awesome", "revolutionary"]
  const dramaticWords = ["danger", "warning", "critical", "urgent", "crisis"]
  const calmWords = ["simple", "easy", "relaxed", "peaceful", "gentle"]
  
  const upbeatScore = upbeatWords.filter(w => text.includes(w)).length
  const dramaticScore = dramaticWords.filter(w => text.includes(w)).length
  const calmScore = calmWords.filter(w => text.includes(w)).length
  
  const maxScore = Math.max(upbeatScore, dramaticScore, calmScore)
  
  if (maxScore === 0) return "neutral"
  if (upbeatScore === maxScore) return "upbeat"
  if (dramaticScore === maxScore) return "dramatic"
  return "calm"
}

interface Track {
  name: string
  url: string
  duration: number
  bpm: number
  genre: string
  mood: string
  source: string
}

// Curated list of free-to-use tracks
// In production, these would come from an API
const FREE_TRACKS: Track[] = [
  {
    name: "Ambient Technology",
    url: "https://cdn.pixabay.com/audio/2024/ambient-technology.mp3",
    duration: 120,
    bpm: 90,
    genre: "ambient",
    mood: "neutral",
    source: "pixabay",
  },
  {
    name: "Upbeat Corporate",
    url: "https://cdn.pixabay.com/audio/2024/upbeat-corporate.mp3",
    duration: 90,
    bpm: 120,
    genre: "electronic",
    mood: "upbeat",
    source: "pixabay",
  },
  {
    name: "Calm Piano",
    url: "https://cdn.pixabay.com/audio/2024/calm-piano.mp3",
    duration: 180,
    bpm: 60,
    genre: "acoustic",
    mood: "calm",
    source: "pixabay",
  },
  {
    name: "Dramatic Cinematic",
    url: "https://cdn.pixabay.com/audio/2024/dramatic-cinematic.mp3",
    duration: 150,
    bpm: 100,
    genre: "cinematic",
    mood: "dramatic",
    source: "pixabay",
  },
  {
    name: "Lofi Study",
    url: "https://cdn.pixabay.com/audio/2024/lofi-study.mp3",
    duration: 240,
    bpm: 75,
    genre: "lofi",
    mood: "calm",
    source: "pixabay",
  },
]

function selectTrack(duration: number, mood: string, genre: string): Track {
  // Find best matching track
  let candidates = FREE_TRACKS.filter(t => t.genre === genre)
  
  if (candidates.length === 0) {
    candidates = FREE_TRACKS.filter(t => t.mood === mood)
  }
  
  if (candidates.length === 0) {
    candidates = FREE_TRACKS
  }
  
  // Find track closest to requested duration
  candidates.sort((a, b) => {
    const aDiff = Math.abs(a.duration - duration)
    const bDiff = Math.abs(b.duration - duration)
    return aDiff - bDiff
  })
  
  return candidates[0]
}
