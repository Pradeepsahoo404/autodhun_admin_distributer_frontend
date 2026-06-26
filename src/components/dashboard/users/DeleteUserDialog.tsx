'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { User } from '@/types';

interface DeleteUserDialogProps {
  open: boolean;
  user: User | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({ open, user, loading, onClose, onConfirm }: DeleteUserDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete user"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={user?.name ?? 'This user'}
        subtitle={user?.email}
        message="This action cannot be undone. The user will lose admin access immediately."
      />
    </AppConfirmModal>
  );
}
