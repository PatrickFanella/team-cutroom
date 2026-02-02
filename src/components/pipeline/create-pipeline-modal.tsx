'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { useCreatePipeline } from '@/lib/api/hooks'

interface CreatePipelineModalProps {
  open: boolean
  onClose: () => void
}

export function CreatePipelineModal({ open, onClose }: CreatePipelineModalProps) {
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  
  const createPipeline = useCreatePipeline()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!topic.trim()) {
      setError('Topic is required')
      return
    }
    
    try {
      await createPipeline.mutateAsync({
        topic: topic.trim(),
        description: description.trim() || undefined,
      })
      
      // Reset and close
      setTopic('')
      setDescription('')
      onClose()
    } catch (err) {
      setError('Failed to create pipeline. Please try again.')
    }
  }

  const handleClose = () => {
    setTopic('')
    setDescription('')
    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Pipeline"
      description="Start a new video production pipeline"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="topic"
          label="Topic *"
          placeholder="e.g., How AI is changing education"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          error={error && !topic.trim() ? 'Topic is required' : undefined}
          autoFocus
        />
        
        <Textarea
          id="description"
          label="Description (optional)"
          placeholder="Additional context, target audience, key points to cover..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        
        {error && topic.trim() && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createPipeline.isPending}>
            Create Pipeline
          </Button>
        </div>
      </form>
    </Modal>
  )
}
