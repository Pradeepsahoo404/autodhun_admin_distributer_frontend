'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ContentIdFormData } from '@/features/content-id/schemas';

interface ContentIdFormFieldsProps {
  register: UseFormRegister<ContentIdFormData>;
  errors: FieldErrors<ContentIdFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof ContentIdFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'labelName', label: 'Label name', placeholder: 'Label name' },
  { name: 'isrcCode', label: 'ISRC', placeholder: 'ISRC code' },
];

export function ContentIdFormFields({ register, errors, idPrefix = '' }: ContentIdFormFieldsProps) {
  return (
    <div className="space-y-4">
      {fields.map(({ name, label, placeholder }) => (
        <ProfileInputField
          key={name}
          id={`${idPrefix}${name}`}
          label={label}
          placeholder={placeholder}
          error={errors[name]?.message ? String(errors[name]?.message) : undefined}
          {...register(name)}
        />
      ))}
    </div>
  );
}
