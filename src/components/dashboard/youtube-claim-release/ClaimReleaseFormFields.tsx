'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ClaimReleaseLabelFields } from '@/components/common/ClaimReleaseLabelFields';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ClaimReleaseFormData } from '@/features/youtube-claim-release/schemas';

interface ClaimReleaseFormFieldsProps {
  register: UseFormRegister<ClaimReleaseFormData>;
  errors: FieldErrors<ClaimReleaseFormData>;
  idPrefix?: string;
  senderLabelName: string;
  receiverLabelName: string;
  onSenderLabelChange: (value: string) => void;
  onReceiverLabelChange: (value: string) => void;
}

export function ClaimReleaseFormFields({
  register,
  errors,
  idPrefix = '',
  senderLabelName,
  receiverLabelName,
  onSenderLabelChange,
  onReceiverLabelChange,
}: ClaimReleaseFormFieldsProps) {
  return (
    <div className="space-y-4">
      <ClaimReleaseLabelFields
        senderLabelName={senderLabelName}
        receiverLabelName={receiverLabelName}
        onSenderLabelChange={onSenderLabelChange}
        onReceiverLabelChange={onReceiverLabelChange}
        errors={errors}
      />
      <ProfileInputField
        id={`${idPrefix}youtubeLink`}
        label="YouTube link"
        placeholder="https://youtube.com/..."
        required
        error={errors.youtubeLink?.message ? String(errors.youtubeLink.message) : undefined}
        {...register('youtubeLink')}
      />
      <ProfileInputField
        id={`${idPrefix}isrcCode`}
        label="ISRC code"
        placeholder="ISRC code"
        required
        error={errors.isrcCode?.message ? String(errors.isrcCode.message) : undefined}
        {...register('isrcCode')}
      />
    </div>
  );
}
