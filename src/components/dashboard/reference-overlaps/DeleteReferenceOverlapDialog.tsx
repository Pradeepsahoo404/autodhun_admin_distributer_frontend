'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { ReferenceOverlap } from '@/types';

interface DeleteReferenceOverlapDialogProps {
  open: boolean;
  item: ReferenceOverlap | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteReferenceOverlapDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteReferenceOverlapDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete reference overlap"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.assetName ?? 'This entry'}
        message="This action cannot be undone. The reference overlap record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
