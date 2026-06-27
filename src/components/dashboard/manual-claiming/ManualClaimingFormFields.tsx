'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ManualClaimingFormData } from '@/features/manual-claiming/schemas';

interface ManualClaimingFormFieldsProps {
  register: UseFormRegister<ManualClaimingFormData>;
  errors: FieldErrors<ManualClaimingFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof ManualClaimingFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'labelName', label: 'Label name', placeholder: 'Label name' },
  { name: 'originalSongLink', label: 'Original song link', placeholder: 'https://...' },
  { name: 'isrcCode', label: 'ISRC code', placeholder: 'ISRC code' },
  { name: 'songLink', label: 'Song link', placeholder: 'https://...' },
];

export function ManualClaimingFormFields({
  register,
  errors,
  idPrefix = '',
}: ManualClaimingFormFieldsProps) {
  return (
    <div className="space-y-4">
      {fields.map(({ name, label, placeholder }) => (
        <ProfileInputField
          key={name}
          id={`${idPrefix}${name}`}
          label={label}
          placeholder={placeholder}
          required
          error={errors[name]?.message ? String(errors[name]?.message) : undefined}
          {...register(name)}
        />
      ))}
    </div>
  );
}
