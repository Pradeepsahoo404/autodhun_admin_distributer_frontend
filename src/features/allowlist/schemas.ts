import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

export const allowlistFormSchema = z.object({
  labelName: z
    .string()
    .trim()
    .min(1, 'Label name is required')
    .max(200, 'Label name must be at most 200 characters'),
  channelLink: z
    .string()
    .trim()
    .url('Enter a valid channel link')
    .max(500),
});

export type AllowlistFormData = z.infer<typeof allowlistFormSchema>;

export function onAllowlistFormInvalid(errors: FieldErrors<AllowlistFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
