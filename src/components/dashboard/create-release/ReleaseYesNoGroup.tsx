'use client';

import { cn } from '@/lib/utils';

interface ReleaseYesNoGroupProps {
  value: 'yes' | 'no';
  onChange: (value: 'yes' | 'no') => void;
  name: string;
  disabled?: boolean;
}

export function ReleaseYesNoGroup({ value, onChange, name, disabled }: ReleaseYesNoGroupProps) {
  const options: { value: 'yes' | 'no'; label: string }[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <div className="flex flex-wrap gap-6" role="radiogroup" aria-label={name}>
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
