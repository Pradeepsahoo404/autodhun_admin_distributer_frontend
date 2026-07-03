import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import {
  requiredCatalogLabelField,
  requiredIsrcField,
  requiredUrlField,
} from '@/lib/validation/fields';

export const manualClaimingFormSchema = z.object({
  labelName: requiredCatalogLabelField('Label name'),
  originalSongLink: requiredUrlField('Original song link'),
  isrcCode: requiredIsrcField(),
  songLink: requiredUrlField('Song link'),
});

export type ManualClaimingFormData = z.infer<typeof manualClaimingFormSchema>;

export function onManualClaimingFormInvalid(errors: FieldErrors<ManualClaimingFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
