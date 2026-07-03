'use client';

import { cn } from '@/lib/utils';

export interface ReleaseRadioOption {
  value: string;
  label: string;
}

interface ReleaseRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  options: ReleaseRadioOption[];
  disabled?: boolean;
  direction?: 'row' | 'column';
}

export function ReleaseRadioGroup({
  value,
  onChange,
  name,
  options,
  disabled,
  direction = 'row',
}: ReleaseRadioGroupProps) {
  return (
    <div
      className={cn('flex gap-6', direction === 'column' ? 'flex-col' : 'flex-wrap')}
      role="radiogroup"
      aria-label={name}
    >
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex cursor-pointer items-center gap-2.5 text-[14px] text-neutral-300',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              className={cn(
                'pointer-events-none flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                checked ? 'border-brand-lime' : 'border-neutral-600',
              )}
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full bg-brand-lime transition-opacity',
                  checked ? 'opacity-100' : 'opacity-0',
                )}
              />
            </span>
            <span className="pointer-events-none">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
