import { z } from 'zod';
import { passwordSchema } from '@/features/auth/schemas';
import {
  optionalNameField,
  requiredAddressField,
  requiredNameField,
  requiredTextField,
} from '@/lib/validation/fields';

const optionalCode = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || pattern.test(value), message)
    .optional()
    .or(z.literal(''));

export const generalProfileSchema = z.object({
  firstName: requiredNameField('First name'),
  lastName: optionalNameField('Last name'),
  postalAddress: requiredAddressField('Postal address', 300),
  state: requiredTextField('State', 100),
  countryRegion: requiredTextField('Country / Region', 100),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^\+?[0-9]{10,15}$/, 'Enter a valid phone number'),
  labelName: requiredTextField('Label name', 120),
});

const bankNameField = z
  .string()
  .trim()
  .min(1, 'Bank name is required')
  .max(120, 'Bank name must be at most 120 characters')
  .regex(/^[A-Za-z][A-Za-z\s.&'-]*$/, 'Bank name must contain only letters');

export const bankDetailsSchema = z.object({
  bankName: bankNameField,
  accountNumber: z
    .string()
    .trim()
    .min(1, 'Account number is required')
    .regex(/^\d{9,18}$/, 'Account number must be 9 to 18 digits'),
  ifscCode: z
    .string()
    .trim()
    .min(1, 'IFSC code is required')
    .regex(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/, 'Enter a valid IFSC code'),
  swiftCode: optionalCode(/^[A-Za-z0-9]{8,11}$/, 'Enter a valid SWIFT code'),
  micrCode: optionalCode(/^\d{9}$/, 'MICR code must be 9 digits'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type GeneralProfileFormData = z.infer<typeof generalProfileSchema>;
export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
