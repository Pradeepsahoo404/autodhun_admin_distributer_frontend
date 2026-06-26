'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { Allowlist } from '@/types';

interface DeleteAllowlistDialogProps {
  open: boolean;
  item: Allowlist | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAllowlistDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteAllowlistDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete allowlist entry"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.labelName ?? 'This entry'}
        message="This action cannot be undone. The allowlist record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
