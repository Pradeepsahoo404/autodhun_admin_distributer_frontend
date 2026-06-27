'use client';

import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface IssuesStatusToggleProps {
  checked: boolean;
  loading?: boolean;
  disabled?: boolean;
  statusLabel: string;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
}

export function IssuesStatusToggle({
  checked,
  loading,
  disabled,
  statusLabel,
  onCheckedChange,
  ariaLabel,
}: IssuesStatusToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-11 items-center justify-center">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-lime" aria-label="Updating status" />
        ) : (
          <Switch
            checked={checked}
            disabled={disabled}
            onCheckedChange={onCheckedChange}
            aria-label={ariaLabel}
          />
        )}
      </div>
      <span className="text-xs text-neutral-500">{statusLabel}</span>
    </div>
  );
}
