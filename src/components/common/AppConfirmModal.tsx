'use client';

import { Loader2 } from 'lucide-react';
import {
  AppModal,
  modalCancelButtonClass,
  modalDangerButtonClass,
  modalPrimaryButtonClass,
} from '@/components/common/AppModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'default';
  children?: React.ReactNode;
}

/** Reusable confirmation modal — same shell as add/edit, danger styling only on confirm button. */
export function AppConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'danger',
  children,
}: AppConfirmModalProps) {
  const isDanger = variant === 'danger';

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className={modalCancelButtonClass}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(isDanger ? modalDangerButtonClass : modalPrimaryButtonClass)}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmLabel}
          </Button>
        </div>
      }
    >
      {children}
    </AppModal>
  );
}
