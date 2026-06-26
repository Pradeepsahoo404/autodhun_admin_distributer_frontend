'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { ManualClaiming } from '@/types';

interface DeleteManualClaimingDialogProps {
  open: boolean;
  item: ManualClaiming | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteManualClaimingDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteManualClaimingDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete manual claiming entry"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.labelName ?? 'This entry'}
        subtitle={item?.isrcCode ? `ISRC: ${item.isrcCode}` : undefined}
        message="This action cannot be undone. The manual claiming record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
