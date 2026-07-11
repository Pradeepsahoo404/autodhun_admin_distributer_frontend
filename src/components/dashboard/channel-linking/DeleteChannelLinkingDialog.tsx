'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { ChannelLinking } from '@/types';

interface DeleteChannelLinkingDialogProps {
  open: boolean;
  item: ChannelLinking | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteChannelLinkingDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteChannelLinkingDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete channel linking"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.channelName ?? 'This entry'}
        subtitle={item?.channelLink}
        message="This action cannot be undone. The channel linking record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
