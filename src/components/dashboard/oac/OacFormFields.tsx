'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { OacFormData } from '@/features/oac/schemas';

interface OacFormFieldsProps {
  register: UseFormRegister<OacFormData>;
  errors: FieldErrors<OacFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof OacFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'artistChannelName', label: 'Artist channel name', placeholder: 'Artist channel name' },
  { name: 'artistChannelLink', label: 'Artist channel link', placeholder: 'https://youtube.com/...' },
  {
    name: 'artistChannelTopicLink',
    label: 'Artist channel topic link',
    placeholder: 'https://youtube.com/...',
  },
  { name: 'isrcCode', label: 'ISRC code', placeholder: 'ISRC code' },
];

export function OacFormFields({ register, errors, idPrefix = '' }: OacFormFieldsProps) {
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
