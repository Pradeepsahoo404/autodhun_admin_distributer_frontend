'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ClaimReleaseLabelFields } from '@/components/common/ClaimReleaseLabelFields';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { FacebookClaimReleaseFormData } from '@/features/facebook-claim-release/schemas';

interface ClaimReleaseFormFieldsProps {
  register: UseFormRegister<FacebookClaimReleaseFormData>;
  errors: FieldErrors<FacebookClaimReleaseFormData>;
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
        id={`${idPrefix}facebookPageLink`}
        label="Facebook page link"
        placeholder="https://facebook.com/..."
        required
        error={
          errors.facebookPageLink?.message ? String(errors.facebookPageLink.message) : undefined
        }
        {...register('facebookPageLink')}
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
