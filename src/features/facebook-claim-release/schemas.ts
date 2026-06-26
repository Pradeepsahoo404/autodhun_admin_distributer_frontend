import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

export const LABEL_NAMES_MUST_MATCH_MESSAGE =
  'Sender and receiver label names must always be the same';

const normalizeLabel = (value: string) => value.trim().toLowerCase();

const labelField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(200, `${label} must be at most 200 characters`);

const claimReleaseFieldsSchema = z.object({
  senderLabelName: labelField('Sender label name'),
  receiverLabelName: labelField('Receiver label name'),
  facebookPageLink: z
    .string()
    .trim()
    .url('Enter a valid Facebook page link')
    .max(500)
    .refine((url) => /facebook\.com|fb\.com/i.test(url), 'Enter a valid Facebook page link'),
  isrcCode: z
    .string()
    .trim()
    .min(1, 'ISRC code is required')
    .max(20, 'ISRC code must be at most 20 characters'),
});

export const facebookClaimReleaseFormSchema = claimReleaseFieldsSchema.superRefine((data, ctx) => {
  if (normalizeLabel(data.senderLabelName) !== normalizeLabel(data.receiverLabelName)) {
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
  }
});

export type FacebookClaimReleaseFormData = z.infer<typeof claimReleaseFieldsSchema>;

export function onFacebookClaimReleaseFormInvalid(errors: FieldErrors<FacebookClaimReleaseFormData>) {
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
