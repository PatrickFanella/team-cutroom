/**
 * Complete Video Templates
 * 
 * Pre-built templates combining voice, visuals, audio, and layout presets.
 * Users can start from these and customize any layer.
 */

import { VideoTemplate } from '../types'
import { VOICE_PRESETS } from './voice'
import { VISUAL_PRESETS } from './visuals'
import { AUDIO_PRESETS } from './audio'
import { LAYOUT_PRESETS } from './layout'

export const VIDEO_TEMPLATES: Record<string, VideoTemplate> = {
  // ========================================
  // EDUCATIONAL
  // ========================================
  
  'explainer-pro': {
    id: 'explainer-pro',
    name: 'Professional Explainer',
    description: 'Clean, professional educational content with b-roll footage',
    category: 'educational',
    
    voice: VOICE_PRESETS['narrator-professional'],
    
    visuals: VISUAL_PRESETS['broll-auto'],
    
    audio: AUDIO_PRESETS['neutral'],
    
    layout: LAYOUT_PRESETS['youtube-shorts'],
    
    structure: {
      format: 'monologue',
      pacing: {
        introDuration: 2,
        sectionGap: 0.8,
        outroDuration: 3,
        wordsPerMinute: 150,
      },
      hooks: { style: 'question', position: 'start' },
      cta: { enabled: true, text: 'Follow for more!', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'instagram-reels'],
    tags: ['educational', 'explainer', 'professional'],
  },
  
  'tech-explainer': {
    id: 'tech-explainer',
    name: 'Tech Explainer',
    description: 'Technology-focused explainer with futuristic visuals',
    category: 'educational',
    
    voice: VOICE_PRESETS['narrator-energetic'],
    
    visuals: VISUAL_PRESETS['broll-tech'],
    
    audio: AUDIO_PRESETS['energetic'],
    
    layout: LAYOUT_PRESETS['tiktok'],
    
    structure: {
      format: 'listicle',
      pacing: {
        introDuration: 2,
        sectionGap: 0.5,
        outroDuration: 3,
        wordsPerMinute: 160,
      },
      hooks: { style: 'statistic', position: 'start' },
      cta: { enabled: true, text: 'More tech tips in bio!', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'instagram-reels'],
    tags: ['tech', 'educational', 'tips'],
  },
  
  'psa-informative': {
    id: 'psa-informative',
    name: 'Informative PSA',
    description: 'Fact-based public service announcement with sources',
    category: 'educational',
    
    voice: VOICE_PRESETS['narrator-professional'],
    
    visuals: VISUAL_PRESETS['psa-clean'],
    
    audio: AUDIO_PRESETS['neutral'],
    
    layout: LAYOUT_PRESETS['youtube-shorts'],
    
    structure: {
      format: 'monologue',
      pacing: {
        introDuration: 2,
        sectionGap: 1,
        outroDuration: 4,
        wordsPerMinute: 140,
      },
      hooks: { style: 'statistic', position: 'start' },
      cta: { enabled: true, text: 'Share this information!', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'instagram-reels', 'twitter'],
    tags: ['psa', 'facts', 'informative'],
  },
  
  // ========================================
  // ENTERTAINMENT
  // ========================================
  
  'reddit-minecraft': {
    id: 'reddit-minecraft',
    name: 'Reddit Story + Minecraft',
    description: 'Viral format: Reddit stories with Minecraft parkour background',
    category: 'entertainment',
    
    voice: VOICE_PRESETS['story-reddit'],
    
    visuals: VISUAL_PRESETS['reddit-story'],
    
    audio: AUDIO_PRESETS['silent'],
    
    layout: LAYOUT_PRESETS['bold-captions'],
    
    structure: {
      format: 'story',
      pacing: {
        introDuration: 1,
        sectionGap: 0.3,
        outroDuration: 2,
        wordsPerMinute: 165,
      },
      hooks: { style: 'controversial', position: 'start' },
      cta: { enabled: true, text: 'Follow for Part 2!', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts'],
    tags: ['reddit', 'story', 'viral', 'minecraft'],
  },
  
  'reddit-subway-surfers': {
    id: 'reddit-subway-surfers',
    name: 'Reddit Story + Subway Surfers',
    description: 'Viral format: Reddit stories with Subway Surfers background',
    category: 'entertainment',
    
    voice: VOICE_PRESETS['story-reddit'],
    
    visuals: {
      ...VISUAL_PRESETS['reddit-story'],
      background: {
        type: 'gameplay',
        game: 'subway-surfers',
      },
    },
    
    audio: AUDIO_PRESETS['silent'],
    
    layout: LAYOUT_PRESETS['bold-captions'],
    
    structure: {
      format: 'story',
      pacing: {
        introDuration: 1,
        sectionGap: 0.3,
        outroDuration: 2,
        wordsPerMinute: 165,
      },
      hooks: { style: 'controversial', position: 'start' },
      cta: { enabled: true, text: 'Follow for Part 2!', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts'],
    tags: ['reddit', 'story', 'viral', 'subway-surfers'],
  },
  
  'satisfying-facts': {
    id: 'satisfying-facts',
    name: 'Satisfying Facts',
    description: 'Interesting facts over satisfying/ASMR visuals',
    category: 'entertainment',
    
    voice: VOICE_PRESETS['narrator-calm'],
    
    visuals: VISUAL_PRESETS['bg-satisfying'],
    
    audio: AUDIO_PRESETS['lofi'],
    
    layout: LAYOUT_PRESETS['subtle-captions'],
    
    structure: {
      format: 'listicle',
      pacing: {
        introDuration: 1,
        sectionGap: 0.5,
        outroDuration: 2,
        wordsPerMinute: 130,
      },
      hooks: { style: 'direct', position: 'start' },
      cta: { enabled: true, position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'instagram-reels'],
    tags: ['satisfying', 'facts', 'asmr'],
  },
  
  // ========================================
  // CHARACTER DIALOG
  // ========================================
  
  'duo-explainer': {
    id: 'duo-explainer',
    name: 'Duo Explainer',
    description: 'Two characters having a funny conversation about a topic',
    category: 'character-dialog',
    
    voice: VOICE_PRESETS['characters-duo-funny'],
    
    visuals: VISUAL_PRESETS['dialog-with-gameplay'],
    
    audio: AUDIO_PRESETS['funny'],
    
    layout: LAYOUT_PRESETS['no-captions'],  // Using speech bubbles instead
    
    structure: {
      format: 'dialog',
      pacing: {
        introDuration: 1,
        sectionGap: 0.3,
        outroDuration: 2,
        wordsPerMinute: 150,
      },
      hooks: { style: 'question', position: 'start' },
      cta: { enabled: true, text: 'Follow for more!', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'instagram-reels'],
    tags: ['characters', 'dialog', 'funny', 'explainer'],
  },
  
  'debate': {
    id: 'debate',
    name: 'Debate',
    description: 'Two characters debate opposing viewpoints',
    category: 'character-dialog',
    
    voice: VOICE_PRESETS['characters-debate'],
    
    visuals: VISUAL_PRESETS['dialog-simple'],
    
    audio: AUDIO_PRESETS['dramatic'],
    
    layout: LAYOUT_PRESETS['no-captions'],
    
    structure: {
      format: 'debate',
      pacing: {
        introDuration: 2,
        sectionGap: 0.5,
        outroDuration: 3,
        wordsPerMinute: 145,
      },
      hooks: { style: 'controversial', position: 'start' },
      cta: { enabled: true, text: 'Who won? Comment below!', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts'],
    tags: ['debate', 'characters', 'discussion'],
  },
  
  // ========================================
  // STORY / NARRATIVE
  // ========================================
  
  'bedtime-story': {
    id: 'bedtime-story',
    name: 'Bedtime Story',
    description: 'Cozy bedtime stories with soothing narration',
    category: 'story',
    
    voice: VOICE_PRESETS['story-bedtime'],
    
    visuals: VISUAL_PRESETS['story-cozy'],
    
    audio: AUDIO_PRESETS['bedtime'],
    
    layout: LAYOUT_PRESETS['storybook'],
    
    structure: {
      format: 'story',
      pacing: {
        introDuration: 5,
        sectionGap: 2,
        outroDuration: 8,
        wordsPerMinute: 100,
      },
      hooks: { style: 'story', position: 'start' },
      cta: { enabled: false, position: 'none' },
    },
    
    platforms: ['youtube'],
    tags: ['bedtime', 'story', 'kids', 'relaxing'],
  },
  
  'horror-story': {
    id: 'horror-story',
    name: 'Horror Story',
    description: 'Creepy narration with atmospheric visuals',
    category: 'story',
    
    voice: VOICE_PRESETS['story-horror'],
    
    visuals: VISUAL_PRESETS['story-horror'],
    
    audio: AUDIO_PRESETS['scary'],
    
    layout: LAYOUT_PRESETS['subtle-captions'],
    
    structure: {
      format: 'story',
      pacing: {
        introDuration: 3,
        sectionGap: 1.5,
        outroDuration: 4,
        wordsPerMinute: 120,
      },
      hooks: { style: 'story', position: 'start' },
      cta: { enabled: true, text: 'More horror stories...', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'youtube'],
    tags: ['horror', 'scary', 'story', 'creepy'],
  },
  
  'adventure-story': {
    id: 'adventure-story',
    name: 'Adventure Story',
    description: 'Epic adventure narration with dramatic flair',
    category: 'story',
    
    voice: VOICE_PRESETS['story-adventure'],
    
    visuals: VISUAL_PRESETS['broll-nature'],
    
    audio: AUDIO_PRESETS['inspiring'],
    
    layout: LAYOUT_PRESETS['youtube-shorts'],
    
    structure: {
      format: 'story',
      pacing: {
        introDuration: 3,
        sectionGap: 1,
        outroDuration: 4,
        wordsPerMinute: 140,
      },
      hooks: { style: 'story', position: 'start' },
      cta: { enabled: true, position: 'end' },
    },
    
    platforms: ['youtube-shorts', 'instagram-reels'],
    tags: ['adventure', 'story', 'epic'],
  },
  
  // ========================================
  // NEWS
  // ========================================
  
  'breaking-news': {
    id: 'breaking-news',
    name: 'Breaking News',
    description: 'News-style format with headlines and sources',
    category: 'news',
    
    voice: VOICE_PRESETS['narrator-professional'],
    
    visuals: VISUAL_PRESETS['news-style'],
    
    audio: AUDIO_PRESETS['news'],
    
    layout: LAYOUT_PRESETS['youtube-shorts'],
    
    structure: {
      format: 'monologue',
      pacing: {
        introDuration: 1,
        sectionGap: 0.5,
        outroDuration: 2,
        wordsPerMinute: 155,
      },
      hooks: { style: 'direct', position: 'start' },
      cta: { enabled: true, text: 'Follow for updates', position: 'end' },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'twitter'],
    tags: ['news', 'breaking', 'updates'],
  },
  
  // ========================================
  // MEME
  // ========================================
  
  'meme-format': {
    id: 'meme-format',
    name: 'Meme Format',
    description: 'Quick meme-style content with sound effects',
    category: 'meme',
    
    voice: VOICE_PRESETS['narrator-energetic'],
    
    visuals: VISUAL_PRESETS['social-meme'],
    
    audio: AUDIO_PRESETS['meme'],
    
    layout: LAYOUT_PRESETS['bold-captions'],
    
    structure: {
      format: 'monologue',
      pacing: {
        introDuration: 0.5,
        sectionGap: 0.2,
        outroDuration: 1,
        wordsPerMinute: 180,
      },
      hooks: { style: 'shocking', position: 'start' },
      cta: { enabled: false, position: 'none' },
    },
    
    platforms: ['tiktok', 'youtube-shorts'],
    tags: ['meme', 'funny', 'viral'],
  },
  
  // ========================================
  // TUTORIAL
  // ========================================
  
  'quick-tutorial': {
    id: 'quick-tutorial',
    name: 'Quick Tutorial',
    description: 'Step-by-step tutorial format',
    category: 'tutorial',
    
    voice: VOICE_PRESETS['narrator-friendly'],
    
    visuals: VISUAL_PRESETS['broll-auto'],
    
    audio: AUDIO_PRESETS['energetic'],
    
    layout: LAYOUT_PRESETS['tiktok'],
    
    structure: {
      format: 'tutorial',
      pacing: {
        introDuration: 2,
        sectionGap: 0.8,
        outroDuration: 3,
        wordsPerMinute: 145,
      },
      hooks: { style: 'relatable', position: 'start' },
      cta: { enabled: true, text: 'Save this for later!', position: 'end' },
      sections: { min: 3, max: 7 },
    },
    
    platforms: ['tiktok', 'youtube-shorts', 'instagram-reels'],
    tags: ['tutorial', 'how-to', 'tips'],
  },
  
  // ========================================
  // MINIMAL
  // ========================================
  
  'minimal-quote': {
    id: 'minimal-quote',
    name: 'Minimal Quote',
    description: 'Clean, minimal design for quotes and thoughts',
    category: 'custom',
    
    voice: VOICE_PRESETS['narrator-calm'],
    
    visuals: VISUAL_PRESETS['minimal-gradient'],
    
    audio: AUDIO_PRESETS['lofi'],
    
    layout: LAYOUT_PRESETS['karaoke'],
    
    structure: {
      format: 'monologue',
      pacing: {
        introDuration: 1,
        sectionGap: 1,
        outroDuration: 2,
        wordsPerMinute: 120,
      },
      hooks: { style: 'direct', position: 'none' },
      cta: { enabled: false, position: 'none' },
    },
    
    platforms: ['instagram-reels', 'tiktok'],
    tags: ['minimal', 'quotes', 'aesthetic'],
  },
}

export function getVideoTemplate(id: string): VideoTemplate | undefined {
  return VIDEO_TEMPLATES[id]
}

export function listVideoTemplates(): { id: string; template: VideoTemplate }[] {
  return Object.entries(VIDEO_TEMPLATES).map(([id, template]) => ({ id, template }))
}

export function listTemplatesByCategory(category: VideoTemplate['category']): VideoTemplate[] {
  return Object.values(VIDEO_TEMPLATES).filter(t => t.category === category)
}

export function searchTemplates(query: string): VideoTemplate[] {
  const q = query.toLowerCase()
  return Object.values(VIDEO_TEMPLATES).filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags?.some(tag => tag.includes(q))
  )
}
