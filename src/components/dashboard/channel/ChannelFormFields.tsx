'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ChannelFormData } from '@/features/channel/schemas';

interface ChannelFormFieldsProps {
  register: UseFormRegister<ChannelFormData>;
  errors: FieldErrors<ChannelFormData>;
  idPrefix?: string;
}

export function ChannelFormFields({ register, errors, idPrefix = '' }: ChannelFormFieldsProps) {
  return (
    <div className="space-y-4">
      <ProfileInputField
        id={`${idPrefix}channelName`}
        label="Channel name"
        placeholder="e.g. Autodhun Music"
        required
        error={errors.channelName?.message ? String(errors.channelName.message) : undefined}
        {...register('channelName')}
      />
      <ProfileInputField
        id={`${idPrefix}channelLink`}
        label="Existing channel link"
        placeholder="https://..."
        required
        error={errors.channelLink?.message ? String(errors.channelLink.message) : undefined}
        {...register('channelLink')}
      />
    </div>
  );
}
