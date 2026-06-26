import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

export const contentIdFormSchema = z.object({
  labelName: z
    .string()
    .trim()
    .min(1, 'Label name is required')
    .max(200, 'Label name must be at most 200 characters'),
  isrcCode: z
    .string()
    .trim()
    .min(1, 'ISRC is required')
    .max(20, 'ISRC must be at most 20 characters'),
});

export type ContentIdFormData = z.infer<typeof contentIdFormSchema>;

export function onContentIdFormInvalid(errors: FieldErrors<ContentIdFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
