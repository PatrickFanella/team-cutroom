/**
 * Layout Presets
 * 
 * Pre-configured layouts for different platforms and styles.
 */

import { LayoutPreset } from '../types'

export const LAYOUT_PRESETS: Record<string, LayoutPreset> = {
  // ========================================
  // PLATFORM-SPECIFIC
  // ========================================
  
  'tiktok': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Inter',
        fontSize: 'large',
        color: '#ffffff',
        stroke: { color: '#000000', width: 2 },
        shadow: true,
      },
      position: 'center',
      animation: 'word-by-word',
      maxWordsPerLine: 4,
      highlightColor: '#FFD700',
    },
    safeZone: { top: 15, bottom: 20, left: 5, right: 5 },
  },
  
  'youtube-shorts': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Roboto',
        fontSize: 'medium',
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.75)',
      },
      position: 'bottom',
      animation: 'none',
      maxWordsPerLine: 6,
    },
    safeZone: { top: 10, bottom: 15, left: 5, right: 5 },
  },
  
  'instagram-reels': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Helvetica Neue',
        fontSize: 'medium',
        color: '#ffffff',
        shadow: true,
      },
      position: 'center',
      animation: 'karaoke',
      maxWordsPerLine: 5,
      highlightColor: '#FF6B6B',
    },
    safeZone: { top: 12, bottom: 18, left: 5, right: 5 },
  },
  
  'youtube': {
    aspectRatio: '16:9',
    captions: {
      enabled: true,
      style: {
        font: 'Roboto',
        fontSize: 'small',
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.8)',
      },
      position: 'bottom',
      animation: 'none',
      maxWordsPerLine: 10,
    },
    safeZone: { top: 5, bottom: 10, left: 5, right: 5 },
  },
  
  'twitter': {
    aspectRatio: '1:1',
    captions: {
      enabled: true,
      style: {
        font: 'Helvetica',
        fontSize: 'medium',
        color: '#ffffff',
        stroke: { color: '#000000', width: 1 },
      },
      position: 'bottom',
      animation: 'word-by-word',
      maxWordsPerLine: 5,
    },
    safeZone: { top: 5, bottom: 10, left: 5, right: 5 },
  },
  
  // ========================================
  // STYLE-SPECIFIC
  // ========================================
  
  'bold-captions': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Impact',
        fontSize: 'xlarge',
        color: '#ffffff',
        stroke: { color: '#000000', width: 4 },
        uppercase: true,
      },
      position: 'center',
      animation: 'word-by-word',
      maxWordsPerLine: 3,
    },
    safeZone: { top: 15, bottom: 15, left: 5, right: 5 },
  },
  
  'subtle-captions': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Inter',
        fontSize: 'small',
        color: 'rgba(255,255,255,0.9)',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      position: 'bottom',
      animation: 'fade',
      maxWordsPerLine: 8,
    },
    safeZone: { top: 10, bottom: 12, left: 5, right: 5 },
  },
  
  'no-captions': {
    aspectRatio: '9:16',
    captions: {
      enabled: false,
      position: 'bottom',
    },
    safeZone: { top: 10, bottom: 15, left: 5, right: 5 },
  },
  
  'karaoke': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Montserrat',
        fontSize: 'large',
        color: '#ffffff',
        stroke: { color: '#000000', width: 2 },
      },
      position: 'center',
      animation: 'karaoke',
      maxWordsPerLine: 4,
      highlightColor: '#00FF00',
    },
    safeZone: { top: 15, bottom: 20, left: 5, right: 5 },
  },
  
  'storybook': {
    aspectRatio: '16:9',
    captions: {
      enabled: true,
      style: {
        font: 'Caveat',
        fontSize: 'large',
        color: '#f0e6d3',
      },
      position: 'bottom',
      animation: 'typewriter',
      maxWordsPerLine: 8,
    },
    safeZone: { top: 5, bottom: 12, left: 10, right: 10 },
  },
  
  // ========================================
  // BRANDED
  // ========================================
  
  'branded-corner': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Inter',
        fontSize: 'medium',
        color: '#ffffff',
        stroke: { color: '#000000', width: 2 },
      },
      position: 'center',
      animation: 'word-by-word',
    },
    branding: {
      watermarkPosition: 'top-right',
      watermarkOpacity: 0.7,
      endCard: true,
      endCardDuration: 3,
    },
    safeZone: { top: 15, bottom: 20, left: 5, right: 5 },
  },
  
  'cta-focused': {
    aspectRatio: '9:16',
    captions: {
      enabled: true,
      style: {
        font: 'Inter',
        fontSize: 'medium',
        color: '#ffffff',
        stroke: { color: '#000000', width: 2 },
      },
      position: 'center',
      animation: 'word-by-word',
    },
    branding: {
      endCard: true,
      endCardDuration: 4,
      cta: 'Follow for more!',
    },
    safeZone: { top: 15, bottom: 20, left: 5, right: 5 },
  },
}

export function getLayoutPreset(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS[id]
}

export function listLayoutPresets(): { id: string; preset: LayoutPreset }[] {
  return Object.entries(LAYOUT_PRESETS).map(([id, preset]) => ({ id, preset }))
}
