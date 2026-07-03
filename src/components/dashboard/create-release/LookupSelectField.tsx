'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tableControlClass } from '@/components/common/tableControls';
import { getApiErrorMessage } from '@/services/apiClient';

interface LookupSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onPersistOption?: (value: string) => void | Promise<void>;
  selectPlaceholder?: string;
  addNewLabel?: string;
  duplicateErrorMessage?: string;
  allowAddNew?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

function isDuplicateName(name: string, options: string[]): boolean {
  const normalized = name.trim().toLowerCase();
  return options.some((opt) => opt.trim().toLowerCase() === normalized);
}

/** Dropdown select with search filter and "Add new" option (artist / label). */
export function LookupSelectField({
  value,
  onChange,
  options,
  onPersistOption,
  selectPlaceholder = '- Select -',
  addNewLabel = '-- Add New --',
  duplicateErrorMessage = 'This name already exists',
  allowAddNew = true,
  disabled,
  'aria-label': ariaLabel,
}: LookupSelectFieldProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [addNewError, setAddNewError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return options;
    return options.filter((opt) => opt.toLowerCase().includes(normalizedQuery));
  }, [options, normalizedQuery]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
        setAddingNew(false);
        setNewValue('');
        setAddNewError('');
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selectOption = (next: string) => {
    onChange(next);
    setOpen(false);
    setQuery('');
    setAddingNew(false);
    setNewValue('');
    setAddNewError('');
  };

  const confirmAddNew = async () => {
    const trimmed = newValue.trim();
    if (!trimmed || isSaving) return;

    if (isDuplicateName(trimmed, options)) {
      setAddNewError(duplicateErrorMessage);
      return;
    }

    setAddNewError('');
    setIsSaving(true);

    try {
      if (onPersistOption) {
        await onPersistOption(trimmed);
      }
      selectOption(trimmed);
    } catch (err) {
      setAddNewError(getApiErrorMessage(err, duplicateErrorMessage));
    } finally {
      setIsSaving(false);
    }
  };

  const displayLabel = value || selectPlaceholder;

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (disabled) return;
          setOpen((o) => !o);
          setAddingNew(false);
          setNewValue('');
          setAddNewError('');
        }}
        className={cn(
          tableControlClass,
          'flex w-full items-center justify-between gap-2 px-4 text-left',
          open && 'border-brand-lime/40 ring-1 ring-brand-lime/20',
          !value && 'text-neutral-500',
          value && 'text-white',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span className="truncate text-[14px]">{displayLabel}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-neutral-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && !disabled ? (
        <div
          id={listId}
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-[#222] bg-[#111] shadow-xl shadow-black/40"
        >
          {!addingNew ? (
            <>
              <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-neutral-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="min-w-0 flex-1 bg-transparent py-1 text-[14px] text-white outline-none placeholder:text-neutral-600"
                  autoFocus
                />
              </div>

              <ul role="listbox" className="max-h-48 overflow-y-auto py-1">
                {allowAddNew ? (
                  <li role="option" aria-selected={false}>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingNew(true);
                        setNewValue(query.trim());
                        setAddNewError('');
                      }}
                      className="flex w-full px-4 py-2.5 text-left text-[14px] font-medium text-brand-lime transition-colors hover:bg-brand-lime/5"
                    >
                      {addNewLabel}
                    </button>
                  </li>
                ) : null}

                {filtered.length === 0 ? (
                  <li className="px-4 py-2.5 text-[13px] text-neutral-500">No matches found</li>
                ) : (
                  filtered.map((opt) => {
                    const selected = opt === value;
                    return (
                      <li key={opt} role="option" aria-selected={selected}>
                        <button
                          type="button"
                          onClick={() => selectOption(opt)}
                          className={cn(
                            'flex w-full px-4 py-2.5 text-left text-[14px] transition-colors',
                            selected
                              ? 'bg-brand-lime/15 text-brand-lime'
                              : 'text-neutral-300 hover:bg-[#1a1a1a] hover:text-white',
                          )}
                        >
                          {opt}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </>
          ) : (
            <div className="space-y-3 p-3">
              <p className="text-[13px] font-medium text-neutral-400">{addNewLabel}</p>
              <input
                type="text"
                value={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value);
                  if (addNewError) setAddNewError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    confirmAddNew();
                  }
                }}
                placeholder="Enter name"
                className={cn(tableControlClass, 'w-full px-4')}
                autoFocus
              />
              {addNewError ? <p className="text-xs text-red-400">{addNewError}</p> : null}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddingNew(false);
                    setNewValue('');
                    setAddNewError('');
                  }}
                  className="rounded-lg px-3 py-1.5 text-[13px] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAddNew}
                  disabled={isSaving || !newValue.trim()}
                  className="rounded-lg bg-brand-lime px-3 py-1.5 text-[13px] font-semibold text-black hover:bg-brand-lime-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
