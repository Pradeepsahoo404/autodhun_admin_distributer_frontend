import { z } from 'zod';
import {
  optionalAddressField,
  optionalNameField,
  optionalTextField,
  requiredNameField,
} from '@/lib/validation/fields';

const optionalCode = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || pattern.test(value), message)
    .optional()
    .or(z.literal(''));

const permissionRowSchema = z.object({
  moduleId: z.string().min(1, 'Module is required'),
  canView: z.boolean(),
  canCreate: z.boolean(),
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
});

export const inviteAdminSchema = z.object({
  firstName: requiredNameField('First name'),
  lastName: optionalNameField('Last name'),
  email: z.string().trim().email('Enter a valid email'),
  personalMessage: z
    .string()
    .trim()
    .max(500, 'Message must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

export const inviteSubAdminSchema = inviteAdminSchema.extend({
  permissions: z
    .array(permissionRowSchema)
    .min(1, 'At least one module permission is required')
    .refine((rows) => rows.some((row) => row.canView), {
      message: 'At least one module must have View access',
    }),
});

export const updateSubAdminPermissionsSchema = z.object({
  permissions: z
    .array(permissionRowSchema)
    .min(1, 'At least one module permission is required')
    .refine((rows) => rows.some((row) => row.canView), {
      message: 'At least one module must have View access',
    }),
});

export const editUserSchema = z.object({
  firstName: requiredNameField('First name'),
  lastName: optionalNameField('Last name'),
  postalAddress: optionalAddressField('Postal address', 300),
  state: optionalTextField('State', 100),
  countryRegion: optionalTextField('Country / Region', 100),
  phoneNumber: z
    .string()
    .trim()
    .refine((value) => value === '' || /^\+?[0-9]{10,15}$/.test(value), 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  labelName: optionalTextField('Label name', 120),
  bankName: optionalTextField('Bank name', 120),
  accountNumber: optionalCode(/^\d{9,18}$/, 'Account number must be 9 to 18 digits'),
  ifscCode: optionalCode(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/, 'Enter a valid IFSC code'),
  swiftCode: optionalCode(/^[A-Za-z0-9]{8,11}$/, 'Enter a valid SWIFT code'),
  micrCode: optionalCode(/^\d{9}$/, 'MICR code must be 9 digits'),
});

export type InviteAdminFormData = z.infer<typeof inviteAdminSchema>;
export type InviteSubAdminFormData = z.infer<typeof inviteSubAdminSchema>;
export type UpdateSubAdminPermissionsFormData = z.infer<typeof updateSubAdminPermissionsSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
