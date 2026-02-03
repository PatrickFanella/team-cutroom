/**
 * Visual Presets
 * 
 * Pre-configured visual settings for different content styles.
 */

import { VisualsPreset } from '../types'

export const VISUAL_PRESETS: Record<string, VisualsPreset> = {
  // ========================================
  // GAMEPLAY BACKGROUNDS
  // ========================================
  
  'bg-minecraft': {
    background: {
      type: 'gameplay',
      game: 'minecraft-parkour',
      opacity: 1.0,
    },
    overlays: [
      { type: 'captions', position: 'center' },
    ],
    transitions: 'cut',
  },
  
  'bg-subway-surfers': {
    background: {
      type: 'gameplay',
      game: 'subway-surfers',
      opacity: 1.0,
    },
    overlays: [
      { type: 'captions', position: 'center' },
    ],
    transitions: 'cut',
  },
  
  'bg-satisfying': {
    background: {
      type: 'gameplay',
      game: 'satisfying-clips',
      opacity: 1.0,
    },
    overlays: [
      { type: 'captions', position: 'bottom' },
    ],
    transitions: 'crossfade',
  },
  
  // ========================================
  // CHARACTER DIALOG
  // ========================================
  
  'dialog-simple': {
    background: {
      type: 'gradient',
      gradient: ['#1a1a2e', '#16213e'],
    },
    foreground: {
      type: 'characters',
      characters: [],  // Populated by template
    },
    overlays: [
      { type: 'speech-bubble', followSpeaker: true },
    ],
    transitions: 'cut',
  },
  
  'dialog-with-gameplay': {
    background: {
      type: 'gameplay',
      game: 'minecraft-parkour',
      opacity: 0.6,
    },
    foreground: {
      type: 'characters',
      characters: [],
    },
    overlays: [
      { type: 'speech-bubble', followSpeaker: true },
    ],
    transitions: 'cut',
  },
  
  // ========================================
  // STOCK FOOTAGE / B-ROLL
  // ========================================
  
  'broll-auto': {
    background: {
      type: 'broll',
      sources: ['pexels', 'pixabay'],
      motion: 'ken-burns',
    },
    overlays: [
      { type: 'captions', position: 'bottom' },
    ],
    transitions: 'crossfade',
  },
  
  'broll-tech': {
    background: {
      type: 'broll',
      sources: ['pexels'],
      searchTerms: ['technology', 'computer', 'coding', 'futuristic'],
      motion: 'slow-zoom',
    },
    overlays: [
      { type: 'captions', position: 'bottom' },
      { type: 'progress-bar', position: 'top' },
    ],
    transitions: 'swipe',
  },
  
  'broll-nature': {
    background: {
      type: 'broll',
      sources: ['pexels', 'pixabay'],
      searchTerms: ['nature', 'forest', 'ocean', 'mountains'],
      motion: 'ken-burns',
    },
    overlays: [
      { type: 'captions', position: 'bottom' },
    ],
    transitions: 'crossfade',
    colorGrade: {
      saturation: 0.1,
      warmth: 0.05,
    },
  },
  
  // ========================================
  // NEWS / PSA
  // ========================================
  
  'news-style': {
    background: {
      type: 'gradient',
      gradient: ['#1a1a1a', '#2d2d2d'],
    },
    overlays: [
      { type: 'headline-banner', position: 'top' },
      { type: 'lower-third', position: 'bottom' },
      { type: 'source-citation', position: 'bottom-right' },
    ],
    transitions: 'swipe',
  },
  
  'psa-clean': {
    background: {
      type: 'broll',
      sources: ['pexels'],
      motion: 'slow-zoom',
    },
    overlays: [
      { type: 'captions', position: 'center' },
      { type: 'source-citation', position: 'bottom-right' },
    ],
    transitions: 'crossfade',
  },
  
  // ========================================
  // STORY / NARRATIVE
  // ========================================
  
  'story-cozy': {
    background: {
      type: 'static',
      color: '#0d1b2a',
    },
    overlays: [
      { type: 'storybook-frame' },
      { type: 'captions', position: 'bottom' },
      { type: 'particles', style: { effect: 'stars-twinkle' } },
    ],
    transitions: 'crossfade',
    colorGrade: {
      warmth: 0.3,
      vignette: 0.5,
      saturation: -0.1,
    },
  },
  
  'story-horror': {
    background: {
      type: 'broll',
      sources: ['pexels'],
      searchTerms: ['dark', 'fog', 'night', 'forest'],
      motion: 'slow-zoom',
    },
    overlays: [
      { type: 'captions', position: 'bottom' },
    ],
    transitions: 'crossfade',
    colorGrade: {
      saturation: -0.3,
      contrast: 0.2,
      vignette: 0.6,
    },
  },
  
  // ========================================
  // REDDIT / SOCIAL
  // ========================================
  
  'reddit-story': {
    background: {
      type: 'gameplay',
      game: 'minecraft-parkour',
    },
    overlays: [
      { type: 'reddit-header', position: 'top' },
      { type: 'captions', position: 'center' },
    ],
    transitions: 'cut',
  },
  
  'social-meme': {
    background: {
      type: 'gradient',
      gradient: ['#000000', '#1a1a1a'],
    },
    overlays: [
      { type: 'captions', position: 'center' },
      { type: 'emoji-reactions' },
    ],
    transitions: 'cut',
  },
  
  // ========================================
  // MINIMAL
  // ========================================
  
  'minimal-dark': {
    background: {
      type: 'static',
      color: '#0a0a0a',
    },
    overlays: [
      { type: 'captions', position: 'center' },
    ],
    transitions: 'crossfade',
  },
  
  'minimal-light': {
    background: {
      type: 'static',
      color: '#f5f5f5',
    },
    overlays: [
      { type: 'captions', position: 'center' },
    ],
    transitions: 'crossfade',
  },
  
  'minimal-gradient': {
    background: {
      type: 'gradient',
      gradient: ['#667eea', '#764ba2'],
    },
    overlays: [
      { type: 'captions', position: 'center' },
    ],
    transitions: 'crossfade',
  },
}

export function getVisualPreset(id: string): VisualsPreset | undefined {
  return VISUAL_PRESETS[id]
}

export function listVisualPresets(): { id: string; preset: VisualsPreset }[] {
  return Object.entries(VISUAL_PRESETS).map(([id, preset]) => ({ id, preset }))
}
