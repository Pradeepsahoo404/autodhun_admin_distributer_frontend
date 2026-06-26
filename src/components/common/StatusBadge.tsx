'use client';

import { cn } from '@/lib/utils';
import { getLegalModuleStatusLabel } from '@/constants/legalModuleStatus';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isActive = status === 'active';
  const isInProgress = status === 'in_progress';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium',
        isActive && 'border-green-500/25 bg-green-500/10 text-green-400',
        isInProgress && 'border-brand-purple/30 bg-brand-purple/10 text-brand-purple',
        !isActive && !isInProgress && 'border-neutral-600/30 bg-neutral-500/10 text-neutral-400',
        className,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          isActive && 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]',
          isInProgress && 'bg-brand-purple shadow-[0_0_6px_rgba(139,127,240,0.5)]',
          !isActive && !isInProgress && 'bg-neutral-500',
        )}
        aria-hidden
      />
      {getLegalModuleStatusLabel(status)}
    </span>
  );
}
