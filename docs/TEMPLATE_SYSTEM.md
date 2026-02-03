# Cutroom Template System

## Vision

Cutroom should generate **any type of short-form video content** by swapping modular components. The same pipeline serves:

- Educational explainers
- Character conversations (SpongeBob/Patrick style)
- Reddit story narrations
- Bedtime stories for kids
- PSAs and infographics
- Gaming background content (Minecraft parkour, Subway Surfers)
- Podcast clips with animated avatars
- Meme compilations
- Product demos
- News summaries

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        VIDEO TEMPLATE                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  VOICE   │  │ VISUALS  │  │  MUSIC   │  │  LAYOUT  │        │
│  │  PRESET  │  │  PRESET  │  │  PRESET  │  │  PRESET  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│       │              │             │             │              │
│  ┌────▼────┐   ┌─────▼────┐  ┌─────▼────┐  ┌─────▼────┐        │
│  │ Voices  │   │ B-Roll   │  │ Tracks   │  │ Overlays │        │
│  │ Filters │   │ Chars    │  │ Effects  │  │ Captions │        │
│  │ Pacing  │   │ Anims    │  │ Mood     │  │ Branding │        │
│  └─────────┘   └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Template Definition

```typescript
interface VideoTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  
  // Voice configuration
  voice: VoicePreset
  
  // Visual configuration  
  visuals: VisualsPreset
  
  // Music/audio configuration
  audio: AudioPreset
  
  // Layout and styling
  layout: LayoutPreset
  
  // Content structure
  structure: ContentStructure
  
  // Platform optimizations
  platforms: PlatformConfig[]
}

type TemplateCategory = 
  | 'educational'
  | 'entertainment' 
  | 'character-dialog'
  | 'story'
  | 'news'
  | 'gaming'
  | 'podcast'
  | 'meme'
  | 'product'
  | 'custom'
```

---

## Voice Presets

```typescript
interface VoicePreset {
  // Primary narrator
  narrator: {
    provider: 'elevenlabs' | 'openai' | 'google' | 'local'
    voiceId: string
    style?: 'neutral' | 'excited' | 'calm' | 'dramatic' | 'whisper'
    speed?: number  // 0.5 - 2.0
  }
  
  // For dialog/character videos
  characters?: CharacterVoice[]
  
  // Audio processing
  effects?: VoiceEffect[]
}

interface CharacterVoice {
  name: string
  voiceId: string
  pitch?: number      // -12 to +12 semitones
  speed?: number
  icon?: string       // Character avatar URL
  color?: string      // Caption color for this character
}

type VoiceEffect = 
  | { type: 'reverb', amount: number }
  | { type: 'echo', delay: number }
  | { type: 'pitch', semitones: number }
  | { type: 'robot' }
  | { type: 'telephone' }
  | { type: 'radio' }
```

### Voice Preset Examples

```typescript
const VOICE_PRESETS = {
  // Professional narrator
  'narrator-pro': {
    narrator: { provider: 'elevenlabs', voiceId: 'adam', style: 'neutral' }
  },
  
  // Bedtime story - soft, warm
  'bedtime': {
    narrator: { provider: 'elevenlabs', voiceId: 'bella', style: 'calm', speed: 0.9 }
  },
  
  // Energetic explainer
  'hype': {
    narrator: { provider: 'elevenlabs', voiceId: 'josh', style: 'excited', speed: 1.1 }
  },
  
  // Character dialog - SpongeBob style
  'spongebob-patrick': {
    characters: [
      { name: 'SpongeBob', voiceId: 'spongebob-tts', pitch: 4, color: '#FFEB3B' },
      { name: 'Patrick', voiceId: 'patrick-tts', pitch: -2, color: '#E91E63' },
    ]
  },
  
  // Family Guy style  
  'brian-peter': {
    characters: [
      { name: 'Brian', voiceId: 'brian-tts', style: 'neutral', color: '#FFFFFF' },
      { name: 'Peter', voiceId: 'peter-tts', pitch: -1, color: '#4CAF50' },
    ]
  },
  
  // Reddit story - casual narrator
  'reddit': {
    narrator: { provider: 'elevenlabs', voiceId: 'dave', style: 'neutral', speed: 1.05 }
  },
  
  // Horror/creepy
  'creepy': {
    narrator: { provider: 'elevenlabs', voiceId: 'callum', style: 'whisper', speed: 0.85 },
    effects: [{ type: 'reverb', amount: 0.3 }]
  }
}
```

---

## Visual Presets

```typescript
interface VisualsPreset {
  // Background footage source
  background: BackgroundConfig
  
  // Foreground elements (characters, presenters)
  foreground?: ForegroundConfig
  
  // Overlay elements (text, graphics)
  overlays: OverlayConfig[]
  
  // Transitions between sections
  transitions: TransitionStyle
  
  // Color grading / filters
  colorGrade?: ColorGrade
}

interface BackgroundConfig {
  type: 'broll' | 'gameplay' | 'static' | 'gradient' | 'particles'
  
  // For b-roll
  sources?: ('pexels' | 'pixabay' | 'storyblocks' | 'custom')[]
  searchTerms?: string[]  // Keywords for footage search
  
  // For gameplay
  game?: 'minecraft' | 'subway-surfers' | 'gta' | 'fortnite' | 'satisfying-clips'
  
  // For static/gradient
  color?: string
  gradient?: [string, string]
  
  // Motion
  motion?: 'static' | 'slow-zoom' | 'ken-burns' | 'parallax'
}

interface ForegroundConfig {
  type: 'characters' | 'avatar' | 'presenter' | 'none'
  
  // For character dialogs
  characters?: {
    name: string
    spriteUrl: string        // PNG with transparency
    position: 'left' | 'right' | 'center'
    animations?: {
      idle: string           // Lottie or sprite sheet
      talking: string
      laughing?: string
      shocked?: string
    }
  }[]
  
  // For avatar (like D-ID, HeyGen)
  avatar?: {
    provider: 'heygen' | 'did' | 'custom'
    avatarId: string
  }
}

type TransitionStyle = 
  | 'cut'           // Hard cuts
  | 'crossfade'     // Smooth fades
  | 'swipe'         // TikTok style swipes  
  | 'zoom'          // Zoom in/out
  | 'glitch'        // Glitch effect
  | 'none'
```

### Visual Preset Examples

```typescript
const VISUAL_PRESETS = {
  // Minecraft parkour background
  'minecraft-bg': {
    background: { type: 'gameplay', game: 'minecraft' },
    foreground: { type: 'none' },
    overlays: [{ type: 'captions', position: 'center' }],
    transitions: 'cut'
  },
  
  // Subway Surfers background  
  'subway-surfers-bg': {
    background: { type: 'gameplay', game: 'subway-surfers' },
    foreground: { type: 'none' },
    overlays: [{ type: 'captions', position: 'bottom' }],
    transitions: 'cut'
  },
  
  // Character conversation
  'character-dialog': {
    background: { type: 'gradient', gradient: ['#1a1a2e', '#16213e'] },
    foreground: { 
      type: 'characters',
      characters: []  // Populated from template config
    },
    overlays: [{ type: 'speech-bubble', followSpeaker: true }],
    transitions: 'cut'
  },
  
  // Stock footage explainer
  'broll-explainer': {
    background: { 
      type: 'broll', 
      sources: ['pexels', 'pixabay'],
      motion: 'ken-burns'
    },
    foreground: { type: 'none' },
    overlays: [
      { type: 'captions', style: 'bold', position: 'bottom' },
      { type: 'progress-bar', position: 'top' }
    ],
    transitions: 'crossfade'
  },
  
  // Cozy bedtime
  'bedtime-story': {
    background: {
      type: 'static',
      color: '#0d1b2a'
    },
    foreground: { type: 'none' },
    overlays: [
      { type: 'storybook-frame' },
      { type: 'captions', style: 'handwritten', position: 'bottom' },
      { type: 'stars-particles' }
    ],
    transitions: 'crossfade',
    colorGrade: { warmth: 0.2, vignette: 0.4 }
  },
  
  // News/PSA
  'news-alert': {
    background: { type: 'gradient', gradient: ['#1a1a1a', '#2d2d2d'] },
    foreground: { type: 'none' },
    overlays: [
      { type: 'lower-third', style: 'news' },
      { type: 'headline-banner', position: 'top' },
      { type: 'source-citation', position: 'bottom-right' }
    ],
    transitions: 'swipe'
  },
  
  // Reddit story with gameplay
  'reddit-gameplay': {
    background: { type: 'gameplay', game: 'minecraft' },
    foreground: { type: 'none' },
    overlays: [
      { type: 'reddit-post-header' },
      { type: 'captions', style: 'reddit', position: 'center' }
    ],
    transitions: 'cut'
  }
}
```

---

## Audio Presets

```typescript
interface AudioPreset {
  // Background music
  music?: {
    source: 'pixabay' | 'epidemic' | 'custom' | 'none'
    mood: 'upbeat' | 'calm' | 'dramatic' | 'funny' | 'scary' | 'lofi'
    volume: number  // 0-1, relative to voice
    ducking: boolean  // Lower music when voice plays
  }
  
  // Sound effects
  sfx?: {
    source: 'freesound' | 'custom'
    autoAdd?: boolean  // AI-select SFX based on content
    library?: string[] // Specific SFX to use
  }
  
  // Ambient audio
  ambient?: {
    type: 'none' | 'rain' | 'forest' | 'city' | 'space' | 'fire'
    volume: number
  }
}

const AUDIO_PRESETS = {
  'energetic': {
    music: { source: 'pixabay', mood: 'upbeat', volume: 0.15, ducking: true },
    sfx: { source: 'freesound', autoAdd: true }
  },
  
  'calm': {
    music: { source: 'pixabay', mood: 'calm', volume: 0.1, ducking: true },
    ambient: { type: 'rain', volume: 0.05 }
  },
  
  'lofi': {
    music: { source: 'pixabay', mood: 'lofi', volume: 0.2, ducking: true }
  },
  
  'scary': {
    music: { source: 'pixabay', mood: 'scary', volume: 0.15, ducking: true },
    ambient: { type: 'forest', volume: 0.1 },
    sfx: { source: 'freesound', library: ['heartbeat', 'creak', 'whisper'] }
  },
  
  'silent': {
    music: undefined,
    sfx: undefined
  }
}
```

---

## Layout Presets

```typescript
interface LayoutPreset {
  // Aspect ratio
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5'
  
  // Caption styling
  captions: {
    enabled: boolean
    style: CaptionStyle
    position: 'top' | 'center' | 'bottom'
    animation?: 'none' | 'word-by-word' | 'karaoke' | 'typewriter'
  }
  
  // Branding
  branding?: {
    logo?: string
    watermark?: string
    endCard?: boolean
    cta?: string
  }
  
  // Safe zones (for platform UI)
  safeZone: {
    top: number     // % of height
    bottom: number
    left: number
    right: number
  }
}

interface CaptionStyle {
  font: string
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
  color: string
  backgroundColor?: string
  stroke?: { color: string, width: number }
  shadow?: boolean
  uppercase?: boolean
}

const LAYOUT_PRESETS = {
  'tiktok': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: { font: 'Inter', fontSize: 'large', color: '#fff', stroke: { color: '#000', width: 2 } },
      position: 'center',
      animation: 'word-by-word'
    },
    safeZone: { top: 15, bottom: 20, left: 5, right: 5 }
  },
  
  'youtube-shorts': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: { font: 'Roboto', fontSize: 'medium', color: '#fff', backgroundColor: 'rgba(0,0,0,0.7)' },
      position: 'bottom',
      animation: 'none'
    },
    safeZone: { top: 10, bottom: 15, left: 5, right: 5 }
  },
  
  'instagram-reels': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: { font: 'Helvetica', fontSize: 'medium', color: '#fff', shadow: true },
      position: 'center',
      animation: 'karaoke'
    },
    safeZone: { top: 12, bottom: 18, left: 5, right: 5 }
  },
  
  'youtube-landscape': {
    aspectRatio: '16:9',
    captions: {
      enabled: true,
      style: { font: 'Roboto', fontSize: 'small', color: '#fff', backgroundColor: 'rgba(0,0,0,0.8)' },
      position: 'bottom',
      animation: 'none'
    },
    safeZone: { top: 5, bottom: 10, left: 5, right: 5 }
  }
}
```

---

## Content Structure

```typescript
interface ContentStructure {
  // How the script should be organized
  format: 
    | 'monologue'       // Single narrator
    | 'dialog'          // Character conversation
    | 'listicle'        // "Top 5...", numbered sections
    | 'story'           // Narrative arc
    | 'qa'              // Question and answer
    | 'comparison'      // A vs B
    | 'tutorial'        // Step-by-step
  
  // Pacing
  pacing: {
    introDuration: number   // seconds
    sectionGap: number      // pause between sections
    outroDuration: number
    wordsPerMinute: number  // Target speaking rate
  }
  
  // Hooks and CTAs
  hooks: {
    style: 'question' | 'statistic' | 'controversial' | 'story' | 'direct'
    position: 'start' | 'both'
  }
  
  cta: {
    enabled: boolean
    text?: string
    position: 'end' | 'middle-and-end'
  }
}
```

---

## Complete Template Examples

### 1. SpongeBob & Patrick Explain AI

```typescript
const spongebobTemplate: VideoTemplate = {
  id: 'spongebob-explainer',
  name: 'SpongeBob & Patrick Explain',
  description: 'Two cartoon characters have a funny conversation explaining a topic',
  category: 'character-dialog',
  
  voice: {
    characters: [
      { name: 'SpongeBob', voiceId: 'spongebob-clone', pitch: 4, color: '#FFEB3B' },
      { name: 'Patrick', voiceId: 'patrick-clone', pitch: -3, color: '#E91E63' }
    ]
  },
  
  visuals: {
    background: { type: 'gameplay', game: 'minecraft' },
    foreground: {
      type: 'characters',
      characters: [
        { name: 'SpongeBob', spriteUrl: '/chars/spongebob.png', position: 'left', animations: { idle: '...', talking: '...' }},
        { name: 'Patrick', spriteUrl: '/chars/patrick.png', position: 'right', animations: { idle: '...', talking: '...' }}
      ]
    },
    overlays: [{ type: 'speech-bubble', followSpeaker: true }],
    transitions: 'cut'
  },
  
  audio: {
    music: { source: 'custom', mood: 'funny', volume: 0.1, ducking: true },
    sfx: { source: 'freesound', library: ['cartoon-boing', 'laugh-track', 'womp-womp'] }
  },
  
  layout: {
    aspectRatio: '9:16',
    captions: { enabled: false }, // Speech bubbles instead
    safeZone: { top: 15, bottom: 20, left: 5, right: 5 }
  },
  
  structure: {
    format: 'dialog',
    pacing: { introDuration: 2, sectionGap: 0.5, outroDuration: 3, wordsPerMinute: 150 },
    hooks: { style: 'question', position: 'start' },
    cta: { enabled: true, text: 'Follow for more!' }
  },
  
  platforms: ['tiktok', 'youtube-shorts', 'instagram-reels']
}
```

### 2. Bedtime Story

```typescript
const bedtimeTemplate: VideoTemplate = {
  id: 'bedtime-story',
  name: 'Cozy Bedtime Story',
  description: 'Soothing narration with calming visuals for children',
  category: 'story',
  
  voice: {
    narrator: { provider: 'elevenlabs', voiceId: 'bella', style: 'calm', speed: 0.85 }
  },
  
  visuals: {
    background: { type: 'static', color: '#0d1b2a' },
    overlays: [
      { type: 'storybook-illustrations', style: 'watercolor' },
      { type: 'captions', style: 'handwritten', position: 'bottom' },
      { type: 'particles', effect: 'stars-twinkle' }
    ],
    transitions: 'crossfade',
    colorGrade: { warmth: 0.3, vignette: 0.5, saturation: -0.1 }
  },
  
  audio: {
    music: { source: 'pixabay', mood: 'calm', volume: 0.08, ducking: true },
    ambient: { type: 'rain', volume: 0.03 }
  },
  
  layout: {
    aspectRatio: '16:9',
    captions: {
      enabled: true,
      style: { font: 'Caveat', fontSize: 'large', color: '#f0e6d3' },
      position: 'bottom',
      animation: 'typewriter'
    },
    safeZone: { top: 5, bottom: 10, left: 10, right: 10 }
  },
  
  structure: {
    format: 'story',
    pacing: { introDuration: 5, sectionGap: 2, outroDuration: 8, wordsPerMinute: 100 },
    hooks: { style: 'story', position: 'start' },
    cta: { enabled: false }
  },
  
  platforms: ['youtube']
}
```

### 3. Reddit Story with Subway Surfers

```typescript
const redditSubwaySurfersTemplate: VideoTemplate = {
  id: 'reddit-subway-surfers',
  name: 'Reddit Story + Subway Surfers',
  description: 'Viral format: Reddit stories with addictive gameplay background',
  category: 'entertainment',
  
  voice: {
    narrator: { provider: 'elevenlabs', voiceId: 'adam', style: 'neutral', speed: 1.1 }
  },
  
  visuals: {
    background: { type: 'gameplay', game: 'subway-surfers' },
    overlays: [
      { type: 'reddit-header', subreddit: 'auto' },
      { type: 'captions', style: 'bold-outline', position: 'center', size: 'xlarge' }
    ],
    transitions: 'cut'
  },
  
  audio: {
    music: { source: 'none' },
    sfx: { source: 'freesound', autoAdd: false }
  },
  
  layout: {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: { font: 'Inter', fontSize: 'xlarge', color: '#fff', stroke: { color: '#000', width: 3 }, uppercase: false },
      position: 'center',
      animation: 'word-by-word'
    },
    safeZone: { top: 20, bottom: 15, left: 5, right: 5 }
  },
  
  structure: {
    format: 'story',
    pacing: { introDuration: 1, sectionGap: 0.3, outroDuration: 2, wordsPerMinute: 160 },
    hooks: { style: 'controversial', position: 'start' },
    cta: { enabled: true, text: 'Follow for Part 2!' }
  },
  
  platforms: ['tiktok', 'youtube-shorts']
}
```

### 4. Educational PSA

```typescript
const psaTemplate: VideoTemplate = {
  id: 'psa-explainer',
  name: 'Educational PSA',
  description: 'Fact-based informative content with source citations',
  category: 'educational',
  
  voice: {
    narrator: { provider: 'elevenlabs', voiceId: 'rachel', style: 'neutral' }
  },
  
  visuals: {
    background: { type: 'broll', sources: ['pexels'], motion: 'slow-zoom' },
    overlays: [
      { type: 'headline', position: 'top', style: 'news' },
      { type: 'captions', position: 'bottom' },
      { type: 'data-viz', style: 'minimal' },
      { type: 'source-citation', position: 'bottom-right' }
    ],
    transitions: 'swipe'
  },
  
  audio: {
    music: { source: 'pixabay', mood: 'neutral', volume: 0.1, ducking: true }
  },
  
  layout: {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: { font: 'Inter', fontSize: 'medium', color: '#fff', backgroundColor: 'rgba(0,0,0,0.8)' },
      position: 'bottom',
      animation: 'none'
    },
    branding: { endCard: true, cta: 'Learn more at example.com' },
    safeZone: { top: 15, bottom: 20, left: 5, right: 5 }
  },
  
  structure: {
    format: 'listicle',
    pacing: { introDuration: 2, sectionGap: 1, outroDuration: 4, wordsPerMinute: 140 },
    hooks: { style: 'statistic', position: 'start' },
    cta: { enabled: true, position: 'end' }
  },
  
  platforms: ['tiktok', 'youtube-shorts', 'instagram-reels']
}
```

---

## Implementation Priority

### Phase 1: Template Selection
- [ ] Template picker UI
- [ ] Template preview (thumbnail + description)
- [ ] Basic customization (topic, length, platform)

### Phase 2: Voice System
- [ ] ElevenLabs integration
- [ ] Voice preset library
- [ ] Character dialog generation (alternating speakers)
- [ ] Voice cloning for custom characters

### Phase 3: Visual Layers
- [ ] B-roll search + auto-selection
- [ ] Gameplay footage integration
- [ ] Character sprite rendering
- [ ] Caption animations (word-by-word, karaoke)

### Phase 4: Audio Layer
- [ ] Music search by mood
- [ ] Audio ducking
- [ ] SFX auto-insertion
- [ ] Ambient audio

### Phase 5: Advanced
- [ ] Custom character upload
- [ ] Avatar generation (HeyGen/D-ID)
- [ ] Multi-platform export
- [ ] A/B testing (same content, different templates)

---

## API Design

```typescript
// Create video from template
POST /api/pipelines
{
  "topic": "Why cats are better than dogs",
  "templateId": "spongebob-explainer",
  "customization": {
    "voice": {
      "characters": [
        { "name": "SpongeBob", "rename": "Whiskers" },
        { "name": "Patrick", "rename": "Buddy" }
      ]
    },
    "visuals": {
      "background": { "game": "subway-surfers" }  // Override default
    },
    "layout": {
      "branding": { "watermark": "https://..." }
    }
  },
  "platforms": ["tiktok"]
}

// List available templates
GET /api/templates
GET /api/templates?category=character-dialog

// Get template details
GET /api/templates/:id

// Create custom template (save for reuse)
POST /api/templates
{
  "name": "My Custom Template",
  "baseTemplate": "spongebob-explainer",
  "overrides": { ... }
}
```

---

## Gameplay Footage Sources

For background gameplay:

| Game | Source | License |
|------|--------|---------|
| Minecraft | Record own / YouTube compilations | Fair use for transformative |
| Subway Surfers | Record own / stock | Need license |
| GTA | Rockstar clips | Terms vary |
| Fortnite | Epic allows content creation | OK |
| Satisfying clips | Compilation channels | License |

**Recommendation:** Partner with gameplay clip providers or create our own library of generic parkour/runner footage that's safe to use.

---

## Character Sources

| Type | Source | Notes |
|------|--------|-------|
| SpongeBob/Patrick | AI voice clones + sprite rips | Copyright risk |
| Family Guy | Same | Copyright risk |
| Original characters | Commission artists / AI generate | Safe |
| Generic avatars | HeyGen, D-ID | Licensed |

**Recommendation:** Create original character packs that evoke similar vibes without copyright issues. "Yellow Sponge Guy" and "Pink Star Friend" etc.

---

## Notes

This system lets us serve:
1. **Meme lords** - Character convos with gameplay backgrounds
2. **Educators** - Clean PSAs with citations
3. **Storytellers** - Bedtime stories, horror narrations
4. **Brands** - Product explainers with custom branding
5. **News** - Quick summaries with professional styling

Each template is a combination of modular presets. Users can start from a template and customize any layer.
