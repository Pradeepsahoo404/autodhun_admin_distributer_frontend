import { z } from 'zod';
import {
  ISRC_MESSAGE,
  ISRC_PATTERN,
  requiredNameField,
  requiredSelectField,
  optionalNameField,
  optionalTextField,
} from '@/lib/validation/fields';
import {
  isPastApiDate,
  isPastTimeForToday,
  isValidApiDate,
  minScheduledReleaseDate,
  parseTimeToMinutes,
  todayApiDate,
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
    composer: optionalNameField('Composer', 120),
    producer: optionalNameField('Producer', 120),
    director: optionalNameField('Director', 120),
    language: optionalNameField('Language', 80),
    genre: optionalNameField('Genre', 80),
    subGenre: optionalNameField('Sub genre', 80),
    price: priceTierSchema,
  })
  .superRefine((track, ctx) => {
    if (track.isrcOption === 'own') {
      if (!track.isrc?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ISRC is required when using your own',
          path: ['isrc'],
        });
        return;
      }
      if (!ISRC_PATTERN.test(track.isrc.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: ISRC_MESSAGE,
          path: ['isrc'],
        });
      }
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
    .refine((value) => parseTimeToMinutes(value) !== null, 'Start time must be valid (HH:mm)'),
});

export const crbtSchema = z
  .object({
    releasingDate: z.string().optional(),
    crbtEntries: z.array(crbtEntrySchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (data.releasingDate === todayApiDate()) {
      data.crbtEntries.forEach((entry, index) => {
        if (isPastTimeForToday(entry.startTime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Start time cannot be in the past when releasing today',
            path: ['crbtEntries', index, 'startTime'],
          });
        }
      });
    }
  });

export const scheduleReleaseSchema = z
  .object({
    releasingDate: z.string().optional(),
    scheduledReleaseDate: apiDateField('Scheduled release date'),
  })
  .superRefine((data, ctx) => {
    if (isPastApiDate(data.scheduledReleaseDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Scheduled release date cannot be in the past',
        path: ['scheduledReleaseDate'],
      });
    }

    if (data.releasingDate && isValidApiDate(data.releasingDate) && isValidApiDate(data.scheduledReleaseDate)) {
      const minDate = minScheduledReleaseDate(data.releasingDate);
      if (data.scheduledReleaseDate < minDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Scheduled release date cannot be before releasing date',
          path: ['scheduledReleaseDate'],
        });
      }
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
