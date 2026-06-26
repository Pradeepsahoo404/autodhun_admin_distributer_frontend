'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField, type TableSelectOption } from '@/components/common/TableSelectField';
import { cn } from '@/lib/utils';
import type { PaginatedMeta } from '@/types';

interface DataListShellProps {
  title: string;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: TableSelectOption[];
  statusAriaLabel?: string;
  children: React.ReactNode;
  meta?: PaginatedMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  isFetching?: boolean;
  className?: string;
}

/** Shared list layout: toolbar (search + filter), content area, and backend pagination. */
export function DataListShell({
  title,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  statusAriaLabel = 'Filter by status',
  children,
  meta,
  onPageChange,
  onLimitChange,
  isLoading,
  isEmpty,
  emptyMessage = 'No results found.',
  isFetching,
  className,
}: DataListShellProps) {
  const showStatusFilter = statusOptions && statusFilter !== undefined && onStatusFilterChange;

  return (
    <Card className={cn('border-[#1a1a1a] bg-[#111111]', className)}>
      <CardHeader className="space-y-4 border-b border-[#1a1a1a] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-white">{title}</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <TableSearchField value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
            {showStatusFilter ? (
              <TableSelectField
                value={statusFilter}
                onChange={onStatusFilterChange}
                options={statusOptions}
                aria-label={statusAriaLabel}
              />
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {isLoading ? (
          <p className="py-10 text-center text-neutral-500">Loading...</p>
        ) : isEmpty ? (
          <p className="py-10 text-center text-neutral-500">{emptyMessage}</p>
        ) : (
          children
        )}

        <DataPagination meta={meta} onPageChange={onPageChange} onLimitChange={onLimitChange} className="mt-5" />
        {isFetching && !isLoading ? (
          <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
