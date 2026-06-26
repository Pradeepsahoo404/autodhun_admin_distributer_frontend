import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

const linkField = (label: string) =>
  z
    .string()
    .trim()
    .url(`Enter a valid ${label}`)
    .max(500);

export const oacFormSchema = z.object({
  artistChannelName: z
    .string()
    .trim()
    .min(1, 'Artist channel name is required')
    .max(200, 'Artist channel name must be at most 200 characters'),
  artistChannelLink: linkField('artist channel link'),
  artistChannelTopicLink: linkField('artist channel topic link'),
  isrcCode: z
    .string()
    .trim()
    .min(1, 'ISRC code is required')
    .max(20, 'ISRC code must be at most 20 characters'),
});

export type OacFormData = z.infer<typeof oacFormSchema>;

export function onOacFormInvalid(errors: FieldErrors<OacFormData>) {
  const firstError = Object.values(errors).find((error) => error?.message);
  if (firstError?.message) {
    toast.error(String(firstError.message));
  }
}
