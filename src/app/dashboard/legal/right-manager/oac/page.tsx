'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useDeleteOacEntryMutation,
  useExportOacEntriesMutation,
  useGetOacEntriesQuery,
  useUpdateOacEntryStatusMutation,
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
import { StatusBadge } from '@/components/common/StatusBadge';
import { IsrcBadge } from '@/components/common/IsrcBadge';
import { AdminBadge } from '@/components/common/AdminBadge';
import { TableRowActions } from '@/components/common/TableRowActions';
import { LegalModuleStatusSelect } from '@/components/common/LegalModuleStatusSelect';
import {
  LEGAL_MODULE_STATUS_FILTER_OPTIONS,
  type LegalModuleStatusFilter,
} from '@/constants/legalModuleStatus';
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
import { CreateOacDialog } from '@/components/dashboard/oac/CreateOacDialog';
import { EditOacDialog } from '@/components/dashboard/oac/EditOacDialog';
import { DeleteOacDialog } from '@/components/dashboard/oac/DeleteOacDialog';
import { OacLinkCell } from '@/components/dashboard/oac/OacLinkCell';
import { formatDateTime } from '@/lib/formatDateTime';
import { useLegalEntryHighlight, legalEntryRowClass } from '@/hooks/useLegalEntryHighlight';
import { cn } from '@/lib/utils';
import type { Oac, PaginatedMeta } from '@/types';
import { isElevatedRole } from '@/utils/roles';

const DEFAULT_PAGE_LIMIT = 10;

export default function OacPage() {
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const isSuperAdmin = isElevatedRole(currentUser?.role);
  const { canCreate, canUpdate, canDelete } = usePermission('oac');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LegalModuleStatusFilter>('all');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Oac | null>(null);
  const [deleteItem, setDeleteItem] = useState<Oac | null>(null);
  const highlightId = useLegalEntryHighlight();

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

  const { data, isLoading, isFetching } = useGetOacEntriesQuery(queryParams);
  const [updateStatus] = useUpdateOacEntryStatusMutation();
  const [deleteEntry, { isLoading: deleting }] = useDeleteOacEntryMutation();
  const [exportCsv, { isLoading: exporting }] = useExportOacEntriesMutation();

  const items = data?.data ?? [];
  const meta = data?.meta as PaginatedMeta | undefined;

  const handleStatusChange = async (item: Oac, status: 'active' | 'inactive') => {
    setStatusUpdatingId(item._id);
    try {
      await updateStatus({ id: item._id, body: { status } }).unwrap();
      toast.success(`Status updated to ${status === 'active' ? 'Active' : 'Deactive'}`);
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
      toast.success('OAC entry deleted');
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
      link.download = `oac-${new Date().toISOString().slice(0, 10)}.csv`;
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
        title="OAC"
        description={
          isSuperAdmin
            ? 'Review all official artist channel entries, manage in-progress entries, and activate or deactivate them'
            : 'Create and manage your official artist channel requests'
        }
        action={
          !isSuperAdmin && canCreate ? (
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add OAC
            </Button>
          ) : undefined
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <CardTitle className="text-white">
              {isSuperAdmin ? 'All OAC entries' : 'My OAC entries'}
            </CardTitle>
            <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:items-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <TableSearchField
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="Search channel, ISRC, link..."
                />
                <TableSelectField
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value as LegalModuleStatusFilter);
                    setPage(1);
                  }}
                  options={[...LEGAL_MODULE_STATUS_FILTER_OPTIONS]}
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
            <p className="py-10 text-center text-neutral-500">Loading OAC entries...</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-neutral-500">
                {isSuperAdmin ? 'No OAC entries found.' : 'You have not created any OAC entries yet.'}
              </p>
              {!isSuperAdmin && canCreate ? (
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add OAC
                </Button>
              ) : null}
            </div>
          ) : isSuperAdmin ? (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[1100px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Artist channel name</th>
                      <th>Artist channel link</th>
                      <th>Artist channel topic link</th>
                      <th>ISRC code</th>
                      <th>Admin</th>
                      <th className={dashboardTableHeadCellStatus}>Status</th>
                      <th>Date / time</th>
                      <th className={dashboardTableHeadCellActions}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {items.map((item) => (
                        <tr key={item._id} className={legalEntryRowClass(dashboardTableRowClass, item._id, highlightId)}>
                          <td className={dashboardTableCellPrimary}>{item.artistChannelName}</td>
                          <td className="px-4 py-4">
                            <OacLinkCell href={item.artistChannelLink} />
                          </td>
                          <td className="px-4 py-4">
                            <OacLinkCell href={item.artistChannelTopicLink} />
                          </td>
                          <td className="px-4 py-4">
                            <IsrcBadge value={item.isrcCode} />
                          </td>
                          <td className="px-4 py-4">
                            <AdminBadge name={item.createdBy?.name} />
                          </td>
                          <td className={dashboardTableCellStatusControl}>
                            <LegalModuleStatusSelect
                              value={item.status}
                              disabled={statusUpdatingId !== null && statusUpdatingId !== item._id}
                              loading={statusUpdatingId === item._id}
                              onChange={(status) => void handleStatusChange(item, status)}
                              aria-label={`Update status for ${item.isrcCode}`}
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
                <table className={cn(dashboardTableClass, 'min-w-[900px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Artist channel name</th>
                      <th>Artist channel link</th>
                      <th>Artist channel topic link</th>
                      <th>ISRC code</th>
                      <th className={dashboardTableHeadCellStatus}>Status</th>
                      <th>Date / time</th>
                      <th className={dashboardTableHeadCellActions}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {items.map((item) => (
                      <tr key={item._id} className={legalEntryRowClass(dashboardTableRowClass, item._id, highlightId)}>
                        <td className={dashboardTableCellPrimary}>{item.artistChannelName}</td>
                        <td className="px-4 py-4">
                          <OacLinkCell href={item.artistChannelLink} />
                        </td>
                        <td className="px-4 py-4">
                          <OacLinkCell href={item.artistChannelTopicLink} />
                        </td>
                        <td className="px-4 py-4">
                          <IsrcBadge value={item.isrcCode} />
                        </td>
                        <td className={dashboardTableCellStatus}>
                          <StatusBadge status={item.status} />
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

          <DataPagination
            meta={meta}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
          {isFetching && !isLoading ? (
            <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p>
          ) : null}
        </CardContent>
      </Card>

      <CreateOacDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditOacDialog open={Boolean(editItem)} item={editItem} onClose={() => setEditItem(null)} />
      <DeleteOacDialog
        open={Boolean(deleteItem)}
        item={deleteItem}
        loading={deleting}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
