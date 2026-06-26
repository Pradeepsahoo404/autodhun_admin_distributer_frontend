'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { IssuesAssignedEntry } from '@/types';

interface DeleteIssuesEntryDialogProps {
  open: boolean;
  item: IssuesAssignedEntry | null;
  loading?: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteIssuesEntryDialog({
  open,
  item,
  loading,
  title,
  message,
  onClose,
  onConfirm,
}: DeleteIssuesEntryDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody name={item?.assetName ?? 'This entry'} message={message} />
    </AppConfirmModal>
  );
}
