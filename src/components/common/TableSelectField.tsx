'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tableControlClass } from '@/components/common/tableControls';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface TableSelectOption {
  value: string;
  label: string;
}

interface TableSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: TableSelectOption[];
  className?: string;
  disabled?: boolean;
  /** Raise popover above AppModal (z-[200]). */
  inModal?: boolean;
  'aria-label'?: string;
}

export function TableSelectField({
  value,
  onChange,
  options,
  className,
  disabled = false,
  inModal = false,
  'aria-label': ariaLabel,
}: TableSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  const selectValue = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className={cn('relative min-w-[180px]', className)}>
      <Popover open={open && !disabled} onOpenChange={(next) => !disabled && setOpen(next)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            tableControlClass,
            'flex w-full items-center justify-between gap-2 px-4 text-left',
            open && 'border-brand-lime/40 ring-1 ring-brand-lime/20',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <span className="truncate">{selected?.label}</span>
          <ChevronDown
            className={cn('h-4 w-4 shrink-0 text-neutral-500 transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className={cn(
          'w-[var(--radix-popover-trigger-width)] overflow-hidden p-0',
          inModal && 'z-[250]',
        )}
      >
        <ul role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value || `option-${index}`} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => selectValue(option.value)}
                  className={cn(
                    'flex w-full items-center px-4 py-2.5 text-left text-[14px] transition-colors',
                    isSelected
                      ? 'bg-brand-lime/10 text-brand-lime'
                      : 'text-neutral-300 hover:bg-[#1a1a1a] hover:text-white',
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
      </Popover>
    </div>
  );
}
