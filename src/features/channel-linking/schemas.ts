import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { requiredChannelNameField, requiredUrlField } from '@/lib/validation/fields';
import { CHANNEL_LINKING_MIN_REVENUE_USD } from '@/constants/channelLinkingStatus';

const channelLinkingFieldsSchema = z.object({
  channelLink: requiredUrlField('Channel link'),
  channelName: requiredChannelNameField(),
  totalRevenue90Days: z.coerce
    .number({ invalid_type_error: 'Total revenue must be a number' })
    .min(0, 'Total revenue cannot be negative'),
  totalViews90Days: z.coerce
    .number({ invalid_type_error: 'Total views must be a number' })
    .int('Total views must be a whole number')
    .min(0, 'Total views cannot be negative'),
});

export const channelLinkingFormSchema = channelLinkingFieldsSchema;

export type ChannelLinkingFormData = z.infer<typeof channelLinkingFieldsSchema>;

export function onChannelLinkingFormInvalid(errors: FieldErrors<ChannelLinkingFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}

export function getLowRevenueWarning(revenue: number): string | null {
  if (revenue < CHANNEL_LINKING_MIN_REVENUE_USD) {
    return `Revenue is below $${CHANNEL_LINKING_MIN_REVENUE_USD}. This entry will be auto-rejected in a few minutes unless approved by Super Admin.`;
  }
  return null;
}
