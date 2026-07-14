'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdminBadge } from '@/components/common/AdminBadge';
import {
  useDeleteSupportTicketMutation,
  useGetSupportTicketByIdQuery,
  useUpdateSupportTicketMutation,
  useUpdateSupportTicketStatusMutation,
} from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { usePermission } from '@/hooks/usePermission';
import { useAppSelector } from '@/hooks/useAppStore';
import { DASHBOARD_CARD, DASHBOARD_PAGE, DASHBOARD_PAGE_TITLE, ROLES } from '@/constants';
import {
  SUPPORT_TICKET_STATUS,
  SUPPORT_TICKET_STATUS_LABELS,
  SUPPORT_TICKET_CATEGORY_LABELS,
  SUPPORT_TICKET_ISSUE_TYPE_LABELS,
  canAdminDeleteSupportTicket,
  canAdminEditSupportTicket,
} from '@/constants/supportTicket';
import {
  supportTicketFormSchema,
  supportTicketStatusFormSchema,
  type SupportTicketFormData,
  type SupportTicketStatusFormData,
} from '@/features/help-support/schemas';
import {
  SupportTicketCategoryFields,
  defaultSupportTicketFormValues,
} from '@/components/dashboard/help-support/SupportTicketCategoryFields';
import { SupportTicketStatusBadge } from '@/components/dashboard/help-support/SupportTicketStatusBadge';
import { DeleteSupportTicketDialog } from '@/components/dashboard/help-support/DeleteSupportTicketDialog';
import { FormFieldLabel, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { legalModuleCardClass } from '@/components/common/dashboardTableStyles';
import { formatDateTime, formatRelativeTime, formatShortDate } from '@/lib/formatDateTime';
import { cn } from '@/lib/utils';

function DetailReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-medium text-neutral-400">{label}</p>
      <div className="rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4 py-3 text-[14px] leading-relaxed text-white">
        {value}
      </div>
    </div>
  );
}

interface SupportTicketDetailViewProps {
  ticketId: string;
}

export function SupportTicketDetailView({ ticketId }: SupportTicketDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEdit = searchParams.get('mode') === 'edit';

  const { user: currentUser } = useAppSelector((s) => s.auth);
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;
  const { canUpdate, canDelete } = usePermission('help-support');

  const { data, isLoading, isError } = useGetSupportTicketByIdQuery(ticketId);
  const [updateTicket, { isLoading: updating }] = useUpdateSupportTicketMutation();
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateSupportTicketStatusMutation();
  const [deleteTicket, { isLoading: deleting }] = useDeleteSupportTicketMutation();

  const ticket = data?.data;
  const [isEditing, setIsEditing] = useState(initialEdit);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setIsEditing(initialEdit);
  }, [initialEdit, ticketId]);

  const canEditContent = useMemo(() => {
    if (!ticket) return false;
    if (isSuperAdmin) return canUpdate;
    return canUpdate && canAdminEditSupportTicket(ticket.status);
  }, [ticket, isSuperAdmin, canUpdate]);

  const canDeleteTicket = useMemo(() => {
    if (!ticket) return false;
    if (isSuperAdmin) return canDelete;
    return canDelete && canAdminDeleteSupportTicket(ticket.status);
  }, [ticket, isSuperAdmin, canDelete]);

  const canManageStatus = isSuperAdmin && ticket && ticket.status !== SUPPORT_TICKET_STATUS.CLOSED;

  const contentForm = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketFormSchema),
    defaultValues: defaultSupportTicketFormValues,
    values: ticket
      ? {
          category: ticket.category,
          issueType: ticket.issueType,
          description: ticket.description,
        }
      : undefined,
  });

  const statusForm = useForm<SupportTicketStatusFormData>({
    resolver: zodResolver(supportTicketStatusFormSchema),
    values: ticket
      ? {
          status:
            ticket.status === SUPPORT_TICKET_STATUS.RESOLVED
              ? 'resolved'
              : 'open',
          resolutionNote: ticket.resolutionNote ?? '',
        }
      : undefined,
  });

  const handleContentSubmit = async (formData: SupportTicketFormData) => {
    try {
      await updateTicket({ id: ticketId, body: formData }).unwrap();
      toast.success('Support ticket updated');
      setIsEditing(false);
      router.replace(`/dashboard/help-support/${ticketId}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleStatusSubmit = async (formData: SupportTicketStatusFormData) => {
    try {
      await updateStatus({ id: ticketId, body: formData }).unwrap();
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTicket(ticketId).unwrap();
      toast.success('Support ticket deleted');
      router.push('/dashboard/help-support');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className={cn(DASHBOARD_PAGE, 'flex min-h-[40vh] items-center justify-center')}>
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className={cn(DASHBOARD_PAGE, 'space-y-4')}>
        <button
          type="button"
          onClick={() => router.push('/dashboard/help-support')}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support Center
        </button>
        <p className="text-neutral-500">Support ticket not found.</p>
      </div>
    );
  }

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-6')}>
      <button
        type="button"
        onClick={() => router.push('/dashboard/help-support')}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Support Center
      </button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-neutral-500">#{ticket.ticketNumber}</span>
            {isSuperAdmin && ticket.createdBy ? <AdminBadge name={ticket.createdBy.name} /> : null}
          </div>
          <h1 className={cn(DASHBOARD_PAGE_TITLE, 'break-words')}>{ticket.subject}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SupportTicketStatusBadge status={ticket.status} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatShortDate(ticket.createdAt)}
            </span>
            <span>Last updated {formatRelativeTime(ticket.updatedAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {canEditContent && !isEditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]"
            >
              Edit
            </Button>
          ) : null}
          {canDeleteTicket ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="rounded-xl border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      <Card className={cn(DASHBOARD_CARD, legalModuleCardClass)}>
        <CardContent className="p-0">
          {isEditing ? (
            <form
              onSubmit={contentForm.handleSubmit(handleContentSubmit)}
              className="space-y-8 p-6 sm:p-8"
            >
              <section className="space-y-5">
                <h2 className="border-b border-[#1f1f1f] pb-3 text-[15px] font-semibold text-white">
                  Basic Details
                </h2>
                <SupportTicketCategoryFields
                  watch={contentForm.watch}
                  setValue={contentForm.setValue}
                  clearErrors={contentForm.clearErrors}
                  errors={contentForm.formState.errors}
                  idPrefix="edit-"
                />
              </section>

              <section className="space-y-5">
                <h2 className="border-b border-[#1f1f1f] pb-3 text-[15px] font-semibold text-white">
                  Form Details
                </h2>
                <ProfileTextareaField
                  id="edit-description"
                  label="Description"
                  required
                  rows={8}
                  placeholder="Please describe your issue in detail..."
                  className="[&_textarea]:min-h-[180px]"
                  error={contentForm.formState.errors.description?.message}
                  {...contentForm.register('description', {
                    onChange: () => contentForm.clearErrors('description'),
                  })}
                />
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-[#1f1f1f] pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    contentForm.reset();
                    setIsEditing(false);
                    router.replace(`/dashboard/help-support/${ticketId}`);
                  }}
                  className="rounded-xl border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8 p-6 sm:p-8">
              <section className="space-y-5">
                <h2 className="border-b border-[#1f1f1f] pb-3 text-[15px] font-semibold text-white">
                  Basic Details
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailReadField
                    label="Issue Category"
                    value={SUPPORT_TICKET_CATEGORY_LABELS[ticket.category]}
                  />
                  <DetailReadField
                    label="Issue Type"
                    value={SUPPORT_TICKET_ISSUE_TYPE_LABELS[ticket.issueType]}
                  />
                </div>
              </section>

              <section className="space-y-5">
                <h2 className="border-b border-[#1f1f1f] pb-3 text-[15px] font-semibold text-white">
                  Form Details
                </h2>
                <DetailReadField label="Description" value={ticket.description} />
              </section>

              {ticket.resolutionNote?.trim() ? (
                <section className="space-y-5">
                  <h2 className="border-b border-[#1f1f1f] pb-3 text-[15px] font-semibold text-white">
                    Resolution
                  </h2>
                  <DetailReadField label="Resolution Note" value={ticket.resolutionNote} />
                  {ticket.resolvedAt ? (
                    <p className="text-xs text-neutral-500">
                      Resolved on {formatDateTime(ticket.resolvedAt)}
                      {ticket.status === SUPPORT_TICKET_STATUS.RESOLVED
                        ? ' · Auto-closes after 48 hours'
                        : null}
                    </p>
                  ) : null}
                </section>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {canManageStatus ? (
        <Card className={cn(DASHBOARD_CARD, legalModuleCardClass)}>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 className="text-[15px] font-semibold text-white">Manage Ticket</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Update the ticket to Open or Resolved. Resolved tickets auto-close after 48 hours.
              </p>
            </div>

            <form onSubmit={statusForm.handleSubmit(handleStatusSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
                <div className="min-w-0 space-y-2">
                  <FormFieldLabel label="Status" htmlFor="status" required />
                  <TableSelectField
                    value={statusForm.watch('status')}
                    onChange={(value) => {
                      statusForm.setValue('status', value as SupportTicketStatusFormData['status'], {
                        shouldDirty: true,
                      });
                    }}
                    options={[
                      { value: SUPPORT_TICKET_STATUS.OPEN, label: SUPPORT_TICKET_STATUS_LABELS.open },
                      {
                        value: SUPPORT_TICKET_STATUS.RESOLVED,
                        label: SUPPORT_TICKET_STATUS_LABELS.resolved,
                      },
                    ]}
                    className="w-full min-w-0"
                    aria-label="Ticket status"
                  />
                </div>

                <ProfileTextareaField
                  id="resolutionNote"
                  label="Resolution Note"
                  rows={5}
                  placeholder="Add notes about how this issue was resolved..."
                  className="[&_textarea]:min-h-[120px]"
                  {...statusForm.register('resolutionNote')}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updatingStatus}
                  className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <DeleteSupportTicketDialog
        open={deleteOpen}
        item={ticket}
        loading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
