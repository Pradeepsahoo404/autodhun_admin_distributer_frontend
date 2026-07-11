'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import type { ChannelLinkingFormData } from '@/features/channel-linking/schemas';
import { getLowRevenueWarning } from '@/features/channel-linking/schemas';

interface ChannelLinkingFormFieldsProps {
  register: UseFormRegister<ChannelLinkingFormData>;
  errors: FieldErrors<ChannelLinkingFormData>;
  idPrefix?: string;
  revenueValue?: number;
}

export function ChannelLinkingFormFields({
  register,
  errors,
  idPrefix = '',
  revenueValue,
}: ChannelLinkingFormFieldsProps) {
  const lowRevenueWarning =
    revenueValue !== undefined && !Number.isNaN(revenueValue)
      ? getLowRevenueWarning(revenueValue)
      : null;

  return (
    <div className="space-y-4">
      <ProfileInputField
        id={`${idPrefix}channelLink`}
        label="Channel link"
        placeholder="https://..."
        required
        error={errors.channelLink?.message ? String(errors.channelLink.message) : undefined}
        {...register('channelLink')}
      />
      <ProfileInputField
        id={`${idPrefix}channelName`}
        label="Channel name"
        placeholder="e.g. Autodhun Music"
        required
        error={errors.channelName?.message ? String(errors.channelName.message) : undefined}
        {...register('channelName')}
      />
      <ProfileInputField
        id={`${idPrefix}totalRevenue90Days`}
        label="Total revenue in 90 days (USD)"
        placeholder="0.00"
        type="number"
        step="0.01"
        min="0"
        required
        error={
          errors.totalRevenue90Days?.message
            ? String(errors.totalRevenue90Days.message)
            : undefined
        }
        {...register('totalRevenue90Days')}
      />
      <ProfileInputField
        id={`${idPrefix}totalViews90Days`}
        label="Total views in 90 days"
        placeholder="0"
        type="number"
        step="1"
        min="0"
        required
        error={
          errors.totalViews90Days?.message ? String(errors.totalViews90Days.message) : undefined
        }
        {...register('totalViews90Days')}
      />
      {lowRevenueWarning ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-200">
          {lowRevenueWarning}
        </p>
      ) : null}
    </div>
  );
}
