'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppModal } from '@/components/common/AppModal';
import { useDeleteReleaseLabelMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import type { ReleaseCatalogItem } from '@/store/api/releaseCatalogApi';

interface DeleteLabelDialogProps {
  open: boolean;
  label: ReleaseCatalogItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteLabelDialog({ open, label, onClose, onSuccess }: DeleteLabelDialogProps) {
  const [deleteLabel, { isLoading }] = useDeleteReleaseLabelMutation();

  const handleDelete = async () => {
    if (!label) return;

    try {
      await deleteLabel(label._id).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Delete Label"
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2a2a2a] px-5 text-[14px] font-medium text-neutral-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isLoading}
            className="inline-flex h-11 min-w-[100px] items-center justify-center rounded-xl bg-red-500 px-5 text-[14px] font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </button>
        </div>
      }
    >
      <p className="text-sm text-neutral-400">
        Are you sure you want to permanently delete{' '}
        <span className="font-medium text-white">{label?.name}</span>? This action cannot be undone.
      </p>
    </AppModal>
  );
}
