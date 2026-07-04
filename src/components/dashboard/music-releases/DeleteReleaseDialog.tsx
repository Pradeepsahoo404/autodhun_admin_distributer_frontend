'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { MusicRelease } from '@/types';

interface DeleteReleaseDialogProps {
  open: boolean;
  release: MusicRelease | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteReleaseDialog({
  open,
  release,
  loading,
  onClose,
  onConfirm,
}: DeleteReleaseDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete release"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={release?.title ?? 'This release'}
        subtitle={release?.artist ? `Artist: ${release.artist}` : undefined}
        message="This action cannot be undone. The release and all submitted data will be permanently removed."
      />
    </AppConfirmModal>
  );
}
