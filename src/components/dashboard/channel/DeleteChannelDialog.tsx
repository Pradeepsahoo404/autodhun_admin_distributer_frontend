'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { Channel } from '@/types';

interface DeleteChannelDialogProps {
  open: boolean;
  item: Channel | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteChannelDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteChannelDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete channel"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.channelName ?? 'This channel'}
        subtitle={item?.channelLink}
        message="This action cannot be undone. The channel record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
