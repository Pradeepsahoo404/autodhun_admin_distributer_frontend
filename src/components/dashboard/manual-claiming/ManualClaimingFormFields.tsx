'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ReleaseLabelSelect } from '@/components/common/ReleaseLabelSelect';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ManualClaimingFormData } from '@/features/manual-claiming/schemas';

interface ManualClaimingFormFieldsProps {
  register: UseFormRegister<ManualClaimingFormData>;
  errors: FieldErrors<ManualClaimingFormData>;
  idPrefix?: string;
  labelName: string;
  onLabelNameChange: (value: string) => void;
}

export function ManualClaimingFormFields({
  register,
  errors,
  idPrefix = '',
  labelName,
  onLabelNameChange,
}: ManualClaimingFormFieldsProps) {
  return (
    <div className="space-y-4">
      <ReleaseLabelSelect
        value={labelName}
        onChange={onLabelNameChange}
        fieldLabel="Label name"
        error={errors.labelName?.message ? String(errors.labelName.message) : undefined}
      />
      <ProfileInputField
        id={`${idPrefix}originalSongLink`}
        label="Original song link"
        placeholder="https://..."
        required
        error={
          errors.originalSongLink?.message ? String(errors.originalSongLink.message) : undefined
        }
        {...register('originalSongLink')}
      />
      <ProfileInputField
        id={`${idPrefix}isrcCode`}
        label="ISRC code"
        placeholder="ISRC code"
        required
        error={errors.isrcCode?.message ? String(errors.isrcCode.message) : undefined}
        {...register('isrcCode')}
      />
      <ProfileInputField
        id={`${idPrefix}songLink`}
        label="Song link"
        placeholder="https://..."
        required
        error={errors.songLink?.message ? String(errors.songLink.message) : undefined}
        {...register('songLink')}
      />
    </div>
  );
}
