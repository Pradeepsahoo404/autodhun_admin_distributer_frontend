'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useDeleteChannelLinkingMutation,
  useExportChannelLinkingMutation,
  useGetChannelLinkingEntriesQuery,
  useUpdateChannelLinkingStatusMutation,
} from '@/store/api';
import { usePermission } from '@/hooks/usePermission';
import { useAppSelector } from '@/hooks/useAppStore';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE, ROLES } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { ExportDateRangeBar } from '@/components/common/ExportDateRangeBar';
import { ChannelLinkingStatusBadge } from '@/components/common/ChannelLinkingStatusBadge';
import { ChannelLinkingStatusSelect } from '@/components/common/ChannelLinkingStatusSelect';
import { AdminBadge } from '@/components/common/AdminBadge';
import { TableRowActions } from '@/components/common/TableRowActions';
import {
  CHANNEL_LINKING_STATUS_FILTER_OPTIONS,
  type ChannelLinkingStatus,
  type ChannelLinkingStatusFilter,
} from '@/constants/channelLinkingStatus';
import {
  dashboardTableBodyClass,
  dashboardTableCellActions,
  dashboardTableCellStatus,
  dashboardTableCellStatusControl,
  dashboardTableHeadCellActions,
  dashboardTableHeadCellStatus,
  dashboardTableCellMeta,
  dashboardTableCellMuted,
  dashboardTableCellPrimary,
  dashboardTableClass,
  dashboardTableHeadClass,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  legalModuleCardClass,
  legalModuleCardHeaderClass,
} from '@/components/common/dashboardTableStyles';
import { CreateChannelLinkingDialog } from '@/components/dashboard/channel-linking/CreateChannelLinkingDialog';
import { EditChannelLinkingDialog } from '@/components/dashboard/channel-linking/EditChannelLinkingDialog';
import { DeleteChannelLinkingDialog } from '@/components/dashboard/channel-linking/DeleteChannelLinkingDialog';
import { formatDateTime } from '@/lib/formatDateTime';
import { cn } from '@/lib/utils';
import type { PaginatedMeta, ChannelLinking } from '@/types';
import { isElevatedRole } from '@/utils/roles';

const DEFAULT_PAGE_LIMIT = 10;

function formatRevenue(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatViews(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export default function ChannelLinkingPage() {
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const isSuperAdmin = isElevatedRole(currentUser?.role);
  const { canCreate, canUpdate, canDelete } = usePermission('channel-linking');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChannelLinkingStatusFilter>('all');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<ChannelLinking | null>(null);
  const [deleteItem, setDeleteItem] = useState<ChannelLinking | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [page, limit, search, statusFilter, dateFrom, dateTo],
  );

  const { data, isLoading, isFetching } = useGetChannelLinkingEntriesQuery(queryParams, {
    pollingInterval: 60_000,
  });
  const [updateStatus] = useUpdateChannelLinkingStatusMutation();
  const [deleteEntry, { isLoading: deleting }] = useDeleteChannelLinkingMutation();
  const [exportCsv, { isLoading: exporting }] = useExportChannelLinkingMutation();

  const items = data?.data ?? [];
  const meta = data?.meta as PaginatedMeta | undefined;

  const handleStatusChange = async (item: ChannelLinking, status: ChannelLinkingStatus) => {
    setStatusUpdatingId(item._id);
    try {
      await updateStatus({ id: item._id, body: { status } }).unwrap();
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await deleteEntry(deleteItem._id).unwrap();
      toast.success('Channel linking deleted');
      setDeleteItem(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportCsv({
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
      }).unwrap();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `channel-linking-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Linking"
        description={
          isSuperAdmin
            ? 'Review all channel linking submissions, approve or reject them, and manage entries'
            : 'Submit channel linking requests for review'
        }
        action={
          !isSuperAdmin && canCreate ? (
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Linking
            </Button>
          ) : undefined
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <CardTitle className="text-white">
              {isSuperAdmin ? 'All channel linking' : 'My channel linking'}
            </CardTitle>
            <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:items-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <TableSearchField
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="Search channel name or link..."
                />
                <TableSelectField
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value as ChannelLinkingStatusFilter);
                    setPage(1);
                  }}
                  options={[...CHANNEL_LINKING_STATUS_FILTER_OPTIONS]}
                  aria-label="Filter by status"
                />
              </div>
              <ExportDateRangeBar
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                onClear={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                onExport={() => void handleExport()}
                exporting={exporting}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {isLoading ? (
            <p className="py-10 text-center text-neutral-500">Loading channel linking...</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-neutral-500">
                {isSuperAdmin
                  ? 'No channel linking entries found.'
                  : 'You have not submitted any channel linking entries yet.'}
              </p>
              {!isSuperAdmin && canCreate ? (
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Linking
                </Button>
              ) : null}
            </div>
          ) : isSuperAdmin ? (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[1100px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Channel link</th>
                      <th>Channel name</th>
                      <th>Revenue (90 days)</th>
                      <th>Views (90 days)</th>
                      <th>Admin</th>
                      <th className={dashboardTableHeadCellStatus}>Status</th>
                      <th>Date / time</th>
                      <th className={dashboardTableHeadCellActions}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {items.map((item) => (
                      <tr key={item._id} className={dashboardTableRowClass}>
                        <td className="px-4 py-4">
                          <a
                            href={item.channelLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-lime hover:underline"
                          >
                            View
                          </a>
                        </td>
                        <td className={dashboardTableCellPrimary}>{item.channelName}</td>
                        <td className={dashboardTableCellMuted}>
                          {formatRevenue(item.totalRevenue90Days)}
                        </td>
                        <td className={dashboardTableCellMuted}>
                          {formatViews(item.totalViews90Days)}
                        </td>
                        <td className="px-4 py-4">
                          <AdminBadge name={item.createdBy?.name} />
                        </td>
                        <td className={dashboardTableCellStatusControl}>
                          <ChannelLinkingStatusSelect
                            value={item.status}
                            disabled={statusUpdatingId !== null && statusUpdatingId !== item._id}
                            loading={statusUpdatingId === item._id}
                            onChange={(status) => void handleStatusChange(item, status)}
                            aria-label={`Update status for ${item.channelName}`}
                          />
                        </td>
                        <td className={dashboardTableCellMeta}>{formatDateTime(item.createdAt)}</td>
                        <td className={dashboardTableCellActions}>
                          <TableRowActions
                            onEdit={() => setEditItem(item)}
                            onDelete={() => setDeleteItem(item)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[980px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Channel link</th>
                      <th>Channel name</th>
                      <th>Revenue (90 days)</th>
                      <th>Views (90 days)</th>
                      <th className={dashboardTableHeadCellStatus}>Status</th>
                      <th>Date / time</th>
                      <th className={dashboardTableHeadCellActions}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {items.map((item) => (
                      <tr key={item._id} className={dashboardTableRowClass}>
                        <td className="px-4 py-4">
                          <a
                            href={item.channelLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-lime hover:underline"
                          >
                            View
                          </a>
                        </td>
                        <td className={dashboardTableCellPrimary}>{item.channelName}</td>
                        <td className={dashboardTableCellMuted}>
                          {formatRevenue(item.totalRevenue90Days)}
                        </td>
                        <td className={dashboardTableCellMuted}>
                          {formatViews(item.totalViews90Days)}
                        </td>
                        <td className={dashboardTableCellStatus}>
                          <ChannelLinkingStatusBadge status={item.status} />
                        </td>
                        <td className={dashboardTableCellMeta}>{formatDateTime(item.createdAt)}</td>
                        <td className={dashboardTableCellActions}>
                          <TableRowActions
                            canEdit={canUpdate}
                            canDelete={canDelete}
                            onEdit={() => setEditItem(item)}
                            onDelete={() => setDeleteItem(item)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <DataPagination meta={meta} onPageChange={setPage} onLimitChange={handleLimitChange} />
          {isFetching && !isLoading ? (
            <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p>
          ) : null}
        </CardContent>
      </Card>

      <CreateChannelLinkingDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditChannelLinkingDialog
        open={Boolean(editItem)}
        item={editItem}
        onClose={() => setEditItem(null)}
      />
      <DeleteChannelLinkingDialog
        open={Boolean(deleteItem)}
        item={deleteItem}
        loading={deleting}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
