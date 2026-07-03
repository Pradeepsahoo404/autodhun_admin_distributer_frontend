'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ReleaseLabelSelect } from '@/components/common/ReleaseLabelSelect';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ContentIdFormData } from '@/features/content-id/schemas';

interface ContentIdFormFieldsProps {
  register: UseFormRegister<ContentIdFormData>;
  errors: FieldErrors<ContentIdFormData>;
  idPrefix?: string;
  labelName: string;
  onLabelNameChange: (value: string) => void;
}

export function ContentIdFormFields({
  register,
  errors,
  idPrefix = '',
  labelName,
  onLabelNameChange,
}: ContentIdFormFieldsProps) {
  return (
    <div className="space-y-4">
      <ReleaseLabelSelect
        value={labelName}
        onChange={onLabelNameChange}
        fieldLabel="Label name"
        error={errors.labelName?.message ? String(errors.labelName.message) : undefined}
      />
      <ProfileInputField
        id={`${idPrefix}isrcCode`}
        label="ISRC"
        placeholder="ISRC code"
        required
        error={errors.isrcCode?.message ? String(errors.isrcCode.message) : undefined}
        {...register('isrcCode')}
      />
    </div>
  );
}
