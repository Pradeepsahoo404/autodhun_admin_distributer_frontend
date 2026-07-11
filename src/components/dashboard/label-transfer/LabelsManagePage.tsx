'use client';

import { useEffect, useMemo, useState } from 'react';
import { Ban, Loader2, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TransferLabelDialog } from '@/components/dashboard/label-transfer/TransferLabelDialog';
import { EditLabelDialog } from '@/components/dashboard/label-transfer/EditLabelDialog';
import { DeleteLabelDialog } from '@/components/dashboard/label-transfer/DeleteLabelDialog';
import { LabelsManageTable } from '@/components/dashboard/label-transfer/LabelsManageTable';
import {
  useGetLabelTransferOverviewQuery,
  useGetManagedLabelsQuery,
  useUpdateReleaseLabelStatusMutation,
} from '@/store/api';
import { usePermission } from '@/hooks/usePermission';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE } from '@/constants';
import { legalModuleCardClass, legalModuleCardHeaderClass } from '@/components/common/dashboardTableStyles';
import type { LabelStatus, ReleaseCatalogItem } from '@/store/api/releaseCatalogApi';

const DEFAULT_PAGE_LIMIT = 10;

interface LabelsManagePageProps {
  status: LabelStatus;
  permissionModule: 'label-transfer' | 'label-block';
  title: string;
  description: string;
  tableTitle: string;
  tableIcon?: 'tag' | 'ban';
  emptyMessage: string;
  showTransfer?: boolean;
  /** When true, omit outer page wrapper (used inside LabelTransferPage). */
  embedded?: boolean;
}

export function LabelsManagePage({
  status,
  permissionModule,
  title,
  description,
  tableTitle,
  tableIcon = 'tag',
  emptyMessage,
  showTransfer = false,
  embedded = false,
}: LabelsManagePageProps) {
  const { canCreate, canUpdate, canDelete } = usePermission(permissionModule);
  const isActiveList = status === 'active';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const [transferOpen, setTransferOpen] = useState(false);
  const [editLabel, setEditLabel] = useState<ReleaseCatalogItem | null>(null);
  const [deleteLabel, setDeleteLabel] = useState<ReleaseCatalogItem | null>(null);
  const [selectedTransferLabel, setSelectedTransferLabel] = useState<{
    id: string;
    name: string;
    fromAdminId: string;
    fromAdminName: string;
  } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      status,
      page,
      limit,
      ...(search ? { search } : {}),
    }),
    [status, page, limit, search],
  );

  const { data, isLoading, isFetching, refetch } = useGetManagedLabelsQuery(queryParams);
  const { data: overviewData } = useGetLabelTransferOverviewQuery(undefined, {
    skip: !showTransfer,
  });
  const [updateStatus] = useUpdateReleaseLabelStatusMutation();

  const items = data?.data?.items ?? [];
  const meta = data?.data;
  const admins = overviewData?.data?.admins ?? [];
  const isListLoading = isLoading || isFetching;

  const TableIcon = tableIcon === 'ban' ? Ban : Tag;

  const handleStatusChange = async (label: ReleaseCatalogItem, active: boolean) => {
    setStatusUpdatingId(label._id);
    try {
      await updateStatus({
        id: label._id,
        status: active ? 'active' : 'inactive',
      }).unwrap();
      toast.success(active ? 'Label activated' : 'Label blocked');
      void refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const openTransfer = (label: ReleaseCatalogItem) => {
    setSelectedTransferLabel({
      id: label._id,
      name: label.name,
      fromAdminId: label.ownedBy?._id ?? '',
      fromAdminName: label.ownedBy?.name ?? 'Unknown',
    });
    setTransferOpen(true);
  };

  return (
    <div className={embedded ? undefined : DASHBOARD_PAGE}>
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          showTransfer && canCreate ? (
            <Button
              type="button"
              onClick={() => {
                setSelectedTransferLabel(null);
                setTransferOpen(true);
              }}
              className="h-11 rounded-xl bg-brand-lime px-5 text-black hover:bg-brand-lime-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Transfer Label
            </Button>
          ) : null
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-lime/20 bg-brand-lime/10">
                <TableIcon className="h-4 w-4 text-brand-lime" />
              </div>
              <div>
                <CardTitle className="text-white">{tableTitle}</CardTitle>
                <p className="mt-1 text-[13px] text-neutral-500">
                  {isListLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      {meta?.total ?? 0} {meta?.total === 1 ? 'label' : 'labels'}
                      {isActiveList ? ' available for use' : ' blocked from use'}
                    </>
                  )}
                </p>
              </div>
            </div>
            <TableSearchField
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search label or owner..."
            />
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <LabelsManageTable
            items={items}
            meta={meta}
            onPageChange={setPage}
            onLimitChange={(nextLimit) => {
              setLimit(nextLimit);
              setPage(1);
            }}
            isLoading={isListLoading}
            statusUpdatingId={statusUpdatingId}
            emptyMessage={search ? 'No labels match your search.' : emptyMessage}
            showTransfer={showTransfer && canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onTransfer={openTransfer}
            onEdit={canUpdate ? setEditLabel : undefined}
            onDelete={canDelete ? setDeleteLabel : undefined}
            onStatusChange={canUpdate ? handleStatusChange : undefined}
          />
        </CardContent>
      </Card>

      {showTransfer ? (
        <TransferLabelDialog
          open={transferOpen}
          onClose={() => {
            setTransferOpen(false);
            setSelectedTransferLabel(null);
          }}
          initialLabel={selectedTransferLabel}
          admins={admins}
          onSuccess={() => toast.success('Label transferred successfully')}
        />
      ) : null}

      <EditLabelDialog
        open={Boolean(editLabel)}
        label={editLabel}
        onClose={() => setEditLabel(null)}
        onSuccess={() => {
          toast.success('Label updated');
          void refetch();
        }}
      />

      <DeleteLabelDialog
        open={Boolean(deleteLabel)}
        label={deleteLabel}
        onClose={() => setDeleteLabel(null)}
        onSuccess={() => {
          toast.success('Label deleted');
          void refetch();
        }}
      />
    </div>
  );
}
