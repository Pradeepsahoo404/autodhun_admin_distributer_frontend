import { z } from 'zod';
import {
  ALL_SUPPORT_TICKET_CATEGORIES,
  ALL_SUPPORT_TICKET_ISSUE_TYPES,
  isValidSupportTicketIssueTypeForCategory,
  type SupportTicketCategory,
  type SupportTicketIssueType,
} from '@/constants/supportTicket';

const categoryField = z.enum(
  ALL_SUPPORT_TICKET_CATEGORIES as unknown as [SupportTicketCategory, ...SupportTicketCategory[]],
  { required_error: 'Please select an issue category' },
);
const issueTypeField = z.enum(
  ALL_SUPPORT_TICKET_ISSUE_TYPES as unknown as [SupportTicketIssueType, ...SupportTicketIssueType[]],
  { required_error: 'Please select an issue type' },
);

const descriptionField = z
  .string({ required_error: 'Description is required' })
  .trim()
  .min(10, 'Description must be at least 10 characters')
  .max(5000, 'Description must be at most 5000 characters');

const categoryIssueRefine = (data: { category: SupportTicketCategory; issueType: SupportTicketIssueType }) =>
  isValidSupportTicketIssueTypeForCategory(data.category, data.issueType);

export const supportTicketFormSchema = z
  .object({
    category: categoryField,
    issueType: issueTypeField,
    description: descriptionField,
  })
  .refine(categoryIssueRefine, {
    message: 'Issue type does not match the selected category',
    path: ['issueType'],
  });

export type SupportTicketFormData = z.infer<typeof supportTicketFormSchema>;

export const supportTicketStatusFormSchema = z.object({
  status: z.enum(['open', 'resolved']),
  resolutionNote: z.string().trim().max(2000).optional(),
});

export type SupportTicketStatusFormData = z.infer<typeof supportTicketStatusFormSchema>;
