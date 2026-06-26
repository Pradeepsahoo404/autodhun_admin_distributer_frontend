'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ProfileLinkingFormData } from '@/features/profile-linking/schemas';

interface ProfileLinkingFormFieldsProps {
  register: UseFormRegister<ProfileLinkingFormData>;
  errors: FieldErrors<ProfileLinkingFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof ProfileLinkingFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'labelName', label: 'Label name', placeholder: 'Label name' },
  { name: 'isrcCode', label: 'ISRC code', placeholder: 'ISRC code' },
  { name: 'facebookPageLink', label: 'Facebook page link', placeholder: 'https://facebook.com/...' },
  { name: 'instagramHandleName', label: 'Instagram handle name', placeholder: '@username' },
];

export function ProfileLinkingFormFields({
  register,
  errors,
  idPrefix = '',
}: ProfileLinkingFormFieldsProps) {
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
