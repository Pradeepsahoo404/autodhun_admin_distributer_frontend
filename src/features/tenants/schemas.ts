import { z } from 'zod';

export const createTenantFormSchema = z.object({
  name: z.string().trim().min(2, 'Tenant name is required').max(120),
  slug: z
    .string()
    .trim()
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, 'Use lowercase letters, numbers, and hyphens')
    .optional()
    .or(z.literal('')),
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().max(80).optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email').toLowerCase(),
  password: z
    .string()
    .trim()
    .refine((v) => !v || v.length >= 8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateTenantFormData = z.infer<typeof createTenantFormSchema>;
