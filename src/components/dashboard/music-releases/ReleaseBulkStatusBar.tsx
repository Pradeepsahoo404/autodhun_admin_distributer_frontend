'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableSelectField } from '@/components/common/TableSelectField';
import type { MusicReleaseStatus } from '@/constants/musicReleaseStatus';

interface BulkStatusOption {
  value: string;
  label: string;
}

interface ReleaseBulkStatusBarProps {
  selectedCount: number;
  status: MusicReleaseStatus;
  statusOptions: BulkStatusOption[];
  isApplying: boolean;
  onStatusChange: (status: MusicReleaseStatus) => void;
  onApply: () => void;
  onClear: () => void;
}

export function ReleaseBulkStatusBar({
  selectedCount,
  status,
  statusOptions,
  isApplying,
  onStatusChange,
  onApply,
  onClear,
}: ReleaseBulkStatusBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-brand-lime/20 bg-brand-lime/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-neutral-300">
        <span className="font-semibold text-brand-lime">{selectedCount}</span> selected
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <TableSelectField
          value={status}
          onChange={(value) => onStatusChange(value as MusicReleaseStatus)}
          options={statusOptions}
          aria-label="Bulk update status"
          className="min-w-[160px]"
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            disabled={isApplying}
            onClick={onApply}
            className="rounded-lg bg-brand-lime text-black hover:bg-brand-lime-dark"
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              'Apply status'
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={isApplying}
            onClick={onClear}
            className="text-neutral-400 hover:text-white"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
