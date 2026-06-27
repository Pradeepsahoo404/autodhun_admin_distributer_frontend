import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import {
  requiredInstagramHandle,
  requiredIsrcField,
  requiredTextField,
  requiredUrlField,
} from '@/lib/validation/fields';

const facebookPageLinkField = requiredUrlField('Facebook page link').refine(
  (url) => /facebook\.com|fb\.com/i.test(url),
  'Enter a valid Facebook page link',
);

export const profileLinkingFormSchema = z.object({
  labelName: requiredTextField('Label name'),
  isrcCode: requiredIsrcField(),
  facebookPageLink: facebookPageLinkField,
  instagramHandleName: requiredInstagramHandle(),
});

export type ProfileLinkingFormData = z.infer<typeof profileLinkingFormSchema>;

export function onProfileLinkingFormInvalid(errors: FieldErrors<ProfileLinkingFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
