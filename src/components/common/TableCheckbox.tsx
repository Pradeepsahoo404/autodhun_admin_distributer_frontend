'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableCheckboxProps {
  checked: boolean;
  onChange: () => void;
  'aria-label': string;
  disabled?: boolean;
  className?: string;
}

/** Dashboard table row / header checkbox — consistent checked state across browsers. */
export function TableCheckbox({
  checked,
  onChange,
  'aria-label': ariaLabel,
  disabled,
  className,
}: TableCheckboxProps) {
  return (
    <label
      className={cn(
        'relative inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange()}
        aria-label={ariaLabel}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-[3px] border border-[#3d3d3d] bg-[#141414] transition-colors',
          'peer-checked:border-brand-lime peer-checked:bg-brand-lime',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-lime/40 peer-focus-visible:ring-offset-0',
          'peer-disabled:cursor-not-allowed',
        )}
      />
      <Check
        aria-hidden
        className={cn(
          'relative z-10 h-3 w-3 transition-opacity',
          checked ? 'text-black opacity-100' : 'text-white opacity-0',
        )}
        strokeWidth={3}
      />
    </label>
  );
}
