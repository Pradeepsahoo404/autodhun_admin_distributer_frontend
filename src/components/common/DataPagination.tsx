'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableSelectField } from '@/components/common/TableSelectField';
import { cn } from '@/lib/utils';
import type { PaginatedMeta } from '@/types';

const DEFAULT_LIMIT_OPTIONS = [
  { value: '5', label: '5 / page' },
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
];

interface DataPaginationProps {
  meta?: PaginatedMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: { value: string; label: string }[];
  className?: string;
}

export function DataPagination({
  meta,
  onPageChange,
  onLimitChange,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  className,
}: DataPaginationProps) {
  if (!meta || meta.total <= 0) return null;

  const { page, totalPages, total, limit } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-b-xl border-t border-[#252525] bg-[#0d0d0d]/60 px-1 pt-4 lg:flex-row lg:items-center lg:justify-between',
        className,
      )}
    >
      <p className="text-[13px] text-neutral-500">
        Showing{' '}
        <span className="font-medium text-brand-lime/90">{start}</span>–
        <span className="font-medium text-brand-lime/90">{end}</span> of{' '}
        <span className="font-medium text-white">{total}</span>
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {onLimitChange ? (
          <TableSelectField
            value={String(limit)}
            onChange={(value) => onLimitChange(Number(value))}
            options={limitOptions}
            aria-label="Rows per page"
            className="min-w-[130px]"
          />
        ) : null}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
            className="h-9 w-9 rounded-lg border-[#2a2a2a] bg-[#141414] p-0 text-neutral-300 hover:border-brand-lime/20 hover:bg-[#1a1a1a] hover:text-brand-lime disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[96px] rounded-lg border border-[#252525] bg-[#141414] px-3 py-1.5 text-center text-[13px] text-neutral-400">
            Page <span className="text-white">{page}</span> of {totalPages}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
            className="h-9 w-9 rounded-lg border-[#2a2a2a] bg-[#141414] p-0 text-neutral-300 hover:border-brand-lime/20 hover:bg-[#1a1a1a] hover:text-brand-lime disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
