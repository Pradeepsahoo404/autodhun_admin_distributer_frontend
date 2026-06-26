'use client';

import { ModalDeleteBody } from '@/components/common/ModalDeleteBody';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { Role } from '@/types';

interface DeleteRoleDialogProps {
  open: boolean;
  role: Role | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRoleDialog({ open, role, loading, onClose, onConfirm }: DeleteRoleDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete role"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <ModalDeleteBody
        name={role?.name ?? 'This role'}
        subtitle={role?.slug}
        message="This action cannot be undone. Users assigned to this role may lose access."
      />
    </AppConfirmModal>
  );
}
