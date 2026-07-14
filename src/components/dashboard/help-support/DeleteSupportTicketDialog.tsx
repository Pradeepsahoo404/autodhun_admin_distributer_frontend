'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { SupportTicket } from '@/types';
import { SUPPORT_TICKET_ISSUE_TYPE_LABELS } from '@/constants/supportTicket';

interface DeleteSupportTicketDialogProps {
  open: boolean;
  item: SupportTicket | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSupportTicketDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteSupportTicketDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete support request"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item ? `#${item.ticketNumber} — ${item.subject}` : 'This support request'}
        subtitle={item ? SUPPORT_TICKET_ISSUE_TYPE_LABELS[item.issueType] : undefined}
        message="This action cannot be undone. The support request will be permanently removed."
      />
    </AppConfirmModal>
  );
}
