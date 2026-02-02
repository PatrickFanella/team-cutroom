'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PipelineStatusBadge } from '@/components/ui/badge'
import { formatRelativeTime, STAGE_META } from '@/lib/utils'
import type { PipelineWithStages } from '@/lib/api/hooks'

interface PipelineCardProps {
  pipeline: PipelineWithStages
}

export function PipelineCard({ pipeline }: PipelineCardProps) {
  const completedStages = pipeline.stages.filter(s => s.status === 'COMPLETE').length
  const totalStages = pipeline.stages.length
  const progressPercent = Math.round((completedStages / totalStages) * 100)
  
  const currentStageMeta = STAGE_META[pipeline.currentStage] || { emoji: '❓', label: pipeline.currentStage }

  return (
    <Link href={`/pipelines/${pipeline.id}`}>
      <Card className="hover:border-zinc-700 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">{pipeline.topic}</CardTitle>
              {pipeline.description && (
                <CardDescription className="line-clamp-1">
                  {pipeline.description}
                </CardDescription>
              )}
            </div>
            <PipelineStatusBadge status={pipeline.status} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
              <span>{completedStages}/{totalStages} stages</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          {/* Current stage & time */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <span>{currentStageMeta.emoji}</span>
              <span>{currentStageMeta.label}</span>
            </div>
            <span className="text-xs text-zinc-500">
              {formatRelativeTime(pipeline.updatedAt)}
            </span>
          </div>
          
          {/* Stage dots */}
          <div className="flex items-center gap-1 mt-3">
            {pipeline.stages.map((stage) => {
              const meta = STAGE_META[stage.name]
              const statusColors: Record<string, string> = {
                PENDING: 'bg-zinc-700',
                CLAIMED: 'bg-purple-500',
                RUNNING: 'bg-cyan-500 animate-pulse',
                COMPLETE: 'bg-green-500',
                FAILED: 'bg-red-500',
                SKIPPED: 'bg-yellow-500',
              }
              return (
                <div
                  key={stage.id}
                  className={`w-full h-1.5 rounded-full ${statusColors[stage.status] || 'bg-zinc-700'}`}
                  title={`${meta?.label || stage.name}: ${stage.status}`}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
