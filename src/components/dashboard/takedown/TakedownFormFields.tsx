'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { TakedownFormData } from '@/features/takedown/schemas';

interface TakedownFormFieldsProps {
  register: UseFormRegister<TakedownFormData>;
  errors: FieldErrors<TakedownFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof TakedownFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'labelName', label: 'Label name', placeholder: 'Label name' },
  { name: 'isrcCode', label: 'ISRC code', placeholder: 'ISRC code' },
  { name: 'songLink', label: 'Song link', placeholder: 'https://...' },
];

export function TakedownFormFields({ register, errors, idPrefix = '' }: TakedownFormFieldsProps) {
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
