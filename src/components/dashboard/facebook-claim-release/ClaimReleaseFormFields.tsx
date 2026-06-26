'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { FacebookClaimReleaseFormData } from '@/features/facebook-claim-release/schemas';

interface ClaimReleaseFormFieldsProps {
  register: UseFormRegister<FacebookClaimReleaseFormData>;
  errors: FieldErrors<FacebookClaimReleaseFormData>;
  idPrefix?: string;
}

const fields: {
  name: keyof FacebookClaimReleaseFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: 'senderLabelName', label: 'Label name (who sent a claim)', placeholder: 'Sender label name' },
  { name: 'receiverLabelName', label: 'Label name (who received claim)', placeholder: 'Receiver label name' },
  { name: 'facebookPageLink', label: 'Facebook page link', placeholder: 'https://facebook.com/...' },
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
          error={errors[name]?.message ? String(errors[name]?.message) : undefined}
          {...register(name)}
        />
      ))}
    </div>
  );
}
