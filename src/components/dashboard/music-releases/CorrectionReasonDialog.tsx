'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { AppModal } from '@/components/common/AppModal';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { Button } from '@/components/ui/button';

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
  const [reasons, setReasons] = useState<string[]>(['']);

  useEffect(() => {
    if (open) setReasons(['']);
  }, [open]);

  const updateReason = (index: number, value: string) => {
    setReasons((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addReason = () => setReasons((prev) => [...prev, '']);

  const removeReason = (index: number) => {
    setReasons((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const trimmedReasons = reasons.map((reason) => reason.trim()).filter(Boolean);
  const canSubmit = trimmedReasons.length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    void onConfirm(trimmedReasons);
  };

  const title =
    selectedCount > 1
      ? `Correction reasons (${selectedCount} releases)`
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
            <>Add the reasons that will be emailed to the admins for all selected releases.</>
          ) : (
            <>
              Add the reasons that will be emailed to the admin for{' '}
              <span className="font-medium text-white">{releaseTitle}</span>.
            </>
          )}
        </p>

        <div className="space-y-3">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <ProfileInputField
                  label={`Reason ${index + 1}`}
                  required={index === 0}
                  value={reason}
                  onChange={(e) => updateReason(index, e.target.value)}
                  placeholder="e.g. Cover art data is not matching with metadata"
                />
              </div>
              {reasons.length > 1 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeReason(index)}
                  className="mt-8 h-9 w-9 shrink-0 rounded-lg text-neutral-500 hover:text-red-400"
                  aria-label={`Remove reason ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={addReason}
          className="h-9 rounded-lg text-neutral-400 hover:text-brand-lime"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add another reason
        </Button>
      </div>
    </AppModal>
  );
}
