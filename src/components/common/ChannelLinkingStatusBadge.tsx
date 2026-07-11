'use client';

import { cn } from '@/lib/utils';
import { getChannelLinkingStatusLabel } from '@/constants/channelLinkingStatus';

interface ChannelLinkingStatusBadgeProps {
  status: string;
  className?: string;
}

export function ChannelLinkingStatusBadge({ status, className }: ChannelLinkingStatusBadgeProps) {
  const isApproved = status === 'approved';
  const isInProcess = status === 'in_process';
  const isRejected = status === 'rejected';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium',
        isApproved && 'border-green-500/25 bg-green-500/10 text-green-400',
        isInProcess && 'border-brand-purple/30 bg-brand-purple/10 text-brand-purple',
        isRejected && 'border-red-500/25 bg-red-500/10 text-red-400',
        !isApproved && !isInProcess && !isRejected && 'border-neutral-600/30 bg-neutral-500/10 text-neutral-400',
        className,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          isApproved && 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]',
          isInProcess && 'bg-brand-purple shadow-[0_0_6px_rgba(139,127,240,0.5)]',
          isRejected && 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]',
          !isApproved && !isInProcess && !isRejected && 'bg-neutral-500',
        )}
        aria-hidden
      />
      {getChannelLinkingStatusLabel(status)}
    </span>
  );
}
