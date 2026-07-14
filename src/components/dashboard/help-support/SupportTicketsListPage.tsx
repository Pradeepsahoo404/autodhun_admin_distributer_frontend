'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/apiClient';
import { TableSearchField } from '@/components/common/TableSearchField';
import { DataPagination } from '@/components/common/DataPagination';
import { AdminBadge } from '@/components/common/AdminBadge';
import { TableRowActions } from '@/components/common/TableRowActions';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { SupportTicketStatusBadge } from '@/components/dashboard/help-support/SupportTicketStatusBadge';
import { DeleteSupportTicketDialog } from '@/components/dashboard/help-support/DeleteSupportTicketDialog';
import { useDeleteSupportTicketMutation, useGetSupportTicketsQuery } from '@/store/api';
import { usePermission } from '@/hooks/usePermission';
import { useAppSelector } from '@/hooks/useAppStore';
import { DASHBOARD_PAGE, ROLES } from '@/constants';
import {
  SUPPORT_TICKET_CASE_FILTER,
  SUPPORT_TICKET_CASE_FILTER_OPTIONS,
  SUPPORT_TICKET_ISSUE_TYPE_LABELS,
  canAdminDeleteSupportTicket,
  canAdminEditSupportTicket,
  type SupportTicketCaseFilter,
} from '@/constants/supportTicket';
import { legalModuleCardClass, legalModuleCardHeaderClass } from '@/components/common/dashboardTableStyles';
import { formatRelativeTime, formatShortDate } from '@/lib/formatDateTime';
import { cn } from '@/lib/utils';
import type { PaginatedMeta, SupportTicket } from '@/types';

const DEFAULT_PAGE_LIMIT = 10;

function CaseFilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'border border-brand-lime bg-transparent text-white'
          : 'border border-transparent bg-[#1a1a1a] text-neutral-300 hover:bg-[#222222]',
      )}
    >
      {label}
    </button>
  );
}

function SupportTicketCard({
  ticket,
  isSuperAdmin,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: {
  ticket: SupportTicket;
  isSuperAdmin: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  onView: (ticket: SupportTicket) => void;
  onEdit: (ticket: SupportTicket) => void;
  onDelete: (ticket: SupportTicket) => void;
}) {
  const showEdit = isSuperAdmin
    ? canUpdate
    : canUpdate && canAdminEditSupportTicket(ticket.status);
  const showDelete = isSuperAdmin
    ? canDelete
    : canDelete && canAdminDeleteSupportTicket(ticket.status);

  return (
    <div className="rounded-xl border border-[#252525] bg-[#0d0d0d] p-5 transition-colors hover:border-[#333333]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-neutral-500">#{ticket.ticketNumber}</span>
            {isSuperAdmin && ticket.createdBy ? <AdminBadge name={ticket.createdBy.name} /> : null}
          </div>

          <h3 className="text-base font-semibold leading-snug text-white">{ticket.subject}</h3>

          <div className="flex flex-wrap items-center gap-2">
            <SupportTicketStatusBadge status={ticket.status} />
            <span className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs text-neutral-300">
              {SUPPORT_TICKET_ISSUE_TYPE_LABELS[ticket.issueType]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatShortDate(ticket.createdAt)}
            </span>
            <span>Last updated {formatRelativeTime(ticket.updatedAt)}</span>
          </div>
        </div>

        <TableRowActions
          canView
          canEdit={showEdit}
          canDelete={showDelete}
          onView={() => onView(ticket)}
          onEdit={() => onEdit(ticket)}
          onDelete={() => onDelete(ticket)}
        />
      </div>
    </div>
  );
}

export function SupportTicketsListPage() {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;
  const { canCreate, canUpdate, canDelete } = usePermission('help-support');
  const canSubmitRequest = !isSuperAdmin && canCreate;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [caseFilter, setCaseFilter] = useState<SupportTicketCaseFilter>(SUPPORT_TICKET_CASE_FILTER.ALL);
  const [deleteItem, setDeleteItem] = useState<SupportTicket | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      caseFilter,
      ...(search ? { search } : {}),
    }),
    [page, limit, search, caseFilter],
  );

  const { data, isLoading, isFetching } = useGetSupportTicketsQuery(queryParams);
  const [deleteTicket, { isLoading: deleting }] = useDeleteSupportTicketMutation();
  const items = data?.data ?? [];
  const meta = data?.meta as PaginatedMeta | undefined;

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleView = (ticket: SupportTicket) => router.push(`/dashboard/help-support/${ticket._id}`);
  const handleEdit = (ticket: SupportTicket) =>
    router.push(`/dashboard/help-support/${ticket._id}?mode=edit`);

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await deleteTicket(deleteItem._id).unwrap();
      toast.success('Support ticket deleted');
      setDeleteItem(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Support Center"
        description={
          isSuperAdmin
            ? 'Monitor and resolve support requests submitted by admins.'
            : 'Find the status of your tickets here.'
        }
        action={
          canSubmitRequest ? (
            <Button
              onClick={() => router.push('/dashboard/help-support/create')}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          ) : undefined
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle className="text-white">
              {isSuperAdmin ? 'All support requests' : 'My support requests'}
            </CardTitle>
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <TableSearchField
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search for a request"
                className="w-full lg:min-w-[320px] lg:max-w-md"
              />
              <div className="flex flex-wrap gap-2">
                {SUPPORT_TICKET_CASE_FILTER_OPTIONS.map((option) => (
                  <CaseFilterPill
                    key={option.value}
                    label={option.label}
                    active={caseFilter === option.value}
                    onClick={() => {
                      setCaseFilter(option.value);
                      setPage(1);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {isLoading ? (
            <p className="py-16 text-center text-neutral-500">Loading support tickets...</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-neutral-500">
                {isSuperAdmin
                  ? 'No support tickets found.'
                  : 'You have not created any support requests yet.'}
              </p>
              {canSubmitRequest ? (
                <Button
                  onClick={() => router.push('/dashboard/help-support/create')}
                  className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((ticket) => (
                <SupportTicketCard
                  key={ticket._id}
                  ticket={ticket}
                  isSuperAdmin={isSuperAdmin}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={setDeleteItem}
                />
              ))}
            </div>
          )}

          <DataPagination meta={meta} onPageChange={setPage} onLimitChange={handleLimitChange} />
          {isFetching && !isLoading ? (
            <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p>
          ) : null}
        </CardContent>
      </Card>

      <DeleteSupportTicketDialog
        open={Boolean(deleteItem)}
        item={deleteItem}
        loading={deleting}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
