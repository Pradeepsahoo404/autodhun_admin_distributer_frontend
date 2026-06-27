import { z } from 'zod';

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(50, `${label} must be at most 50 characters`);

const optionalNameField = (label: string) =>
  z
    .string()
    .trim()
    .max(50, `${label} must be at most 50 characters`)
    .optional()
    .or(z.literal(''));

const optionalTextField = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(''));

export const inviteAdminSchema = z.object({
  firstName: nameField('First name'),
  lastName: optionalNameField('Last name'),
  email: z.string().trim().email('Enter a valid email'),
  personalMessage: z
    .string()
    .trim()
    .max(500, 'Message must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

export const editUserSchema = z.object({
  firstName: nameField('First name'),
  lastName: optionalNameField('Last name'),
  postalAddress: optionalTextField(300),
  state: optionalTextField(100),
  countryRegion: optionalTextField(100),
  phoneNumber: z
    .string()
    .trim()
    .refine((value) => value === '' || /^\+?[0-9]{10,15}$/.test(value), 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  labelName: optionalTextField(120),
  bankName: optionalTextField(120),
  accountNumber: optionalTextField(18),
  ifscCode: optionalTextField(11),
  swiftCode: optionalTextField(11),
  micrCode: optionalTextField(9),
});

export type InviteAdminFormData = z.infer<typeof inviteAdminSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
