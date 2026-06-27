'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { AllowlistFormData } from '@/features/allowlist/schemas';

interface AllowlistFormFieldsProps {
  register: UseFormRegister<AllowlistFormData>;
  errors: FieldErrors<AllowlistFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof AllowlistFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'labelName', label: 'Label name', placeholder: 'Label name' },
  { name: 'channelLink', label: 'Channel link', placeholder: 'https://youtube.com/...' },
];

export function AllowlistFormFields({ register, errors, idPrefix = '' }: AllowlistFormFieldsProps) {
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
