'use client';

import { Download, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePickerField } from '@/components/common/DatePickerField';
import { cn } from '@/lib/utils';

interface ExportDateRangeBarProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onExport: () => void;
  onClear?: () => void;
  exporting?: boolean;
  className?: string;
}

export function ExportDateRangeBar({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onExport,
  onClear,
  exporting,
  className,
}: ExportDateRangeBarProps) {
  const hasFilter = Boolean(dateFrom || dateTo);

  return (
    <div className={cn('flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end', className)}>
      <DatePickerField
        id="export-date-from"
        label="From date"
        value={dateFrom}
        onChange={onDateFromChange}
        maxDate={dateTo || undefined}
        disabled={exporting}
        className="w-full sm:w-auto"
      />
      <DatePickerField
        id="export-date-to"
        label="To date"
        value={dateTo}
        onChange={onDateToChange}
        minDate={dateFrom || undefined}
        disabled={exporting}
        className="w-full sm:w-auto"
      />

      <div className="flex items-end gap-2 sm:ml-0">
        {hasFilter ? (
          <Button
            type="button"
            variant="ghost"
            disabled={exporting}
            onClick={() => onClear?.()}
            className="h-11 rounded-xl px-3 text-neutral-400 hover:bg-[#1a1a1a] hover:text-white"
            title="Clear date filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          type="button"
          disabled={exporting}
          onClick={onExport}
          className="h-11 rounded-xl bg-brand-lime px-5 text-black hover:bg-brand-lime-dark"
        >
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export CSV
        </Button>
      </div>
    </div>
  );
}
