'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminBadge } from '@/components/common/AdminBadge';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import {
  dashboardTableBodyClass,
  dashboardTableCellMeta,
  dashboardTableCellPrimary,
  dashboardTableClass,
  dashboardTableHeadClass,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  legalModuleCardClass,
  legalModuleCardHeaderClass,
  slugBadgeClass,
} from '@/components/common/dashboardTableStyles';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/lib/formatDateTime';
import { useGetLabelUpdatesQuery } from '@/store/api';
import type { PaginatedMeta } from '@/types';
import type { LabelUpdateRecord } from '@/store/api/labelUpdateApi';

const DEFAULT_PAGE_LIMIT = 10;

interface LabelUpdatesTableProps {
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

export function LabelUpdatesTable({
  title = 'Label Update History',
  description = 'Records of label name changes made by Super Admin.',
  compact = false,
  className,
}: LabelUpdatesTableProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(compact ? 5 : DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
    }),
    [page, limit, search],
  );

  const { data, isLoading, isFetching } = useGetLabelUpdatesQuery(queryParams);
  const items = data?.data?.items ?? [];
  const meta = data?.data as (PaginatedMeta & { items: LabelUpdateRecord[] }) | undefined;
  const isListLoading = isLoading || isFetching;

  return (
    <Card className={cn(legalModuleCardClass, className)}>
      <CardHeader className={legalModuleCardHeaderClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-purple/20 bg-brand-purple/10">
              <RefreshCw className="h-4 w-4 text-brand-purple" />
            </div>
            <div>
              <CardTitle className="text-white">{title}</CardTitle>
              <p className="mt-1 text-[13px] text-neutral-500">{description}</p>
            </div>
          </div>
          <TableSearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search previous or new name..."
          />
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {isListLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand-lime" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-neutral-500">
            {search ? 'No label updates match your search.' : 'No label updates recorded yet.'}
          </p>
        ) : (
          <>
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[920px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Previous Name</th>
                      <th>New Name</th>
                      <th>Owner</th>
                      <th>Updated By</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {items.map((item) => (
                      <tr key={item._id} className={dashboardTableRowClass}>
                        <td className={dashboardTableCellPrimary}>
                          <span className={slugBadgeClass}>{item.previousName}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={slugBadgeClass}>{item.newName}</span>
                        </td>
                        <td className="px-4 py-4">
                          <AdminBadge name={item.owner?.name} />
                        </td>
                        <td className="px-4 py-4">
                          <AdminBadge name={item.updatedBy?.name} />
                        </td>
                        <td className={dashboardTableCellMeta}>{formatShortDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {meta && meta.totalPages > 0 ? (
              <DataPagination
                meta={meta}
                onPageChange={setPage}
                onLimitChange={(nextLimit) => {
                  setLimit(nextLimit);
                  setPage(1);
                }}
              />
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
