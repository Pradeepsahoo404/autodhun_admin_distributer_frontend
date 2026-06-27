import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { requiredIsrcField, requiredTextField, requiredUrlField } from '@/lib/validation/fields';

export const oacFormSchema = z.object({
  artistChannelName: requiredTextField('Artist channel name'),
  artistChannelLink: requiredUrlField('Artist channel link'),
  artistChannelTopicLink: requiredUrlField('Artist channel topic link'),
  isrcCode: requiredIsrcField(),
});

export type OacFormData = z.infer<typeof oacFormSchema>;

export function onOacFormInvalid(errors: FieldErrors<OacFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
