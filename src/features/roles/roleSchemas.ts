import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, 'Role name is required').max(50),
  description: z.string().trim().max(255).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const editRoleSchema = z.object({
  name: z.string().trim().min(2, 'Role name is required').max(50),
  description: z.string().trim().max(255).optional().or(z.literal('')),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type EditRoleFormData = z.infer<typeof editRoleSchema>;
