import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { requiredTextField, requiredUrlField } from '@/lib/validation/fields';

export const allowlistFormSchema = z.object({
  labelName: requiredTextField('Label name'),
  channelLink: requiredUrlField('Channel link'),
});

export type AllowlistFormData = z.infer<typeof allowlistFormSchema>;

export function onAllowlistFormInvalid(errors: FieldErrors<AllowlistFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
