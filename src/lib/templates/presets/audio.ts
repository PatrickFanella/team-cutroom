/**
 * Audio Presets
 * 
 * Pre-configured audio settings for different content moods.
 */

import { AudioPreset } from '../types'

export const AUDIO_PRESETS: Record<string, AudioPreset> = {
  // ========================================
  // ENERGETIC / UPBEAT
  // ========================================
  
  'energetic': {
    music: {
      source: 'pixabay',
      mood: 'upbeat',
      volume: 0.15,
      ducking: true,
      fadeIn: 1,
      fadeOut: 2,
    },
    sfx: {
      source: 'freesound',
      autoAdd: true,
    },
  },
  
  'hype': {
    music: {
      source: 'pixabay',
      mood: 'action',
      volume: 0.2,
      ducking: true,
      fadeIn: 0.5,
      fadeOut: 1.5,
    },
    sfx: {
      source: 'freesound',
      autoAdd: true,
      library: ['whoosh', 'impact', 'rise'],
    },
  },
  
  // ========================================
  // CALM / RELAXING
  // ========================================
  
  'calm': {
    music: {
      source: 'pixabay',
      mood: 'calm',
      volume: 0.1,
      ducking: true,
      fadeIn: 2,
      fadeOut: 3,
    },
    ambient: {
      type: 'rain',
      volume: 0.05,
    },
  },
  
  'lofi': {
    music: {
      source: 'pixabay',
      mood: 'lofi',
      volume: 0.18,
      ducking: true,
      fadeIn: 1,
      fadeOut: 2,
    },
  },
  
  'ambient-nature': {
    music: {
      source: 'pixabay',
      mood: 'calm',
      volume: 0.08,
      ducking: true,
    },
    ambient: {
      type: 'forest',
      volume: 0.1,
    },
  },
  
  // ========================================
  // DRAMATIC / EMOTIONAL
  // ========================================
  
  'dramatic': {
    music: {
      source: 'pixabay',
      mood: 'dramatic',
      volume: 0.15,
      ducking: true,
      fadeIn: 2,
      fadeOut: 3,
    },
  },
  
  'inspiring': {
    music: {
      source: 'pixabay',
      mood: 'inspiring',
      volume: 0.12,
      ducking: true,
      fadeIn: 1.5,
      fadeOut: 2.5,
    },
  },
  
  'sad': {
    music: {
      source: 'pixabay',
      mood: 'sad',
      volume: 0.1,
      ducking: true,
      fadeIn: 2,
      fadeOut: 4,
    },
  },
  
  // ========================================
  // SCARY / MYSTERIOUS
  // ========================================
  
  'scary': {
    music: {
      source: 'pixabay',
      mood: 'scary',
      volume: 0.12,
      ducking: true,
      fadeIn: 3,
      fadeOut: 4,
    },
    ambient: {
      type: 'wind',
      volume: 0.08,
    },
    sfx: {
      source: 'freesound',
      library: ['heartbeat', 'creak', 'whisper', 'thunder'],
    },
  },
  
  'mysterious': {
    music: {
      source: 'pixabay',
      mood: 'mysterious',
      volume: 0.1,
      ducking: true,
      fadeIn: 2,
      fadeOut: 3,
    },
  },
  
  // ========================================
  // FUNNY / MEME
  // ========================================
  
  'funny': {
    music: {
      source: 'pixabay',
      mood: 'funny',
      volume: 0.12,
      ducking: true,
    },
    sfx: {
      source: 'freesound',
      autoAdd: true,
      library: ['boing', 'slide-whistle', 'cartoon-pop', 'laugh-track', 'sad-trombone'],
    },
  },
  
  'meme': {
    music: {
      source: 'none',
      volume: 0,
      ducking: false,
    },
    sfx: {
      source: 'freesound',
      autoAdd: true,
      library: ['vine-boom', 'bruh', 'oof', 'airhorn'],
    },
  },
  
  // ========================================
  // NEUTRAL / NEWS
  // ========================================
  
  'neutral': {
    music: {
      source: 'pixabay',
      mood: 'neutral',
      volume: 0.08,
      ducking: true,
      fadeIn: 1,
      fadeOut: 2,
    },
  },
  
  'news': {
    music: {
      source: 'pixabay',
      mood: 'neutral',
      volume: 0.06,
      ducking: true,
    },
    sfx: {
      source: 'freesound',
      library: ['whoosh', 'notification'],
    },
  },
  
  // ========================================
  // SPECIAL
  // ========================================
  
  'bedtime': {
    music: {
      source: 'pixabay',
      mood: 'calm',
      volume: 0.06,
      ducking: true,
      fadeIn: 3,
      fadeOut: 5,
    },
    ambient: {
      type: 'rain',
      volume: 0.04,
    },
  },
  
  'podcast': {
    music: {
      source: 'none',
      volume: 0,
      ducking: false,
    },
    // Podcast typically has no background music
  },
  
  'silent': {
    // No audio except voice
  },
}

export function getAudioPreset(id: string): AudioPreset | undefined {
  return AUDIO_PRESETS[id]
}

export function listAudioPresets(): { id: string; preset: AudioPreset }[] {
  return Object.entries(AUDIO_PRESETS).map(([id, preset]) => ({ id, preset }))
}
