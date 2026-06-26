import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

const linkField = (label: string) =>
  z
    .string()
    .trim()
    .url(`Enter a valid ${label}`)
    .max(500);

export const manualClaimingFormSchema = z.object({
  labelName: z
    .string()
    .trim()
    .min(1, 'Label name is required')
    .max(200, 'Label name must be at most 200 characters'),
  originalSongLink: linkField('original song link'),
  isrcCode: z
    .string()
    .trim()
    .min(1, 'ISRC code is required')
    .max(20, 'ISRC code must be at most 20 characters'),
  songLink: linkField('song link'),
});

export type ManualClaimingFormData = z.infer<typeof manualClaimingFormSchema>;

export function onManualClaimingFormInvalid(errors: FieldErrors<ManualClaimingFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
