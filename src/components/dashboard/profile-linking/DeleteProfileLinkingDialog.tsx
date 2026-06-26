'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { ProfileLinking } from '@/types';

interface DeleteProfileLinkingDialogProps {
  open: boolean;
  item: ProfileLinking | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteProfileLinkingDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteProfileLinkingDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete profile linking"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.labelName ?? 'This entry'}
        subtitle={item?.isrcCode ? `ISRC: ${item.isrcCode}` : undefined}
        message="This action cannot be undone. The profile linking record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
