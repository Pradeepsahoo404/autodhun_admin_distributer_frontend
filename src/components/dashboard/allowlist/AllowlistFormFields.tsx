'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ReleaseLabelSelect } from '@/components/common/ReleaseLabelSelect';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { AllowlistFormData } from '@/features/allowlist/schemas';

interface AllowlistFormFieldsProps {
  register: UseFormRegister<AllowlistFormData>;
  errors: FieldErrors<AllowlistFormData>;
  idPrefix?: string;
  labelName: string;
  onLabelNameChange: (value: string) => void;
}

export function AllowlistFormFields({
  register,
  errors,
  idPrefix = '',
  labelName,
  onLabelNameChange,
}: AllowlistFormFieldsProps) {
  return (
    <div className="space-y-4">
      <ReleaseLabelSelect
        value={labelName}
        onChange={onLabelNameChange}
        fieldLabel="Label name"
        error={errors.labelName?.message ? String(errors.labelName.message) : undefined}
      />
      <ProfileInputField
        id={`${idPrefix}channelLink`}
        label="Channel link"
        placeholder="https://youtube.com/..."
        required
        error={errors.channelLink?.message ? String(errors.channelLink.message) : undefined}
        {...register('channelLink')}
      />
    </div>
  );
}
