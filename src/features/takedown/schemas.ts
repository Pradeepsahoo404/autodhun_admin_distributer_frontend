import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { requiredIsrcField, requiredTextField, requiredUrlField } from '@/lib/validation/fields';

export const takedownFormSchema = z.object({
  labelName: requiredTextField('Label name'),
  isrcCode: requiredIsrcField(),
  songLink: requiredUrlField('Song link'),
});

export type TakedownFormData = z.infer<typeof takedownFormSchema>;

export function onTakedownFormInvalid(errors: FieldErrors<TakedownFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
