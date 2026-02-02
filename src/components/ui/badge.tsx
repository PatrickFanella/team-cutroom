import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800 text-zinc-300',
        success: 'bg-green-900/50 text-green-400 border border-green-800',
        warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
        error: 'bg-red-900/50 text-red-400 border border-red-800',
        info: 'bg-cyan-900/50 text-cyan-400 border border-cyan-800',
        purple: 'bg-purple-900/50 text-purple-400 border border-purple-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// Status badge helpers
export function PipelineStatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    DRAFT: 'default',
    RUNNING: 'info',
    COMPLETE: 'success',
    FAILED: 'error',
  }
  
  return <Badge variant={variants[status] || 'default'}>{status}</Badge>
}

export function StageStatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'> = {
    PENDING: 'default',
    CLAIMED: 'purple',
    RUNNING: 'info',
    COMPLETE: 'success',
    FAILED: 'error',
    SKIPPED: 'warning',
  }
  
  return <Badge variant={variants[status] || 'default'}>{status}</Badge>
}
