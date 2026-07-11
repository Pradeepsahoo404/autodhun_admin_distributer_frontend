'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
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
import { useGetLabelTransferHistoryQuery } from '@/store/api';
import type { PaginatedMeta } from '@/types';
import type { LabelTransferHistoryRecord } from '@/store/api/labelUpdateApi';

const DEFAULT_PAGE_LIMIT = 10;

export function LabelTransferHistoryTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
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

  const { data, isLoading, isFetching } = useGetLabelTransferHistoryQuery(queryParams);
  const items = data?.data?.items ?? [];
  const meta = data?.data as (PaginatedMeta & { items: LabelTransferHistoryRecord[] }) | undefined;
  const isListLoading = isLoading || isFetching;

  return (
    <Card className={legalModuleCardClass}>
      <CardHeader className={legalModuleCardHeaderClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/20 bg-brand-lime/10">
              <ArrowLeftRight className="h-4 w-4 text-brand-lime" />
            </div>
            <div>
              <CardTitle className="text-white">Transfer History</CardTitle>
              <p className="mt-1 text-[13px] text-neutral-500">
                Past label ownership transfers between admins.
              </p>
            </div>
          </div>
          <TableSearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search label name..."
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
            {search ? 'No transfers match your search.' : 'No label transfers recorded yet.'}
          </p>
        ) : (
          <>
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[920px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Label</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Transferred By</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {items.map((item) => (
                      <tr key={item._id} className={dashboardTableRowClass}>
                        <td className={dashboardTableCellPrimary}>
                          <span className={slugBadgeClass}>{item.labelName}</span>
                        </td>
                        <td className="px-4 py-4">
                          <AdminBadge name={item.fromUser?.name} />
                        </td>
                        <td className="px-4 py-4">
                          <AdminBadge name={item.toUser?.name} />
                        </td>
                        <td className="px-4 py-4">
                          <AdminBadge name={item.transferredBy?.name} />
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
