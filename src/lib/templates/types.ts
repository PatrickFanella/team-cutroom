/**
 * Video Template System
 * 
 * Modular configuration for generating different styles of short-form video content.
 * Templates combine presets for voice, visuals, audio, and layout.
 */

import { z } from 'zod'

// ============================================================================
// VOICE CONFIGURATION
// ============================================================================

export const VoiceProviderSchema = z.enum(['elevenlabs', 'openai', 'google', 'azure', 'local'])
export type VoiceProvider = z.infer<typeof VoiceProviderSchema>

export const VoiceStyleSchema = z.enum(['neutral', 'excited', 'calm', 'dramatic', 'whisper', 'angry', 'sad', 'cheerful'])
export type VoiceStyle = z.infer<typeof VoiceStyleSchema>

export const VoiceEffectSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('reverb'), amount: z.number().min(0).max(1) }),
  z.object({ type: z.literal('echo'), delay: z.number().min(0).max(2) }),
  z.object({ type: z.literal('pitch'), semitones: z.number().min(-12).max(12) }),
  z.object({ type: z.literal('robot') }),
  z.object({ type: z.literal('telephone') }),
  z.object({ type: z.literal('radio') }),
])
export type VoiceEffect = z.infer<typeof VoiceEffectSchema>

export const NarratorConfigSchema = z.object({
  provider: VoiceProviderSchema,
  voiceId: z.string(),
  style: VoiceStyleSchema.optional(),
  speed: z.number().min(0.5).max(2.0).optional(),
  pitch: z.number().min(-12).max(12).optional(),
})
export type NarratorConfig = z.infer<typeof NarratorConfigSchema>

export const CharacterVoiceSchema = z.object({
  name: z.string(),
  voiceId: z.string(),
  provider: VoiceProviderSchema.optional(),
  pitch: z.number().min(-12).max(12).optional(),
  speed: z.number().min(0.5).max(2.0).optional(),
  style: VoiceStyleSchema.optional(),
  icon: z.string().url().optional(),
  color: z.string().optional(), // Caption color
})
export type CharacterVoice = z.infer<typeof CharacterVoiceSchema>

export const VoicePresetSchema = z.object({
  narrator: NarratorConfigSchema.optional(),
  characters: z.array(CharacterVoiceSchema).optional(),
  effects: z.array(VoiceEffectSchema).optional(),
})
export type VoicePreset = z.infer<typeof VoicePresetSchema>

// ============================================================================
// VISUAL CONFIGURATION
// ============================================================================

export const BackgroundTypeSchema = z.enum(['broll', 'gameplay', 'static', 'gradient', 'particles', 'video'])
export type BackgroundType = z.infer<typeof BackgroundTypeSchema>

export const BRollSourceSchema = z.enum(['pexels', 'pixabay', 'storyblocks', 'custom'])
export type BRollSource = z.infer<typeof BRollSourceSchema>

export const GameplayTypeSchema = z.enum([
  'minecraft-parkour',
  'subway-surfers',
  'temple-run',
  'gta-driving',
  'fortnite-building',
  'satisfying-clips',
  'cooking-asmr',
  'slime-asmr',
  'custom'
])
export type GameplayType = z.infer<typeof GameplayTypeSchema>

export const MotionStyleSchema = z.enum(['static', 'slow-zoom', 'ken-burns', 'parallax', 'drift'])
export type MotionStyle = z.infer<typeof MotionStyleSchema>

export const BackgroundConfigSchema = z.object({
  type: BackgroundTypeSchema,
  
  // For b-roll
  sources: z.array(BRollSourceSchema).optional(),
  searchTerms: z.array(z.string()).optional(),
  
  // For gameplay
  game: GameplayTypeSchema.optional(),
  gameplayUrl: z.string().url().optional(),
  
  // For static/gradient
  color: z.string().optional(),
  gradient: z.tuple([z.string(), z.string()]).optional(),
  
  // For video
  videoUrl: z.string().url().optional(),
  loop: z.boolean().optional(),
  
  // Motion
  motion: MotionStyleSchema.optional(),
  
  // Opacity for layering
  opacity: z.number().min(0).max(1).optional(),
})
export type BackgroundConfig = z.infer<typeof BackgroundConfigSchema>

export const CharacterPositionSchema = z.enum(['left', 'right', 'center', 'bottom-left', 'bottom-right'])
export type CharacterPosition = z.infer<typeof CharacterPositionSchema>

export const CharacterAnimationsSchema = z.object({
  idle: z.string().optional(),
  talking: z.string().optional(),
  laughing: z.string().optional(),
  shocked: z.string().optional(),
  thinking: z.string().optional(),
  celebrating: z.string().optional(),
})
export type CharacterAnimations = z.infer<typeof CharacterAnimationsSchema>

export const CharacterSpriteSchema = z.object({
  name: z.string(),
  spriteUrl: z.string(),
  position: CharacterPositionSchema,
  scale: z.number().min(0.1).max(3).optional(),
  animations: CharacterAnimationsSchema.optional(),
})
export type CharacterSprite = z.infer<typeof CharacterSpriteSchema>

export const AvatarProviderSchema = z.enum(['heygen', 'did', 'synthesia', 'custom'])
export type AvatarProvider = z.infer<typeof AvatarProviderSchema>

export const ForegroundTypeSchema = z.enum(['characters', 'avatar', 'presenter', 'none'])
export type ForegroundType = z.infer<typeof ForegroundTypeSchema>

export const ForegroundConfigSchema = z.object({
  type: ForegroundTypeSchema,
  characters: z.array(CharacterSpriteSchema).optional(),
  avatar: z.object({
    provider: AvatarProviderSchema,
    avatarId: z.string(),
  }).optional(),
})
export type ForegroundConfig = z.infer<typeof ForegroundConfigSchema>

export const OverlayTypeSchema = z.enum([
  'captions',
  'speech-bubble',
  'progress-bar',
  'headline-banner',
  'lower-third',
  'source-citation',
  'reddit-header',
  'storybook-frame',
  'particles',
  'emoji-reactions',
  'timer',
  'watermark',
  'custom'
])
export type OverlayType = z.infer<typeof OverlayTypeSchema>

export const OverlayPositionSchema = z.enum([
  'top', 'top-left', 'top-right',
  'center', 'center-left', 'center-right',
  'bottom', 'bottom-left', 'bottom-right'
])
export type OverlayPosition = z.infer<typeof OverlayPositionSchema>

export const OverlayConfigSchema = z.object({
  type: OverlayTypeSchema,
  position: OverlayPositionSchema.optional(),
  style: z.record(z.unknown()).optional(),
  followSpeaker: z.boolean().optional(),
  content: z.string().optional(),
})
export type OverlayConfig = z.infer<typeof OverlayConfigSchema>

export const TransitionStyleSchema = z.enum(['cut', 'crossfade', 'swipe', 'zoom', 'glitch', 'slide', 'wipe', 'none'])
export type TransitionStyle = z.infer<typeof TransitionStyleSchema>

export const ColorGradeSchema = z.object({
  warmth: z.number().min(-1).max(1).optional(),
  saturation: z.number().min(-1).max(1).optional(),
  contrast: z.number().min(-1).max(1).optional(),
  brightness: z.number().min(-1).max(1).optional(),
  vignette: z.number().min(0).max(1).optional(),
  filter: z.enum(['none', 'vintage', 'noir', 'sepia', 'cool', 'warm']).optional(),
})
export type ColorGrade = z.infer<typeof ColorGradeSchema>

export const VisualsPresetSchema = z.object({
  background: BackgroundConfigSchema,
  foreground: ForegroundConfigSchema.optional(),
  overlays: z.array(OverlayConfigSchema),
  transitions: TransitionStyleSchema,
  colorGrade: ColorGradeSchema.optional(),
})
export type VisualsPreset = z.infer<typeof VisualsPresetSchema>

// ============================================================================
// AUDIO CONFIGURATION
// ============================================================================

export const MusicMoodSchema = z.enum([
  'upbeat', 'calm', 'dramatic', 'funny', 'scary', 'lofi',
  'inspiring', 'romantic', 'action', 'mysterious', 'sad', 'neutral'
])
export type MusicMood = z.infer<typeof MusicMoodSchema>

export const MusicSourceSchema = z.enum(['pixabay', 'epidemic', 'artlist', 'custom', 'none'])
export type MusicSource = z.infer<typeof MusicSourceSchema>

export const MusicConfigSchema = z.object({
  source: MusicSourceSchema,
  mood: MusicMoodSchema.optional(),
  trackUrl: z.string().url().optional(),
  volume: z.number().min(0).max(1),
  ducking: z.boolean(), // Lower during voice
  fadeIn: z.number().optional(),
  fadeOut: z.number().optional(),
})
export type MusicConfig = z.infer<typeof MusicConfigSchema>

export const SfxSourceSchema = z.enum(['freesound', 'custom', 'ai-generated'])
export type SfxSource = z.infer<typeof SfxSourceSchema>

export const SfxConfigSchema = z.object({
  source: SfxSourceSchema,
  autoAdd: z.boolean().optional(),
  library: z.array(z.string()).optional(),
})
export type SfxConfig = z.infer<typeof SfxConfigSchema>

export const AmbientTypeSchema = z.enum(['none', 'rain', 'forest', 'city', 'space', 'fire', 'ocean', 'wind', 'cafe'])
export type AmbientType = z.infer<typeof AmbientTypeSchema>

export const AmbientConfigSchema = z.object({
  type: AmbientTypeSchema,
  volume: z.number().min(0).max(1),
})
export type AmbientConfig = z.infer<typeof AmbientConfigSchema>

export const AudioPresetSchema = z.object({
  music: MusicConfigSchema.optional(),
  sfx: SfxConfigSchema.optional(),
  ambient: AmbientConfigSchema.optional(),
})
export type AudioPreset = z.infer<typeof AudioPresetSchema>

// ============================================================================
// LAYOUT CONFIGURATION
// ============================================================================

export const AspectRatioSchema = z.enum(['9:16', '16:9', '1:1', '4:5', '4:3'])
export type AspectRatio = z.infer<typeof AspectRatioSchema>

export const CaptionAnimationSchema = z.enum(['none', 'word-by-word', 'karaoke', 'typewriter', 'bounce', 'fade'])
export type CaptionAnimation = z.infer<typeof CaptionAnimationSchema>

export const CaptionStyleSchema = z.object({
  font: z.string(),
  fontSize: z.enum(['small', 'medium', 'large', 'xlarge']),
  color: z.string(),
  backgroundColor: z.string().optional(),
  stroke: z.object({
    color: z.string(),
    width: z.number(),
  }).optional(),
  shadow: z.boolean().optional(),
  uppercase: z.boolean().optional(),
})
export type CaptionStyle = z.infer<typeof CaptionStyleSchema>

export const CaptionConfigSchema = z.object({
  enabled: z.boolean(),
  style: CaptionStyleSchema.optional(),
  position: OverlayPositionSchema,
  animation: CaptionAnimationSchema.optional(),
  maxWordsPerLine: z.number().optional(),
  highlightColor: z.string().optional(),
})
export type CaptionConfig = z.infer<typeof CaptionConfigSchema>

export const BrandingConfigSchema = z.object({
  logo: z.string().url().optional(),
  watermark: z.string().url().optional(),
  watermarkPosition: OverlayPositionSchema.optional(),
  watermarkOpacity: z.number().min(0).max(1).optional(),
  endCard: z.boolean().optional(),
  endCardDuration: z.number().optional(),
  cta: z.string().optional(),
})
export type BrandingConfig = z.infer<typeof BrandingConfigSchema>

export const SafeZoneSchema = z.object({
  top: z.number().min(0).max(50),
  bottom: z.number().min(0).max(50),
  left: z.number().min(0).max(50),
  right: z.number().min(0).max(50),
})
export type SafeZone = z.infer<typeof SafeZoneSchema>

export const LayoutPresetSchema = z.object({
  aspectRatio: AspectRatioSchema,
  captions: CaptionConfigSchema,
  branding: BrandingConfigSchema.optional(),
  safeZone: SafeZoneSchema,
})
export type LayoutPreset = z.infer<typeof LayoutPresetSchema>

// ============================================================================
// CONTENT STRUCTURE
// ============================================================================

export const ContentFormatSchema = z.enum([
  'monologue',      // Single narrator
  'dialog',         // Character conversation
  'listicle',       // "Top 5...", numbered sections
  'story',          // Narrative arc
  'qa',             // Question and answer
  'comparison',     // A vs B
  'tutorial',       // Step-by-step
  'interview',      // Host + guest
  'debate',         // Two opposing views
])
export type ContentFormat = z.infer<typeof ContentFormatSchema>

export const HookStyleSchema = z.enum(['question', 'statistic', 'controversial', 'story', 'direct', 'shocking', 'relatable'])
export type HookStyle = z.infer<typeof HookStyleSchema>

export const ContentStructureSchema = z.object({
  format: ContentFormatSchema,
  
  pacing: z.object({
    introDuration: z.number().min(0).max(30),
    sectionGap: z.number().min(0).max(5),
    outroDuration: z.number().min(0).max(30),
    wordsPerMinute: z.number().min(80).max(220),
  }),
  
  hooks: z.object({
    style: HookStyleSchema,
    position: z.enum(['start', 'both', 'none']),
  }),
  
  cta: z.object({
    enabled: z.boolean(),
    text: z.string().optional(),
    position: z.enum(['end', 'middle-and-end', 'none']),
  }),
  
  sections: z.object({
    min: z.number().min(1).max(20).optional(),
    max: z.number().min(1).max(20).optional(),
  }).optional(),
})
export type ContentStructure = z.infer<typeof ContentStructureSchema>

// ============================================================================
// PLATFORM CONFIGURATION
// ============================================================================

export const PlatformSchema = z.enum([
  'tiktok',
  'youtube-shorts',
  'instagram-reels',
  'youtube',
  'twitter',
  'facebook',
  'linkedin',
  'snapchat',
])
export type Platform = z.infer<typeof PlatformSchema>

export const PlatformConfigSchema = z.object({
  platform: PlatformSchema,
  maxDuration: z.number().optional(),
  aspectRatio: AspectRatioSchema.optional(),
  safeZone: SafeZoneSchema.optional(),
})
export type PlatformConfig = z.infer<typeof PlatformConfigSchema>

// ============================================================================
// VIDEO TEMPLATE (complete)
// ============================================================================

export const TemplateCategorySchema = z.enum([
  'educational',
  'entertainment',
  'character-dialog',
  'story',
  'news',
  'gaming',
  'podcast',
  'meme',
  'product',
  'tutorial',
  'custom',
])
export type TemplateCategory = z.infer<typeof TemplateCategorySchema>

export const VideoTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: TemplateCategorySchema,
  thumbnail: z.string().url().optional(),
  
  // Presets
  voice: VoicePresetSchema,
  visuals: VisualsPresetSchema,
  audio: AudioPresetSchema,
  layout: LayoutPresetSchema,
  structure: ContentStructureSchema,
  
  // Platform support
  platforms: z.array(PlatformSchema),
  
  // Metadata
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  version: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export type VideoTemplate = z.infer<typeof VideoTemplateSchema>

// ============================================================================
// TEMPLATE CUSTOMIZATION (user overrides)
// ============================================================================

export const TemplateCustomizationSchema = z.object({
  voice: VoicePresetSchema.partial().optional(),
  visuals: VisualsPresetSchema.partial().optional(),
  audio: AudioPresetSchema.partial().optional(),
  layout: LayoutPresetSchema.partial().optional(),
  structure: ContentStructureSchema.partial().optional(),
})
export type TemplateCustomization = z.infer<typeof TemplateCustomizationSchema>

// ============================================================================
// PIPELINE REQUEST WITH TEMPLATE
// ============================================================================

export const TemplatePipelineRequestSchema = z.object({
  topic: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  templateId: z.string(),
  customization: TemplateCustomizationSchema.optional(),
  platforms: z.array(PlatformSchema).optional(),
  targetDuration: z.number().min(10).max(600).optional(),
})
export type TemplatePipelineRequest = z.infer<typeof TemplatePipelineRequestSchema>
