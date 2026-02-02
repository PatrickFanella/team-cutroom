'use client'

import { useState } from 'react'
import { usePipelines } from '@/lib/api/hooks'
import { PipelineCard } from '@/components/pipeline/pipeline-card'
import { CreatePipelineModal } from '@/components/pipeline/create-pipeline-modal'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'

export default function PipelinesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  
  const { data, isLoading, error } = usePipelines(statusFilter as any)

  const statuses = [
    { value: undefined, label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'RUNNING', label: 'Running' },
    { value: 'COMPLETE', label: 'Complete' },
    { value: 'FAILED', label: 'Failed' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pipelines</h1>
          <p className="text-zinc-500 mt-1">
            Manage your video production pipelines
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New Pipeline
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {statuses.map((status) => (
          <button
            key={status.value ?? 'all'}
            onClick={() => setStatusFilter(status.value)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              statusFilter === status.value
                ? 'bg-cyan-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-400">Failed to load pipelines</p>
          <p className="text-sm text-zinc-500 mt-1">Please try again later</p>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !error && data?.pipelines.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">🎬</div>
          <h2 className="text-xl font-bold mb-2">No pipelines yet</h2>
          <p className="text-zinc-500 mb-6">
            Create your first video production pipeline to get started.
          </p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Pipeline
          </Button>
        </div>
      )}
      
      {/* Pipeline grid */}
      {!isLoading && !error && data && data.pipelines.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.pipelines.map((pipeline) => (
            <PipelineCard key={pipeline.id} pipeline={pipeline} />
          ))}
        </div>
      )}
      
      {/* Create modal */}
      <CreatePipelineModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </div>
  )
}
