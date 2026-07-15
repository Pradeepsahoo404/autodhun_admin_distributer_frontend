'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useBulkUpdateMusicReleaseStatusMutation,
  useDeleteMusicReleaseMutation,
  useExportMusicReleasesMutation,
  useGetMusicReleasesQuery,
  useUpdateMusicReleaseStatusMutation,
} from '@/store/api';
import { ExportDateRangeBar } from '@/components/common/ExportDateRangeBar';
import { useAppSelector } from '@/hooks/useAppStore';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE, isElevatedRole } from '@/constants';
import {
  ASSETS_OVERVIEW_STATUS_FILTER_OPTIONS,
  ASSETS_OVERVIEW_STATUS_SELECT_OPTIONS,
  ASSETS_STATUS_FILTER_OPTIONS,
  CONTENT_DELIVERY_STATUS_FILTER_OPTIONS,
  CONTENT_DELIVERY_STATUS_SELECT_OPTIONS,
  MUSIC_RELEASE_LIST_CONTEXT,
  MUSIC_RELEASE_STATUS,
  type MusicReleaseListContext,
  type MusicReleaseStatus,
} from '@/constants/musicReleaseStatus';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { AdminBadge } from '@/components/common/AdminBadge';
import { IsrcBadge } from '@/components/common/IsrcBadge';
import { TableRowActions } from '@/components/common/TableRowActions';
import { ReleaseBulkStatusBar } from '@/components/dashboard/music-releases/ReleaseBulkStatusBar';
import { ReleaseListTrackPlay } from '@/components/dashboard/music-releases/ReleaseListTrackPlay';
import { ReleaseStatusBadge } from '@/components/dashboard/music-releases/ReleaseStatusBadge';
import { ReleaseStatusSelect } from '@/components/dashboard/music-releases/ReleaseStatusSelect';
import { CorrectionReasonDialog } from '@/components/dashboard/music-releases/CorrectionReasonDialog';
import { BulkImportDialog } from '@/components/dashboard/music-releases/BulkImportDialog';
import { DeleteReleaseDialog } from '@/components/dashboard/music-releases/DeleteReleaseDialog';
import { ViewReleaseDialog } from '@/components/dashboard/music-releases/ViewReleaseDialog';
import {
  dashboardTableBodyClass,
  dashboardTableCellActions,
  dashboardTableCellMeta,
  dashboardTableCellMuted,
  dashboardTableCellPrimary,
  dashboardTableCellStatusControl,
  dashboardTableClass,
  dashboardTableHeadCellActions,
  dashboardTableHeadClass,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  legalModuleCardClass,
  legalModuleCardHeaderClass,
} from '@/components/common/dashboardTableStyles';
import { formatDisplayDate, parseApiDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { resolveReleaseMediaUrl } from '@/features/create-release/mapReleaseToFormData';
import {
  canAdminEditRelease,
  canAdminDeleteRelease,
  formatReleaseIsrcDisplay,
  getPrimaryIsrcCode,
  truncateReleaseTitle,
} from '@/features/create-release/releaseListUtils';
import type { MusicRelease, PaginatedMeta } from '@/types';

import { TableCheckbox } from '@/components/common/TableCheckbox';
import { useLegalEntryHighlight, legalEntryRowClass } from '@/hooks/useLegalEntryHighlight';

const PAGE_CONFIG: Record<
  MusicReleaseListContext,
  {
    title: string;
    description: string;
    emptyMessage: string;
    showAdmin: boolean;
    showStatusControl: boolean;
    showActions: boolean;
    showStatusFilter: boolean;
  }
> = {
  assets: {
    title: 'Assets',
    description: 'Your submitted releases and their current status.',
    emptyMessage: 'No releases yet. Create your first release to see it here.',
    showAdmin: false,
    showStatusControl: false,
    showActions: true,
    showStatusFilter: true,
  },
  'assets-overview': {
    title: 'Overview',
    description: 'Approved and live releases across all admins.',
    emptyMessage: 'No approved or live releases yet.',
    showAdmin: true,
    showStatusControl: true,
    showActions: false,
    showStatusFilter: true,
  },
  correction: {
    title: 'Correction',
    description: 'Releases sent back for correction — update and resubmit when ready.',
    emptyMessage: 'No releases in correction.',
    showAdmin: false,
    showStatusControl: false,
    showActions: true,
    showStatusFilter: false,
  },
  'content-delivery': {
    title: 'Content Delivery',
    description: 'Review releases awaiting approval. QC Approval and Live move to Assets overview.',
    emptyMessage: 'No releases awaiting review.',
    showAdmin: true,
    showStatusControl: true,
    showActions: false,
    showStatusFilter: true,
  },
};

const DEFAULT_PAGE_LIMIT = 10;

interface MusicReleasesListPageProps {
  context: MusicReleaseListContext;
}

function getStatusFilterOptions(context: MusicReleaseListContext) {
  if (context === MUSIC_RELEASE_LIST_CONTEXT.CONTENT_DELIVERY) {
    return CONTENT_DELIVERY_STATUS_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  }
  if (context === MUSIC_RELEASE_LIST_CONTEXT.ASSETS_OVERVIEW) {
    return ASSETS_OVERVIEW_STATUS_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  }
  if (context === MUSIC_RELEASE_LIST_CONTEXT.ASSETS) {
    return ASSETS_STATUS_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  }
  return [];
}

function getStatusSelectOptions(context: MusicReleaseListContext) {
  if (context === MUSIC_RELEASE_LIST_CONTEXT.CONTENT_DELIVERY) {
    return CONTENT_DELIVERY_STATUS_SELECT_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  }
  if (context === MUSIC_RELEASE_LIST_CONTEXT.ASSETS_OVERVIEW) {
    return ASSETS_OVERVIEW_STATUS_SELECT_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  }
  return undefined;
}

function getDefaultBulkStatus(context: MusicReleaseListContext): MusicReleaseStatus {
  if (context === MUSIC_RELEASE_LIST_CONTEXT.ASSETS_OVERVIEW) {
    return MUSIC_RELEASE_STATUS.LIVE;
  }
  return MUSIC_RELEASE_STATUS.QC_APPROVAL;
}

export function MusicReleasesListPage({ context }: MusicReleasesListPageProps) {
  const config = PAGE_CONFIG[context];
  const router = useRouter();
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const canControlStatus = isElevatedRole(currentUser?.role);
  const showBulkSelect = config.showStatusControl && canControlStatus;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<MusicReleaseStatus>(() => getDefaultBulkStatus(context));
  const [isBulkApplying, setIsBulkApplying] = useState(false);
  const [viewRelease, setViewRelease] = useState<MusicRelease | null>(null);
  const [correctionDialog, setCorrectionDialog] = useState<{
    mode: 'single' | 'bulk';
    release?: MusicRelease;
  } | null>(null);
  const [isCorrectionSubmitting, setIsCorrectionSubmitting] = useState(false);
  const [deleteRelease, setDeleteRelease] = useState<MusicRelease | null>(null);
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

  useEffect(() => {
    setSelectedIds(new Set());
    setBulkStatus(getDefaultBulkStatus(context));
  }, [page, search, statusFilter, context, dateFrom, dateTo]);

  const queryParams = useMemo(
    () => ({
      context,
      page,
      limit,
      ...(search ? { search } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter as MusicReleaseStatus } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [context, page, limit, search, statusFilter, dateFrom, dateTo],
  );

  const queryKey = useMemo(() => JSON.stringify(queryParams), [queryParams]);

  const { data, isLoading, isFetching } = useGetMusicReleasesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [updateStatus] = useUpdateMusicReleaseStatusMutation();
  const [deleteReleaseMutation, { isLoading: isDeleting }] = useDeleteMusicReleaseMutation();
  const [bulkUpdateStatus] = useBulkUpdateMusicReleaseStatusMutation();
  const [exportCsv, { isLoading: exporting }] = useExportMusicReleasesMutation();

  const [settledQueryKey, setSettledQueryKey] = useState(queryKey);

  useEffect(() => {
    if (!isFetching) setSettledQueryKey(queryKey);
  }, [isFetching, queryKey]);

  const isListSettled = settledQueryKey === queryKey;
  const isListLoading = isLoading || !isListSettled;

  const items = data?.data ?? [];
  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return items;
    return items.filter((item) => item.status === statusFilter);
  }, [items, statusFilter]);

  const meta = data?.meta as PaginatedMeta | undefined;
  const statusFilterOptions = getStatusFilterOptions(context);
  const statusSelectOptions = getStatusSelectOptions(context) ?? [];

  const showActionsColumn =
    config.showActions &&
    filteredItems.some(
      (item) =>
        canAdminEditRelease(item, currentUser?.id) ||
        canAdminDeleteRelease(item, currentUser?.id),
    );

  const showDeleteAction = context === MUSIC_RELEASE_LIST_CONTEXT.CORRECTION;

  const allPageSelected =
    filteredItems.length > 0 && filteredItems.every((item) => selectedIds.has(item._id));

  const handleStatusChange = async (
    item: MusicRelease,
    status: MusicReleaseStatus,
    correctionReasons?: string[],
  ) => {
    if (status === item.status && !correctionReasons) return;

    if (
      status === MUSIC_RELEASE_STATUS.CORRECTION &&
      item.status !== MUSIC_RELEASE_STATUS.CORRECTION &&
      !correctionReasons
    ) {
      setCorrectionDialog({ mode: 'single', release: item });
      return;
    }

    setStatusUpdatingId(item._id);
    try {
      await updateStatus({
        id: item._id,
        status,
        ...(correctionReasons?.length ? { correctionReasons } : {}),
      }).unwrap();
      toast.success('Release status updated');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleBulkApply = async (correctionReasons?: string[]) => {
    if (selectedIds.size === 0) return;

    if (bulkStatus === MUSIC_RELEASE_STATUS.CORRECTION && !correctionReasons) {
      setCorrectionDialog({ mode: 'bulk' });
      return;
    }

    setIsBulkApplying(true);
    try {
      const result = await bulkUpdateStatus({
        ids: Array.from(selectedIds),
        status: bulkStatus,
        ...(correctionReasons?.length ? { correctionReasons } : {}),
      }).unwrap();
      const updated = result.data?.updated ?? selectedIds.size;
      toast.success(`${updated} release(s) updated`);
      setSelectedIds(new Set());
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsBulkApplying(false);
    }
  };

  const handleCorrectionConfirm = async (reasons: string[]) => {
    if (!correctionDialog) return;

    setIsCorrectionSubmitting(true);
    try {
      if (correctionDialog.mode === 'single' && correctionDialog.release) {
        await handleStatusChange(correctionDialog.release, MUSIC_RELEASE_STATUS.CORRECTION, reasons);
      } else {
        await handleBulkApply(reasons);
      }
      setCorrectionDialog(null);
    } finally {
      setIsCorrectionSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRelease) return;

    try {
      await deleteReleaseMutation(deleteRelease._id).unwrap();
      toast.success('Release deleted');
      setDeleteRelease(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(filteredItems.map((item) => item._id)));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExport = async () => {
    try {
      const blob = await exportCsv({
        context,
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
      }).unwrap();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `music-releases-${context}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const formatReleaseDate = (value: string) => {
    const parsed = parseApiDate(value);
    return parsed ? formatDisplayDate(parsed) : value;
  };

  const tableEmptyMessage =
    !isListLoading && items.length > 0 && filteredItems.length === 0 && statusFilter !== 'all'
      ? 'No releases match the selected status.'
      : config.emptyMessage;

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title={config.title}
        description={config.description}
        action={
          context === MUSIC_RELEASE_LIST_CONTEXT.ASSETS ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setImportOpen(true)}
                className="rounded-xl border border-[#2a2a2a] text-neutral-200 hover:text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Release
              </Button>
              <Button
                asChild
                className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
              >
                <Link href="/dashboard/release/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Release
                </Link>
              </Button>
            </div>
          ) : undefined
        }
      />

      {context === MUSIC_RELEASE_LIST_CONTEXT.ASSETS ? (
        <BulkImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
      ) : null}

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-white">Releases</CardTitle>
            <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:items-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <TableSearchField
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="Search title, artist, label, UPC..."
                />
                {config.showStatusFilter ? (
                  <TableSelectField
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    options={statusFilterOptions}
                    aria-label="Filter by status"
                  />
                ) : null}
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
          {showBulkSelect ? (
            <ReleaseBulkStatusBar
              selectedCount={selectedIds.size}
              status={bulkStatus}
              statusOptions={statusSelectOptions}
              isApplying={isBulkApplying}
              onStatusChange={setBulkStatus}
              onApply={() => void handleBulkApply()}
              onClear={() => setSelectedIds(new Set())}
            />
          ) : null}

          {isListLoading ? (
            <p className="py-10 text-center text-neutral-500">Loading releases...</p>
          ) : filteredItems.length === 0 ? (
            <p className="py-10 text-center text-neutral-500">{tableEmptyMessage}</p>
          ) : (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[980px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      {showBulkSelect ? (
                        <th className="w-10 px-4">
                          <TableCheckbox
                            checked={allPageSelected}
                            onChange={toggleSelectAll}
                            aria-label="Select all releases on this page"
                          />
                        </th>
                      ) : null}
                      <th>Release</th>
                      <th>Artist / Label</th>
                      <th>Release Date</th>
                      <th>Track</th>
                      <th>ISRC</th>
                      <th>Status</th>
                      {config.showAdmin ? <th>Submitted By</th> : null}
                      {showActionsColumn ? (
                        <th className={dashboardTableHeadCellActions}>Actions</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {filteredItems.map((item: MusicRelease) => {
                      const primaryIsrc = getPrimaryIsrcCode(item);
                      const isrcDisplay = formatReleaseIsrcDisplay(item);
                      const canEdit = canAdminEditRelease(item, currentUser?.id);
                      const canDelete = showDeleteAction && canAdminDeleteRelease(item, currentUser?.id);
                      const firstAudio = item.audioFiles[0];
                      const audioUrl = firstAudio ? resolveReleaseMediaUrl(firstAudio.url) : undefined;
                      const trackTitle = item.tracks[0]?.title || item.title;

                      return (
                        <tr
                          key={item._id}
                          className={legalEntryRowClass(dashboardTableRowClass, item._id, highlightId)}
                        >
                          {showBulkSelect ? (
                            <td className="px-4 py-4">
                              <TableCheckbox
                                checked={selectedIds.has(item._id)}
                                onChange={() => toggleSelectRow(item._id)}
                                aria-label={`Select ${item.title}`}
                              />
                            </td>
                          ) : null}
                          <td className={dashboardTableCellPrimary}>
                            <button
                              type="button"
                              onClick={() => setViewRelease(item)}
                              className="group flex w-full min-w-0 items-center gap-3 text-left"
                              aria-label={`View release ${item.title}`}
                            >
                              {item.coverArtUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={resolveReleaseMediaUrl(item.coverArtUrl)}
                                  alt=""
                                  className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-[#222] transition group-hover:ring-brand-lime/40"
                                />
                              ) : null}
                              <div className="min-w-0 max-w-[160px]">
                                <p
                                  className="font-medium text-white transition-colors group-hover:text-brand-lime"
                                  title={item.title}
                                >
                                  {truncateReleaseTitle(item.title)}
                                </p>
                                {item.version ? (
                                  <p className="truncate text-[12px] text-neutral-500" title={item.version}>
                                    {truncateReleaseTitle(item.version, 18)}
                                  </p>
                                ) : null}
                              </div>
                            </button>
                          </td>
                          <td className={dashboardTableCellMuted}>
                            <p className="max-w-[140px] truncate" title={item.artist}>
                              {item.artist}
                            </p>
                            <p className="max-w-[140px] truncate text-[12px] text-neutral-600" title={item.label}>
                              {item.label}
                            </p>
                          </td>
                          <td className={dashboardTableCellMeta}>{formatReleaseDate(item.releasingDate)}</td>
                          <td className={dashboardTableCellMeta}>
                            <ReleaseListTrackPlay audioUrl={audioUrl} trackTitle={trackTitle} />
                          </td>
                          <td className={dashboardTableCellMeta}>
                            {primaryIsrc ? (
                              <IsrcBadge value={primaryIsrc} />
                            ) : (
                              <span className="text-[12px] text-neutral-500">{isrcDisplay}</span>
                            )}
                          </td>
                          <td className={dashboardTableCellStatusControl}>
                            {config.showStatusControl && canControlStatus ? (
                              <ReleaseStatusSelect
                                value={item.status}
                                onChange={(status) => handleStatusChange(item, status)}
                                disabled={statusUpdatingId === item._id}
                                className="min-w-[150px]"
                                options={statusSelectOptions}
                              />
                            ) : (
                              <ReleaseStatusBadge status={item.status} />
                            )}
                          </td>
                          {config.showAdmin ? (
                            <td className={dashboardTableCellMuted}>
                              <AdminBadge name={item.createdBy?.name} />
                            </td>
                          ) : null}
                          {showActionsColumn && (canEdit || canDelete) ? (
                            <td className={dashboardTableCellActions}>
                              <TableRowActions
                                canView={false}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                onEdit={
                                  canEdit
                                    ? () => router.push(`/dashboard/release/edit/${item._id}`)
                                    : undefined
                                }
                                onDelete={canDelete ? () => setDeleteRelease(item) : undefined}
                              />
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}
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
          {isFetching && !isListLoading ? (
            <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p>
          ) : null}
        </CardContent>
      </Card>

      <ViewReleaseDialog
        open={Boolean(viewRelease)}
        releaseId={viewRelease?._id ?? null}
        preview={viewRelease}
        showSubmittedBy={config.showAdmin}
        onClose={() => setViewRelease(null)}
      />

      <CorrectionReasonDialog
        open={Boolean(correctionDialog)}
        releaseTitle={correctionDialog?.release?.title}
        selectedCount={correctionDialog?.mode === 'bulk' ? selectedIds.size : 1}
        isLoading={isCorrectionSubmitting || isBulkApplying}
        onClose={() => setCorrectionDialog(null)}
        onConfirm={handleCorrectionConfirm}
      />

      <DeleteReleaseDialog
        open={Boolean(deleteRelease)}
        release={deleteRelease}
        loading={isDeleting}
        onClose={() => setDeleteRelease(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
