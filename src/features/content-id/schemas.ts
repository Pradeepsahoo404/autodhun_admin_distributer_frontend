import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { requiredIsrcField, requiredTextField } from '@/lib/validation/fields';

export const contentIdFormSchema = z.object({
  labelName: requiredTextField('Label name'),
  isrcCode: requiredIsrcField(),
});

export type ContentIdFormData = z.infer<typeof contentIdFormSchema>;

export function onContentIdFormInvalid(errors: FieldErrors<ContentIdFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
