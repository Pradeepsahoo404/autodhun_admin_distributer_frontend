'use client';

import { cn } from '@/lib/utils';
import { getIssuesEntryOwnershipLabel } from '@/constants/issuesEntry';

interface IssuesOwnershipControlProps {
  value: string;
  disabled?: boolean;
  loading?: boolean;
  onChange: (ownership: 'yes' | 'no') => void;
}

export function IssuesOwnershipControl({
  value,
  disabled,
  loading,
  onChange,
}: IssuesOwnershipControlProps) {
  if (disabled && value) {
    return (
      <span
        className={cn(
          'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
          value === 'yes'
            ? 'border-green-500/25 bg-green-500/10 text-green-400'
            : 'border-red-500/25 bg-red-500/10 text-red-400',
        )}
      >
        {getIssuesEntryOwnershipLabel(value)}
      </span>
    );
  }

  return (
    <div className="inline-flex rounded-lg border border-[#2a2a2a] bg-[#111111] p-0.5">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => onChange('yes')}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          value === 'yes'
            ? 'bg-green-500/15 text-green-400'
            : 'text-neutral-400 hover:text-white',
        )}
      >
        Yes
      </button>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => onChange('no')}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          value === 'no' ? 'bg-red-500/15 text-red-400' : 'text-neutral-400 hover:text-white',
        )}
      >
        No
      </button>
    </div>
  );
}
