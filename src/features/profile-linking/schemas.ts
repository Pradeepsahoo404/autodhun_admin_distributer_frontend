import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';
import {
  requiredCatalogLabelField,
  requiredFacebookPageUrlField,
  requiredInstagramHandle,
  requiredIsrcField,
} from '@/lib/validation/fields';

export const profileLinkingFormSchema = z.object({
  labelName: requiredCatalogLabelField('Label name'),
  isrcCode: requiredIsrcField(),
  facebookPageLink: requiredFacebookPageUrlField('Facebook page link'),
  instagramHandleName: requiredInstagramHandle(),
});

export type ProfileLinkingFormData = z.infer<typeof profileLinkingFormSchema>;

export function onProfileLinkingFormInvalid(errors: FieldErrors<ProfileLinkingFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
