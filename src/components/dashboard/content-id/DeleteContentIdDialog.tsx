'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { ContentId } from '@/types';

interface DeleteContentIdDialogProps {
  open: boolean;
  item: ContentId | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteContentIdDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteContentIdDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete content ID"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.labelName ?? 'This entry'}
        subtitle={item?.isrcCode ? `ISRC: ${item.isrcCode}` : undefined}
        message="This action cannot be undone. The content ID record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
