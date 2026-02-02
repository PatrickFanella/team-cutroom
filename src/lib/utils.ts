import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

// Stage metadata
export const STAGE_META: Record<string, { emoji: string; label: string; description: string }> = {
  RESEARCH: { emoji: '🔍', label: 'Research', description: 'Find facts and sources' },
  SCRIPT: { emoji: '📝', label: 'Script', description: 'Write the video script' },
  VOICE: { emoji: '🎙️', label: 'Voice', description: 'Synthesize narration' },
  MUSIC: { emoji: '🎵', label: 'Music', description: 'Add background track' },
  VISUAL: { emoji: '🎨', label: 'Visual', description: 'Source b-roll and images' },
  EDITOR: { emoji: '🎬', label: 'Editor', description: 'Assemble final video' },
  PUBLISH: { emoji: '🚀', label: 'Publish', description: 'Post to platforms' },
}

// Stage weights for attribution
export const STAGE_WEIGHTS: Record<string, number> = {
  RESEARCH: 10,
  SCRIPT: 25,
  VOICE: 20,
  MUSIC: 10,
  VISUAL: 15,
  EDITOR: 15,
  PUBLISH: 5,
}
