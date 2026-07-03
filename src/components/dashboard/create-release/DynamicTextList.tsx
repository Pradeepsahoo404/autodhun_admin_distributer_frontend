'use client';

import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tableControlClass } from '@/components/common/tableControls';

interface DynamicTextListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  error?: string;
  required?: boolean;
}

/** Repeatable text inputs with add/remove (artists, labels). */
export function DynamicTextList({
  label,
  values,
  onChange,
  placeholder = 'Enter name',
  addLabel = 'Add More',
  error,
  required,
}: DynamicTextListProps) {
  const updateAt = (index: number, next: string) => {
    const copy = [...values];
    copy[index] = next;
    onChange(copy);
  };

  const addRow = () => onChange([...values, '']);

  const removeAt = (index: number) => {
    if (values.length <= 1) return;
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <p className="text-[13px] font-medium text-neutral-400">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </p>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => updateAt(index, e.target.value)}
              placeholder={placeholder}
              className={cn(tableControlClass, 'flex-1 px-4')}
            />
            {values.length > 1 ? (
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1f1f1f] text-neutral-500 transition-colors hover:border-red-500/40 hover:text-red-400"
                aria-label={`Remove ${label} ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-lime transition-colors hover:text-brand-lime-dark"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
