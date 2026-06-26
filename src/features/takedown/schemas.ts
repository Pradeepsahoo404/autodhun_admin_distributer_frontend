import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

export const takedownFormSchema = z.object({
  labelName: z
    .string()
    .trim()
    .min(1, 'Label name is required')
    .max(200, 'Label name must be at most 200 characters'),
  isrcCode: z
    .string()
    .trim()
    .min(1, 'ISRC code is required')
    .max(20, 'ISRC code must be at most 20 characters'),
  songLink: z
    .string()
    .trim()
    .url('Enter a valid song link')
    .max(500),
});

export type TakedownFormData = z.infer<typeof takedownFormSchema>;

export function onTakedownFormInvalid(errors: FieldErrors<TakedownFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
