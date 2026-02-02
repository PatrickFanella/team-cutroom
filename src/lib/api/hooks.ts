import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Pipeline, Stage, Attribution, PipelineStatus, StageName } from '@prisma/client'

// Types
export type PipelineWithStages = Pipeline & {
  stages: Stage[]
  attributions?: Attribution[]
}

// API fetchers
async function fetchPipelines(status?: PipelineStatus): Promise<{ pipelines: PipelineWithStages[]; count: number }> {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  
  const res = await fetch(`/api/pipelines?${params}`)
  if (!res.ok) throw new Error('Failed to fetch pipelines')
  return res.json()
}

async function fetchPipeline(id: string): Promise<PipelineWithStages> {
  const res = await fetch(`/api/pipelines/${id}`)
  if (!res.ok) throw new Error('Failed to fetch pipeline')
  return res.json()
}

async function createPipelineApi(data: { topic: string; description?: string }): Promise<PipelineWithStages> {
  const res = await fetch('/api/pipelines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create pipeline')
  return res.json()
}

async function startPipelineApi(id: string): Promise<Pipeline> {
  const res = await fetch(`/api/pipelines/${id}/start`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to start pipeline')
  return res.json()
}

async function fetchAvailableStages(stageName?: StageName): Promise<{ stages: (Stage & { pipeline: Pipeline })[] }> {
  const params = new URLSearchParams()
  if (stageName) params.set('stage', stageName)
  
  const res = await fetch(`/api/stages/available?${params}`)
  if (!res.ok) throw new Error('Failed to fetch available stages')
  return res.json()
}

// Query hooks
export function usePipelines(status?: PipelineStatus) {
  return useQuery({
    queryKey: ['pipelines', status],
    queryFn: () => fetchPipelines(status),
  })
}

export function usePipeline(id: string) {
  return useQuery({
    queryKey: ['pipeline', id],
    queryFn: () => fetchPipeline(id),
    enabled: !!id,
  })
}

export function useAvailableStages(stageName?: StageName) {
  return useQuery({
    queryKey: ['availableStages', stageName],
    queryFn: () => fetchAvailableStages(stageName),
  })
}

// Mutation hooks
export function useCreatePipeline() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createPipelineApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
    },
  })
}

export function useStartPipeline() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: startPipelineApi,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
      queryClient.invalidateQueries({ queryKey: ['pipeline', id] })
    },
  })
}
