'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
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
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Raise popover above AppModal (z-[200]). */
  inModal?: boolean;
  'aria-label'?: string;
}

export function TableSelectField({
  value: valueProp,
  onChange,
  options,
  className,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  inModal = false,
  'aria-label': ariaLabel,
}: TableSelectFieldProps) {
  const value = valueProp ?? '';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((option) => option.value === value) ?? options[0];
  const selectableOptions = options.filter((option) => option.value !== '');
  const normalizedQuery = query.trim().toLowerCase();

  const displayedOptions = useMemo(() => {
    if (!searchable || !normalizedQuery) return selectableOptions;
    return selectableOptions.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, searchable, selectableOptions]);

  const selectValue = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    setQuery('');
  };

  const handleOpenChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
    if (!next) setQuery('');
  };

  return (
    <div className={cn('relative min-w-[180px]', className)}>
      <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
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
          <span className={cn('truncate text-[14px]', !value && 'text-neutral-500')}>
            {selected?.label ?? options[0]?.label ?? 'Select...'}
          </span>
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
        {searchable ? (
          <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-neutral-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent py-1 text-[14px] text-white outline-none placeholder:text-neutral-600"
            />
          </div>
        ) : null}
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className={searchable ? 'max-h-48 overflow-y-auto' : ''}
        >
          {displayedOptions.length === 0 ? (
            <li className="px-4 py-2.5 text-[13px] text-neutral-500">No matches found</li>
          ) : (
            displayedOptions.map((option, index) => {
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
            })
          )}
        </ul>
      </PopoverContent>
      </Popover>
    </div>
  );
}
