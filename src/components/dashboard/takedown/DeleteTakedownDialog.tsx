'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { Takedown } from '@/types';

interface DeleteTakedownDialogProps {
  open: boolean;
  item: Takedown | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTakedownDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteTakedownDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete takedown entry"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.labelName ?? 'This entry'}
        subtitle={item?.isrcCode ? `ISRC: ${item.isrcCode}` : undefined}
        message="This action cannot be undone. The takedown record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
