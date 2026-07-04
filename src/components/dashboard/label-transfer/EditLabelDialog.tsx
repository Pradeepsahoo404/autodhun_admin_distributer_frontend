'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppModal } from '@/components/common/AppModal';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { useUpdateReleaseLabelMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import type { ReleaseCatalogItem } from '@/store/api/releaseCatalogApi';

interface EditLabelDialogProps {
  open: boolean;
  label: ReleaseCatalogItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditLabelDialog({ open, label, onClose, onSuccess }: EditLabelDialogProps) {
  const [name, setName] = useState('');
  const [updateLabel, { isLoading }] = useUpdateReleaseLabelMutation();

  useEffect(() => {
    if (open && label) setName(label.name);
    if (!open) setName('');
  }, [open, label]);

  const handleSubmit = async () => {
    if (!label || !name.trim()) return;

    try {
      await updateLabel({ id: label._id, name: name.trim() }).unwrap();
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
      title="Edit Label"
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
            onClick={() => void handleSubmit()}
            disabled={!name.trim() || isLoading}
            className="inline-flex h-11 min-w-[100px] items-center justify-center rounded-xl bg-brand-lime px-5 text-[14px] font-semibold text-black hover:bg-brand-lime-dark disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </button>
        </div>
      }
    >
      <ProfileInputField
        label="Label name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter label name"
      />
    </AppModal>
  );
}
