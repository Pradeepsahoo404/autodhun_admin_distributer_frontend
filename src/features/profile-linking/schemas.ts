import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

const facebookPageLinkField = z
  .string()
  .trim()
  .url('Enter a valid Facebook page link')
  .max(500)
  .refine((url) => /facebook\.com|fb\.com/i.test(url), 'Enter a valid Facebook page link');

export const profileLinkingFormSchema = z.object({
  labelName: z
    .string()
    .trim()
    .min(1, 'Label name is required')
    .max(200, 'Label name must be at most 200 characters'),
  isrcCode: z
    .string()
    .trim()
    .min(1, 'ISRC code is required')
    .max(20, 'ISRC code must be at most 20 characters'),
  facebookPageLink: facebookPageLinkField,
  instagramHandleName: z
    .string()
    .trim()
    .min(1, 'Instagram handle name is required')
    .max(100, 'Instagram handle name must be at most 100 characters'),
});

export type ProfileLinkingFormData = z.infer<typeof profileLinkingFormSchema>;

export function onProfileLinkingFormInvalid(errors: FieldErrors<ProfileLinkingFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
