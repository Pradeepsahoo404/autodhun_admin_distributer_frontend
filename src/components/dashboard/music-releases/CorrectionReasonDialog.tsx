'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AppModal } from '@/components/common/AppModal';
import { ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';

interface CorrectionReasonDialogProps {
  open: boolean;
  releaseTitle?: string;
  selectedCount?: number;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (reasons: string[]) => void | Promise<void>;
}

export function CorrectionReasonDialog({
  open,
  releaseTitle,
  selectedCount = 1,
  isLoading,
  onClose,
  onConfirm,
}: CorrectionReasonDialogProps) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) setNote('');
  }, [open]);

  const trimmedNote = note.trim();
  const canSubmit = trimmedNote.length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    void onConfirm([trimmedNote]);
  };

  const title =
    selectedCount > 1
      ? `Correction note (${selectedCount} releases)`
      : 'Correction Required';

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      size="md"
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-xl bg-brand-lime px-5 text-[14px] font-semibold text-black hover:bg-brand-lime-dark disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Correction'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">
          {selectedCount > 1 ? (
            <>Describe the correction required. This note will be emailed to the admins for all selected releases.</>
          ) : (
            <>
              Describe the correction required for{' '}
              <span className="font-medium text-white">{releaseTitle}</span>. This note will be emailed to the admin.
            </>
          )}
        </p>

        <ProfileTextareaField
          label="Correction note"
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe what needs to be corrected, e.g. cover art does not match metadata, artist name spelling, etc."
          rows={6}
        />
      </div>
    </AppModal>
  );
}
