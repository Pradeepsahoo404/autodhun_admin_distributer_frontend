import { z } from 'zod';

export const cronjobSettingsSchema = z.object({
  retentionDays: z.coerce
    .number({ invalid_type_error: 'Enter a valid number of days' })
    .int('Days must be a whole number')
    .min(1, 'Minimum 1 day')
    .max(3650, 'Maximum 3650 days'),
  enabled: z.boolean(),
});

export type CronjobSettingsFormData = z.infer<typeof cronjobSettingsSchema>;
