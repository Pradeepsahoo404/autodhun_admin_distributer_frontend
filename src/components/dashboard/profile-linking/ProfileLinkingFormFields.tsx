'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ReleaseLabelSelect } from '@/components/common/ReleaseLabelSelect';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ProfileLinkingFormData } from '@/features/profile-linking/schemas';

interface ProfileLinkingFormFieldsProps {
  register: UseFormRegister<ProfileLinkingFormData>;
  errors: FieldErrors<ProfileLinkingFormData>;
  idPrefix?: string;
  labelName: string;
  onLabelNameChange: (value: string) => void;
}

export function ProfileLinkingFormFields({
  register,
  errors,
  idPrefix = '',
  labelName,
  onLabelNameChange,
}: ProfileLinkingFormFieldsProps) {
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
        label="ISRC code"
        placeholder="ISRC code"
        required
        error={errors.isrcCode?.message ? String(errors.isrcCode.message) : undefined}
        {...register('isrcCode')}
      />
      <ProfileInputField
        id={`${idPrefix}facebookPageLink`}
        label="Facebook page link"
        placeholder="https://facebook.com/..."
        required
        error={
          errors.facebookPageLink?.message ? String(errors.facebookPageLink.message) : undefined
        }
        {...register('facebookPageLink')}
      />
      <ProfileInputField
        id={`${idPrefix}instagramHandleName`}
        label="Instagram handle name"
        placeholder="@username"
        required
        error={
          errors.instagramHandleName?.message
            ? String(errors.instagramHandleName.message)
            : undefined
        }
        {...register('instagramHandleName')}
      />
    </div>
  );
}
