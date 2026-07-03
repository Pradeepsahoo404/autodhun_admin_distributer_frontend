'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { LookupSelectField } from '@/components/dashboard/create-release/LookupSelectField';

interface SearchableMultiFieldProps {
  values: string[];
  onChange: (values: string[]) => void;
  loadOptions: () => string[];
  persistOption: (value: string) => void;
  selectPlaceholder?: string;
  addNewLabel?: string;
  addMoreLabel?: string;
  error?: string;
  ariaLabel: string;
}

/** Repeatable lookup dropdowns with add-more (artists, labels). */
export function SearchableMultiField({
  values,
  onChange,
  loadOptions,
  persistOption,
  selectPlaceholder = '- Select -',
  addNewLabel = '-- Add New --',
  addMoreLabel = 'Add More',
  error,
  ariaLabel,
}: SearchableMultiFieldProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setOptions(loadOptions());
  }, [loadOptions]);

  const refreshOptions = () => setOptions(loadOptions());

  const updateAt = (index: number, next: string) => {
    const copy = [...values];
    copy[index] = next;
    onChange(copy);
    if (next.trim()) {
      persistOption(next);
      refreshOptions();
    }
  };

  const addRow = () => onChange([...values, '']);

  const removeAt = (index: number) => {
    if (values.length <= 1) {
      onChange(['']);
      return;
    }
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {values.map((value, index) => (
        <div key={`${ariaLabel}-${index}`} className="flex items-center gap-2">
          <LookupSelectField
            value={value}
            onChange={(next) => updateAt(index, next)}
            options={options}
            onPersistOption={persistOption}
            selectPlaceholder={selectPlaceholder}
            addNewLabel={addNewLabel}
            aria-label={`${ariaLabel} ${index + 1}`}
          />
          {values.length > 1 ? (
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1f1f1f] text-neutral-500 transition-colors hover:border-red-500/40 hover:text-red-400"
              aria-label={`Remove ${ariaLabel} ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-lime transition-colors hover:text-brand-lime-dark"
      >
        <Plus className="h-4 w-4" />
        {addMoreLabel}
      </button>

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
