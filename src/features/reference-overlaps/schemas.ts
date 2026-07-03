import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { REFERENCE_OVERLAP_ASSET_TYPES } from '@/constants/referenceOverlap';
import {
  requiredIsrcField,
  requiredSelectField,
  requiredTextField,
} from '@/lib/validation/fields';

export const referenceOverlapFormSchema = z.object({
  otherParty: requiredTextField('Other party'),
  assetName: requiredTextField('Asset name'),
  assetType: z.enum(REFERENCE_OVERLAP_ASSET_TYPES, { message: 'Select asset type' }),
  isrcCode: requiredIsrcField(),
  overlappingAssetName: requiredTextField('Overlapping asset name'),
  labelName: requiredSelectField('Select a label'),
  assignedTo: requiredSelectField('Select an admin'),
});

export type ReferenceOverlapFormData = z.infer<typeof referenceOverlapFormSchema>;

export function onReferenceOverlapFormInvalid(errors: FieldErrors<ReferenceOverlapFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
