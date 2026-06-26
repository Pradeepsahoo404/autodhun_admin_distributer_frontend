'use client';

import { Trash2 } from 'lucide-react';
import { AppConfirmModal } from '@/components/common/AppConfirmModal';
import type { Module } from '@/types';

interface DeleteModuleDialogProps {
  open: boolean;
  module: Module | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModuleDialog({ open, module, loading, onClose, onConfirm }: DeleteModuleDialogProps) {
  return (
    <AppConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete module"
      confirmLabel="Delete"
      loading={loading}
      variant="danger"
    >
      <div className="flex flex-col items-center py-2 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <Trash2 className="h-7 w-7" strokeWidth={1.75} />
        </div>

        <p className="text-[15px] font-medium text-white">{module?.name ?? 'This module'}</p>
        {module?.route ? <p className="mt-1 text-[13px] text-neutral-500">{module.route}</p> : null}

        <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-neutral-500">
          This will permanently delete the module, its sub-modules, and all role permissions linked to them.
        </p>
      </div>
    </AppConfirmModal>
  );
}
