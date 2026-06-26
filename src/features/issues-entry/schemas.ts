import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { ISSUES_ENTRY_ASSET_TYPES } from '@/constants/issuesEntry';

export const issuesEntryFormSchema = z.object({
  otherParty: z.string().trim().min(1, 'Other party is required').max(200),
  assetName: z.string().trim().min(1, 'Asset name is required').max(200),
  assetType: z.enum(ISSUES_ENTRY_ASSET_TYPES, { message: 'Select asset type' }),
  isrcCode: z.string().trim().min(1, 'ISRC is required').max(20),
  overlappingAssetName: z.string().trim().min(1, 'Overlapping asset name is required').max(200),
  labelName: z.string().trim().min(1, 'Label is required').max(200),
  assignedTo: z.string().trim().min(1, 'Select an admin'),
});

export type IssuesEntryFormData = z.infer<typeof issuesEntryFormSchema>;

export function onIssuesEntryFormInvalid(errors: FieldErrors<IssuesEntryFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
