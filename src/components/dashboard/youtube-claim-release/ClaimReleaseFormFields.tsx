'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ClaimReleaseFormData } from '@/features/youtube-claim-release/schemas';

interface ClaimReleaseFormFieldsProps {
  register: UseFormRegister<ClaimReleaseFormData>;
  errors: FieldErrors<ClaimReleaseFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof ClaimReleaseFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'senderLabelName', label: 'Label name (who sent a claim)', placeholder: 'Sender label name' },
  { name: 'receiverLabelName', label: 'Label name (who received claim)', placeholder: 'Receiver label name' },
  { name: 'youtubeLink', label: 'YouTube link', placeholder: 'https://youtube.com/...' },
  { name: 'isrcCode', label: 'ISRC code', placeholder: 'ISRC code' },
];

export function ClaimReleaseFormFields({ register, errors, idPrefix = '' }: ClaimReleaseFormFieldsProps) {
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
