import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { REFERENCE_OVERLAP_ASSET_TYPES } from '@/constants/referenceOverlap';

export const referenceOverlapFormSchema = z.object({
  otherParty: z.string().trim().min(1, 'Other party is required').max(200),
  assetName: z.string().trim().min(1, 'Asset name is required').max(200),
  assetType: z.enum(REFERENCE_OVERLAP_ASSET_TYPES, { message: 'Select asset type' }),
  isrcCode: z.string().trim().min(1, 'ISRC is required').max(20),
  overlappingAssetName: z.string().trim().min(1, 'Overlapping asset name is required').max(200),
  labelName: z.string().trim().min(1, 'Label is required').max(200),
  assignedTo: z.string().trim().min(1, 'Select an admin'),
});

export type ReferenceOverlapFormData = z.infer<typeof referenceOverlapFormSchema>;

export function onReferenceOverlapFormInvalid(errors: FieldErrors<ReferenceOverlapFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
