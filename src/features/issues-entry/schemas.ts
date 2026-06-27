import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { ISSUES_ENTRY_ASSET_TYPES } from '@/constants/issuesEntry';
import {
  requiredIsrcField,
  requiredSelectField,
  requiredTextField,
} from '@/lib/validation/fields';

export const issuesEntryFormSchema = z.object({
  otherParty: requiredTextField('Other party'),
  assetName: requiredTextField('Asset name'),
  assetType: z.enum(ISSUES_ENTRY_ASSET_TYPES, { message: 'Select asset type' }),
  isrcCode: requiredIsrcField(),
  overlappingAssetName: requiredTextField('Overlapping asset name'),
  labelName: requiredTextField('Label'),
  assignedTo: requiredSelectField('Select an admin'),
});

export type IssuesEntryFormData = z.infer<typeof issuesEntryFormSchema>;

export function onIssuesEntryFormInvalid(errors: FieldErrors<IssuesEntryFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
