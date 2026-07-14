'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/useAppStore';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE, ROLES } from '@/constants';
import {
  ISSUES_ENTRY_OWNERSHIP_FILTER_OPTIONS,
  ISSUES_ENTRY_STATUS_FILTER_OPTIONS,
  getIssuesEntryOwnershipLabel,
  getIssuesEntryStatusLabel,
} from '@/constants/issuesEntry';
import type { IssuesModulePageConfig } from '@/constants/issuesModuleConfigs';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { ExportDateRangeBar } from '@/components/common/ExportDateRangeBar';
import { AdminBadge } from '@/components/common/AdminBadge';
import { TableRowActions } from '@/components/common/TableRowActions';
import {
  dashboardTableBodyClass,
  dashboardTableCellActions,
  dashboardTableCellMeta,
  dashboardTableCellPrimary,
  dashboardTableCellStatus,
  dashboardTableClass,
  dashboardTableHeadCellActions,
  dashboardTableHeadCellStatus,
  dashboardTableHeadClass,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  isrcBadgeClass,
  legalModuleCardClass,
  legalModuleCardHeaderClass,
} from '@/components/common/dashboardTableStyles';
import { CreateIssuesEntryDialog } from '@/components/dashboard/issues-entry/CreateIssuesEntryDialog';
import { EditIssuesEntryDialog } from '@/components/dashboard/issues-entry/EditIssuesEntryDialog';
import { DeleteIssuesEntryDialog } from '@/components/dashboard/issues-entry/DeleteIssuesEntryDialog';
import { IssuesOwnershipControl } from '@/components/dashboard/issues-entry/IssuesOwnershipControl';
import { IssuesStatusToggle } from '@/components/dashboard/issues-entry/IssuesStatusToggle';
import { formatDateTime } from '@/lib/formatDateTime';
import { useLegalEntryHighlight, legalEntryRowClass } from '@/hooks/useLegalEntryHighlight';
import { cn } from '@/lib/utils';
import type { IssuesAssignedEntry, PaginatedMeta } from '@/types';
import { isElevatedRole } from '@/utils/roles';

const DEFAULT_PAGE_LIMIT = 10;

interface IssuesAssignedEntryPageProps {
  config: IssuesModulePageConfig;
}

export function IssuesAssignedEntryPage({ config }: IssuesAssignedEntryPageProps) {
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const isSuperAdmin = isElevatedRole(currentUser?.role);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [ownershipUpdatingId, setOwnershipUpdatingId] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<IssuesAssignedEntry | null>(null);
  const [deleteItem, setDeleteItem] = useState<IssuesAssignedEntry | null>(null);
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
      ...(ownershipFilter !== 'all' ? { ownership: ownershipFilter } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [page, limit, search, statusFilter, ownershipFilter, dateFrom, dateTo],
  );

  const { data, isLoading, isFetching } = config.useGetQuery(queryParams);
  const [updateStatus] = config.useUpdateStatusMutation();
  const [updateOwnership] = config.useUpdateOwnershipMutation();
  const [deleteEntry, { isLoading: deleting }] = config.useDeleteMutation();
  const [exportCsv, { isLoading: exporting }] = config.useExportMutation();

  const items = data?.data ?? [];
  const meta = data?.meta as PaginatedMeta | undefined;

  const handleStatusToggle = async (item: IssuesAssignedEntry, active: boolean) => {
    setStatusUpdatingId(item._id);
    try {
      await updateStatus({
        id: item._id,
        body: { status: active ? 'active' : 'inactive' },
      }).unwrap();
      toast.success(`Status updated to ${active ? 'Active' : 'Deactive'}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleOwnershipChange = async (item: IssuesAssignedEntry, ownership: 'yes' | 'no') => {
    setOwnershipUpdatingId(item._id);
    try {
      await updateOwnership({ id: item._id, body: { ownership } }).unwrap();
      toast.success(`Ownership updated to ${getIssuesEntryOwnershipLabel(ownership)}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setOwnershipUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await deleteEntry(deleteItem._id).unwrap();
      toast.success(config.deleteSuccessMessage);
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
      link.download = `${config.exportFilePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const renderOwnershipCell = (item: IssuesAssignedEntry, readOnly = false) => {
    if (readOnly) {
      return (
        <span className="text-sm text-neutral-400">
          {getIssuesEntryOwnershipLabel(item.ownership)}
        </span>
      );
    }

    return (
      <IssuesOwnershipControl
        value={item.ownership}
        loading={ownershipUpdatingId === item._id}
        disabled={ownershipUpdatingId !== null && ownershipUpdatingId !== item._id}
        onChange={(ownership) => void handleOwnershipChange(item, ownership)}
      />
    );
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title={config.title}
        description={isSuperAdmin ? config.superAdminDescription : config.adminDescription}
        action={
          isSuperAdmin ? (
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              {config.addButtonLabel}
            </Button>
          ) : undefined
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <CardTitle className="text-white">
              {isSuperAdmin ? config.listTitleSuperAdmin : config.listTitleAdmin}
            </CardTitle>
            <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:items-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <TableSearchField
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="Search party, asset, ISRC, label..."
                />
                <TableSelectField
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                  options={[...ISSUES_ENTRY_STATUS_FILTER_OPTIONS]}
                  aria-label="Filter by status"
                />
                <TableSelectField
                  value={ownershipFilter}
                  onChange={(value) => {
                    setOwnershipFilter(value);
                    setPage(1);
                  }}
                  options={[...ISSUES_ENTRY_OWNERSHIP_FILTER_OPTIONS]}
                  aria-label="Filter by ownership"
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
            <p className="py-10 text-center text-neutral-500">{config.loadingMessage}</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-neutral-500">
                {isSuperAdmin ? config.emptySuperAdmin : config.emptyAdmin}
              </p>
              {isSuperAdmin ? (
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {config.addButtonLabel}
                </Button>
              ) : null}
            </div>
          ) : (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[1200px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Other party</th>
                      <th>Asset name</th>
                      <th>Asset type</th>
                      <th>ISRC</th>
                      <th>Overlapping asset</th>
                      <th>Label</th>
                      {isSuperAdmin ? <th>Admin</th> : null}
                      <th className={dashboardTableHeadCellStatus}>Status</th>
                      <th>Ownership</th>
                      <th>Date / time</th>
                      {isSuperAdmin ? <th className={dashboardTableHeadCellActions}>Actions</th> : null}
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className={legalEntryRowClass(dashboardTableRowClass, item._id, highlightId)}
                      >
                        <td className={dashboardTableCellPrimary}>{item.otherParty}</td>
                        <td className="px-4 py-4 text-neutral-300">{item.assetName}</td>
                        <td className="px-4 py-4 text-neutral-400">{item.assetType}</td>
                        <td className="px-4 py-4">
                          <span className={isrcBadgeClass}>{item.isrcCode}</span>
                        </td>
                        <td className="px-4 py-4 text-neutral-300">{item.overlappingAssetName}</td>
                        <td className="px-4 py-4 text-neutral-300">{item.labelName}</td>
                        {isSuperAdmin ? (
                          <td className="px-4 py-4">
                            <AdminBadge name={item.assignedTo?.name} />
                          </td>
                        ) : null}
                        <td className={dashboardTableCellStatus}>
                          {isSuperAdmin ? (
                            <IssuesStatusToggle
                              checked={item.status === 'active'}
                              loading={statusUpdatingId === item._id}
                              disabled={statusUpdatingId !== null && statusUpdatingId !== item._id}
                              statusLabel={getIssuesEntryStatusLabel(item.status)}
                              onCheckedChange={(checked) => void handleStatusToggle(item, checked)}
                              ariaLabel={`Toggle status for ${item.assetName}`}
                            />
                          ) : (
                            <span
                              className={cn(
                                'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
                                item.status === 'active'
                                  ? 'border-green-500/25 bg-green-500/10 text-green-400'
                                  : 'border-neutral-600/30 bg-neutral-500/10 text-neutral-400',
                              )}
                            >
                              {getIssuesEntryStatusLabel(item.status)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">{renderOwnershipCell(item, isSuperAdmin)}</td>
                        <td className={dashboardTableCellMeta}>{formatDateTime(item.createdAt)}</td>
                        {isSuperAdmin ? (
                          <td className={dashboardTableCellActions}>
                            <TableRowActions
                              onEdit={() => setEditItem(item)}
                              onDelete={() => setDeleteItem(item)}
                            />
                          </td>
                        ) : null}
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
            onLimitChange={(nextLimit) => {
              setLimit(nextLimit);
              setPage(1);
            }}
            className="mt-5"
          />
          {isFetching && !isLoading ? (
            <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p>
          ) : null}
        </CardContent>
      </Card>

      {isSuperAdmin ? (
        <>
          <CreateIssuesEntryDialog
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            title={config.createDialogTitle}
            successMessage={config.createSuccessMessage}
            formId={config.createFormId}
            useCreateMutation={config.useCreateMutation}
          />
          <EditIssuesEntryDialog
            open={Boolean(editItem)}
            item={editItem}
            onClose={() => setEditItem(null)}
            title={config.editDialogTitle}
            successMessage={config.editSuccessMessage}
            formId={config.editFormId}
            useUpdateMutation={config.useUpdateMutation}
          />
          <DeleteIssuesEntryDialog
            open={Boolean(deleteItem)}
            item={deleteItem}
            loading={deleting}
            title={config.deleteDialogTitle}
            message={config.deleteDialogMessage}
            onClose={() => setDeleteItem(null)}
            onConfirm={() => void handleDeleteConfirm()}
          />
        </>
      ) : null}
    </div>
  );
}
