import { z } from 'zod';
import {
  requiredNameField,
  requiredSelectField,
  requiredCatalogLabelField,
  optionalNameField,
  optionalTextField,
} from '@/lib/validation/fields';
import {
  isPastApiDate,
  isTodayOrPastApiDate,
  isValidApiDate,
  isValidCrbtStartTime,
  minScheduledReleaseDate,
  tomorrowApiDate,
} from '@/lib/releaseDateTime';

const yesNoSchema = z.enum(['yes', 'no']);
const releaseTypeSchema = z.enum(['single', 'ep', 'album']);
const isrcOptionSchema = z.enum(['own', 'generate']);
const priceTierSchema = z.enum(['budget', 'back', 'mid', 'front', 'premium']);
const releasePlatformSchema = z.enum([
  'all-excluding-youtube',
  'all-including-youtube',
  'only-youtube',
  'only-meta-audio',
]);

const apiDateField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => isValidApiDate(value), `${label} must be a valid date`);

const optionalUpcField = z
  .string()
  .trim()
  .max(20, 'UPC must be at most 20 characters')
  .refine((value) => value === '' || /^\d+$/.test(value), 'UPC must contain numbers only')
  .optional()
  .or(z.literal(''));

const optionalLineField = optionalTextField('Line', 200);

const releaseInfoBase = {
  title: requiredNameField('Title', 200),
  version: optionalNameField('Version', 120),
  artist: requiredSelectField('Artist is required'),
  releaseType: releaseTypeSchema,
  releasingDate: apiDateField('Releasing date').refine(
    (value) => !isPastApiDate(value),
    'Releasing date cannot be in the past',
  ),
  label: requiredSelectField('Label is required'),
  instrumental: yesNoSchema,
  explicit: yesNoSchema,
  aiGenerated: yesNoSchema,
  upc: optionalUpcField,
  pLine: optionalLineField,
  cLine: optionalLineField,
};

export const releaseInformationSchema = z.object({
  ...releaseInfoBase,
  coverArt: z.custom<File | null>().refine((file) => file instanceof File, 'Cover art is required'),
});

export const uploadTracksSchema = z.object({
  audioFiles: z
    .array(
      z.object({
        file: z.custom<File | null>(),
        fileName: z.string(),
      }),
    )
    .refine((files) => files.some((f) => f.file instanceof File), 'Upload at least one audio file'),
});

const trackItemSchema = z
  .object({
    title: requiredNameField('Track title', 200),
    artist: requiredNameField('Artist', 120),
    lyrics: z.string().trim().max(5000).optional().or(z.literal('')),
    isrcOption: isrcOptionSchema,
    isrc: z.string().trim().max(20).optional().or(z.literal('')),
    composer: requiredNameField('Composer', 120),
    producer: requiredNameField('Producer', 120),
    director: requiredNameField('Director', 120),
    language: requiredCatalogLabelField('Language', 120),
    genre: requiredCatalogLabelField('Genre', 120),
    subGenre: requiredCatalogLabelField('Sub genre', 120),
    price: priceTierSchema,
  })
  .superRefine((track, ctx) => {
    if (track.isrcOption === 'own' && !track.isrc?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ISRC is required when using your own',
        path: ['isrc'],
      });
    }
  });

export const trackDetailsSchema = z.object({
  tracks: z.array(trackItemSchema).min(1),
});

const crbtEntrySchema = z.object({
  title: requiredNameField('CRBT title', 200),
  startTime: z
    .string()
    .trim()
    .min(1, 'Start time is required')
    .refine((value) => isValidCrbtStartTime(value), 'Start time must be valid (HH:MM:SS, e.g. 00:00:00)'),
});

export const crbtSchema = z.object({
  crbtEntries: z.array(crbtEntrySchema).length(1),
});

export const scheduleReleaseSchema = z
  .object({
    releasingDate: z.string().optional(),
    scheduledReleaseDate: apiDateField('Scheduled release date'),
  })
  .superRefine((data, ctx) => {
    if (isTodayOrPastApiDate(data.scheduledReleaseDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Scheduled release date must be a future date',
        path: ['scheduledReleaseDate'],
      });
    }

    if (
      data.releasingDate &&
      isValidApiDate(data.releasingDate) &&
      isValidApiDate(data.scheduledReleaseDate) &&
      data.scheduledReleaseDate < data.releasingDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Scheduled release date cannot be before releasing date',
        path: ['scheduledReleaseDate'],
      });
    }
  });

export const finalReviewSchema = z.object({
  releasePlatform: releasePlatformSchema,
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

export const releaseInformationEditSchema = z
  .object({
    ...releaseInfoBase,
    coverArt: z.custom<File | null>().nullable(),
    coverArtPreview: z.string().nullable().optional(),
  })
  .refine((data) => data.coverArt instanceof File || Boolean(data.coverArtPreview), {
    message: 'Cover art is required',
    path: ['coverArt'],
  });

export const uploadTracksEditSchema = z.object({
  audioFiles: z
    .array(
      z.object({
        file: z.custom<File | null>(),
        fileName: z.string(),
      }),
    )
    .refine(
      (files) => files.some((f) => f.file instanceof File || f.fileName.trim().length > 0),
      'At least one audio file is required',
    ),
});

/** Field paths cleared when validating each wizard step. */
export const STEP_ERROR_PATHS: Record<number, string[]> = {
  1: [
    'title',
    'version',
    'artist',
    'releaseType',
    'releasingDate',
    'label',
    'instrumental',
    'explicit',
    'aiGenerated',
    'upc',
    'pLine',
    'cLine',
    'coverArt',
    'coverArtPreview',
  ],
  2: ['audioFiles'],
  3: ['tracks'],
  4: ['crbtEntries'],
  5: ['scheduledReleaseDate'],
  6: ['releasePlatform', 'termsAccepted'],
};

export { tomorrowApiDate, minScheduledReleaseDate };
