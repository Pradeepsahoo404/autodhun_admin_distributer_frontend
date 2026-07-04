'use client';

import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AdminBadge } from '@/components/common/AdminBadge';
import { DataPagination } from '@/components/common/DataPagination';
import { TableRowActions } from '@/components/common/TableRowActions';
import {
  dashboardTableBodyClass,
  dashboardTableCellActions,
  dashboardTableCellMeta,
  dashboardTableCellPrimary,
  dashboardTableClass,
  dashboardTableHeadCellActions,
  dashboardTableHeadClass,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  slugBadgeClass,
} from '@/components/common/dashboardTableStyles';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/lib/formatDateTime';
import type { ReleaseCatalogItem } from '@/store/api/releaseCatalogApi';
import type { PaginatedMeta } from '@/types';

interface LabelsManageTableProps {
  items: ReleaseCatalogItem[];
  meta?: PaginatedMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
  statusUpdatingId?: string | null;
  emptyMessage: string;
  showTransfer?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onTransfer?: (label: ReleaseCatalogItem) => void;
  onEdit?: (label: ReleaseCatalogItem) => void;
  onDelete?: (label: ReleaseCatalogItem) => void;
  onStatusChange?: (label: ReleaseCatalogItem, active: boolean) => void;
}

export function LabelsManageTable({
  items,
  meta,
  onPageChange,
  onLimitChange,
  isLoading,
  statusUpdatingId,
  emptyMessage,
  showTransfer = false,
  canUpdate = false,
  canDelete = false,
  onTransfer,
  onEdit,
  onDelete,
  onStatusChange,
}: LabelsManageTableProps) {
  const showStatusColumn = Boolean(canUpdate && onStatusChange);
  const showActions = (showTransfer && onTransfer) || canUpdate || canDelete;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-lime" />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="py-10 text-center text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <>
      <div className={dashboardTableWrapperClass()}>
        <div className="overflow-x-auto">
          <table className={cn(dashboardTableClass, 'min-w-[860px]')}>
            <thead className={dashboardTableHeadClass}>
              <tr className={dashboardTableHeadRowClass}>
                <th>Label</th>
                <th>Owner</th>
                <th>Created</th>
                {showStatusColumn ? <th>Block</th> : null}
                {showActions ? <th className={dashboardTableHeadCellActions}>Actions</th> : null}
              </tr>
            </thead>
            <tbody className={dashboardTableBodyClass}>
              {items.map((label) => (
                <tr key={label._id} className={dashboardTableRowClass}>
                  <td className={dashboardTableCellPrimary}>
                    <span className={slugBadgeClass}>{label.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <AdminBadge name={label.ownedBy?.name} />
                    {label.ownedBy?.email ? (
                      <p className="mt-1 max-w-[220px] truncate text-[12px] text-neutral-600">
                        {label.ownedBy.email}
                      </p>
                    ) : null}
                  </td>
                  <td className={dashboardTableCellMeta}>{formatShortDate(label.createdAt)}</td>
                  {showStatusColumn ? (
                    <td className="px-4 py-4">
                      <div className="flex h-6 w-11 items-center justify-center">
                        {statusUpdatingId === label._id ? (
                          <Loader2
                            className="h-4 w-4 animate-spin text-brand-lime"
                            aria-label={`Updating status for ${label.name}`}
                          />
                        ) : (
                          <Switch
                            checked={label.status === 'inactive'}
                            disabled={statusUpdatingId !== null && statusUpdatingId !== label._id}
                            onCheckedChange={(checked) => onStatusChange!(label, !checked)}
                            aria-label={
                              label.status === 'inactive'
                                ? `Unblock label ${label.name}`
                                : `Block label ${label.name}`
                            }
                          />
                        )}
                      </div>
                    </td>
                  ) : null}
                  {showActions ? (
                    <td className={dashboardTableCellActions}>
                      <TableRowActions
                        canEdit={canUpdate}
                        canDelete={canDelete}
                        onEdit={onEdit ? () => onEdit(label) : undefined}
                        onDelete={onDelete ? () => onDelete(label) : undefined}
                        leadingActions={
                          showTransfer && onTransfer ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => onTransfer(label)}
                              className="h-9 rounded-lg border border-transparent px-3 text-[13px] font-medium text-neutral-400 transition-colors hover:border-brand-lime/20 hover:bg-brand-lime/10 hover:text-brand-lime"
                            >
                              <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" />
                              Transfer
                            </Button>
                          ) : undefined
                        }
                      />
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPages > 0 ? (
        <DataPagination
          meta={meta}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      ) : null}
    </>
  );
}
