'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { modalCancelButtonClass, modalPrimaryButtonClass } from '@/components/common/AppModal';

interface ModalFormFooterProps {
  onCancel: () => void;
  submitLabel: string;
  formId: string;
  loading?: boolean;
  submitDisabled?: boolean;
}

export function ModalFormFooter({
  onCancel,
  submitLabel,
  formId,
  loading = false,
  submitDisabled = false,
}: ModalFormFooterProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="ghost" onClick={onCancel} className={modalCancelButtonClass}>
        Cancel
      </Button>
      <Button
        type="submit"
        form={formId}
        disabled={loading || submitDisabled}
        className={modalPrimaryButtonClass}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </Button>
    </div>
  );
}
