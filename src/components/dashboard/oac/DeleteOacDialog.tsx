'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { Oac } from '@/types';

interface DeleteOacDialogProps {
  open: boolean;
  item: Oac | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteOacDialog({ open, item, loading, onClose, onConfirm }: DeleteOacDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete OAC entry"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.artistChannelName ?? 'This entry'}
        subtitle={item?.isrcCode ? `ISRC: ${item.isrcCode}` : undefined}
        message="This action cannot be undone. The OAC record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
