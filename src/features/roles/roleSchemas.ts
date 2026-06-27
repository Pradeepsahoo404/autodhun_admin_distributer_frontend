import { z } from 'zod';
import { optionalRoleDescription, requiredRoleName } from '@/lib/validation/fields';

export const createRoleSchema = z.object({
  name: requiredRoleName(),
  description: optionalRoleDescription(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const editRoleSchema = z.object({
  name: requiredRoleName(),
  description: optionalRoleDescription(),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type EditRoleFormData = z.infer<typeof editRoleSchema>;
