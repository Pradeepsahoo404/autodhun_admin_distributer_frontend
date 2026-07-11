import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { requiredChannelNameField, requiredUrlField } from '@/lib/validation/fields';

const channelFieldsSchema = z.object({
  channelName: requiredChannelNameField(),
  channelLink: requiredUrlField('Existing channel link'),
});

export const channelFormSchema = channelFieldsSchema;

export type ChannelFormData = z.infer<typeof channelFieldsSchema>;

export function onChannelFormInvalid(errors: FieldErrors<ChannelFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
