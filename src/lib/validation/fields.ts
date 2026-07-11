import { z } from 'zod';

export const LETTERS_ONLY_PATTERN = /^[A-Za-z\s.'-]+$/;
export const LETTERS_ONLY_MESSAGE =
  'Only letters and spaces are allowed (no numbers or special characters)';

export const ADDRESS_PATTERN = /^[A-Za-z0-9\s.,#'/-]+$/;
export const ADDRESS_MESSAGE =
  'Address may contain letters, numbers, spaces, and basic punctuation only';

export const ISRC_PATTERN = /^[A-Za-z0-9-]+$/;
export const ISRC_MESSAGE = 'ISRC must contain only letters, numbers, and hyphens';

export const INSTAGRAM_HANDLE_PATTERN = /^[A-Za-z._-]+$/;
export const INSTAGRAM_HANDLE_MESSAGE =
  'Instagram handle may contain only letters, dots, underscores, and hyphens';

export const ROLE_DESCRIPTION_PATTERN = /^[A-Za-z0-9\s.,!?'()-]*$/;
export const ROLE_DESCRIPTION_MESSAGE =
  'Description may contain only letters, numbers, spaces, and basic punctuation';

export function requiredTextField(label: string, max = 200) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`)
    .regex(LETTERS_ONLY_PATTERN, LETTERS_ONLY_MESSAGE);
}

export function optionalTextField(label: string, max = 200) {
  return z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .refine((value) => value === '' || LETTERS_ONLY_PATTERN.test(value), LETTERS_ONLY_MESSAGE)
    .optional()
    .or(z.literal(''));
}

export function requiredNameField(label: string, max = 50) {
  return requiredTextField(label, max);
}

export function optionalNameField(label: string, max = 50) {
  return optionalTextField(label, max);
}

export function requiredAddressField(label: string, max = 300) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`)
    .regex(ADDRESS_PATTERN, ADDRESS_MESSAGE);
}

export function optionalAddressField(label: string, max = 300) {
  return z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .refine((value) => value === '' || ADDRESS_PATTERN.test(value), ADDRESS_MESSAGE)
    .optional()
    .or(z.literal(''));
}

export function requiredIsrcField(max = 20) {
  return z
    .string()
    .trim()
    .min(1, 'ISRC is required')
    .max(max, `ISRC must be at most ${max} characters`)
    .regex(ISRC_PATTERN, ISRC_MESSAGE);
}

export function requiredUrlField(label: string, max = 500) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .url(`Enter a valid ${label.toLowerCase()}`)
    .max(max, `${label} must be at most ${max} characters`);
}

export function requiredInstagramHandle(max = 100) {
  return z
    .string()
    .trim()
    .min(1, 'Instagram handle name is required')
    .max(max, `Instagram handle name must be at most ${max} characters`)
    .regex(INSTAGRAM_HANDLE_PATTERN, INSTAGRAM_HANDLE_MESSAGE);
}

export function requiredRoleName() {
  return z
    .string()
    .trim()
    .min(2, 'Role name is required')
    .max(50, 'Role name must be at most 50 characters')
    .regex(LETTERS_ONLY_PATTERN, LETTERS_ONLY_MESSAGE);
}

export function optionalRoleDescription() {
  return z
    .string()
    .trim()
    .max(255, 'Description must be at most 255 characters')
    .refine((value) => value === '' || ROLE_DESCRIPTION_PATTERN.test(value), ROLE_DESCRIPTION_MESSAGE)
    .optional()
    .or(z.literal(''));
}

export function requiredSelectField(message: string) {
  return z.string().trim().min(1, message);
}

export const CHANNEL_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s.,'"&()_@#:!|/-]*$/u;
export const CHANNEL_NAME_MESSAGE =
  "Channel name must start with a letter or number and can only contain letters, numbers, spaces and . , ' \" & ( ) _ @ # : ! | / -";

export function requiredChannelNameField(max = 100) {
  return z
    .string()
    .trim()
    .min(2, 'Channel name must be at least 2 characters')
    .max(max, `Channel name must be at most ${max} characters`)
    .regex(CHANNEL_NAME_PATTERN, CHANNEL_NAME_MESSAGE);
}

export const YOUTUBE_URL_MESSAGE = 'Enter a valid YouTube link';
export const FACEBOOK_PAGE_URL_MESSAGE = 'Enter a valid Facebook page link';

export function isYoutubeUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return /(?:^|\.)youtube\.com$/i.test(hostname) || /^youtu\.be$/i.test(hostname);
  } catch {
    return false;
  }
}

export function isFacebookPageUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return /(?:^|\.)facebook\.com$/i.test(hostname) || /(?:^|\.)fb\.com$/i.test(hostname);
  } catch {
    return false;
  }
}

export function requiredYoutubeUrlField(label: string, max = 500) {
  return requiredUrlField(label, max).refine(isYoutubeUrl, YOUTUBE_URL_MESSAGE);
}

export function requiredFacebookPageUrlField(label: string, max = 500) {
  return requiredUrlField(label, max).refine(isFacebookPageUrl, FACEBOOK_PAGE_URL_MESSAGE);
}

export function requiredCatalogLabelField(label: string, max = 200) {
  return z
    .string()
    .trim()
    .min(1, `Select ${label.toLowerCase()}`)
    .max(max, `${label} must be at most ${max} characters`);
}
