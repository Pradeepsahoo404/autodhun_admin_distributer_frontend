import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import { requiredIsrcField, requiredTextField, requiredUrlField } from '@/lib/validation/fields';

export const LABEL_NAMES_MUST_MATCH_MESSAGE =
  'Sender and receiver label names must always be the same';

const normalizeLabel = (value: string) => value.trim().toLowerCase();

const claimReleaseFieldsSchema = z.object({
  senderLabelName: requiredTextField('Sender label name'),
  receiverLabelName: requiredTextField('Receiver label name'),
  youtubeLink: requiredUrlField('YouTube link'),
  isrcCode: requiredIsrcField(),
});

export const claimReleaseFormSchema = claimReleaseFieldsSchema.superRefine((data, ctx) => {
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

export type ClaimReleaseFormData = z.infer<typeof claimReleaseFieldsSchema>;

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
