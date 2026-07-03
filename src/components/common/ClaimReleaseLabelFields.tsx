'use client';

import { FieldErrors } from 'react-hook-form';
import { ReleaseLabelSelect } from '@/components/common/ReleaseLabelSelect';

interface ClaimReleaseLabelFieldsProps {
  senderLabelName: string;
  receiverLabelName: string;
  onSenderLabelChange: (value: string) => void;
  onReceiverLabelChange: (value: string) => void;
  errors: FieldErrors<{
    senderLabelName?: { message?: string };
    receiverLabelName?: { message?: string };
  }>;
}

export function ClaimReleaseLabelFields({
  senderLabelName,
  receiverLabelName,
  onSenderLabelChange,
  onReceiverLabelChange,
  errors,
}: ClaimReleaseLabelFieldsProps) {
  return (
    <>
      <ReleaseLabelSelect
        value={senderLabelName}
        onChange={onSenderLabelChange}
        fieldLabel="Label name (who sent a claim)"
        error={errors.senderLabelName?.message ? String(errors.senderLabelName.message) : undefined}
      />
      <ReleaseLabelSelect
        value={receiverLabelName}
        onChange={onReceiverLabelChange}
        fieldLabel="Label name (who received claim)"
        error={
          errors.receiverLabelName?.message ? String(errors.receiverLabelName.message) : undefined
        }
      />
    </>
  );
}
