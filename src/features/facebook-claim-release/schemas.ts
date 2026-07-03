import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import {
  requiredCatalogLabelField,
  requiredFacebookPageUrlField,
  requiredIsrcField,
} from '@/lib/validation/fields';

export const LABEL_NAMES_MUST_MATCH_MESSAGE =
  'Sender and receiver label names must always be the same';

const normalizeLabel = (value: string) => value.trim().toLowerCase();

const claimReleaseFieldsSchema = z.object({
  senderLabelName: requiredCatalogLabelField('Sender label name'),
  receiverLabelName: requiredCatalogLabelField('Receiver label name'),
  facebookPageLink: requiredFacebookPageUrlField('Facebook page link'),
  isrcCode: requiredIsrcField(),
});

export const claimReleaseFormSchema = claimReleaseFieldsSchema.superRefine((data, ctx) => {
  const sender = normalizeLabel(data.senderLabelName);
  const receiver = normalizeLabel(data.receiverLabelName);
  if (!sender || !receiver || sender === receiver) return;

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: LABEL_NAMES_MUST_MATCH_MESSAGE,
    path: ['senderLabelName'],
  });
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: LABEL_NAMES_MUST_MATCH_MESSAGE,
    path: ['receiverLabelName'],
  });
});

export const facebookClaimReleaseFormSchema = claimReleaseFormSchema;

export type ClaimReleaseFormData = z.infer<typeof claimReleaseFieldsSchema>;
export type FacebookClaimReleaseFormData = ClaimReleaseFormData;

export function onClaimReleaseFormInvalid(errors: FieldErrors<ClaimReleaseFormData>) {
  if (
    errors.senderLabelName?.message === LABEL_NAMES_MUST_MATCH_MESSAGE ||
    errors.receiverLabelName?.message === LABEL_NAMES_MUST_MATCH_MESSAGE
  ) {
    toast.error(LABEL_NAMES_MUST_MATCH_MESSAGE);
    return;
  }

  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}

export const onFacebookClaimReleaseFormInvalid = onClaimReleaseFormInvalid;
