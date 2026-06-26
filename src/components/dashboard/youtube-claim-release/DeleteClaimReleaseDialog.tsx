'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { YoutubeClaimRelease } from '@/types';

interface DeleteClaimReleaseDialogProps {
  open: boolean;
  item: YoutubeClaimRelease | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteClaimReleaseDialog({
  open,
  item,
  loading,
  onClose,
  onConfirm,
}: DeleteClaimReleaseDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete claim release"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={item?.senderLabelName ?? 'This entry'}
        subtitle={item?.isrcCode ? `ISRC: ${item.isrcCode}` : undefined}
        message="This action cannot be undone. The claim release record will be permanently removed."
      />
    </AppConfirmModal>
  );
}
