'use client';

import { useEffect } from 'react';
import type { FieldErrors, UseFormClearErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormFieldLabel } from '@/components/dashboard/profile/ProfileField';
import { TableSelectField } from '@/components/common/TableSelectField';
import {
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_CATEGORY_OPTIONS,
  getDefaultIssueTypeForCategory,
  getIssueTypeOptionsForCategory,
  isSupportTicketCategory,
  type SupportTicketCategory,
} from '@/constants/supportTicket';
import type { SupportTicketFormData } from '@/features/help-support/schemas';
import { cn } from '@/lib/utils';
import { tableControlClass } from '@/components/common/tableControls';

const fieldClass = cn(tableControlClass, 'w-full px-4');
const errorClass = 'text-xs text-red-400';

interface SupportTicketCategoryFieldsProps {
  watch: UseFormWatch<SupportTicketFormData>;
  setValue: UseFormSetValue<SupportTicketFormData>;
  clearErrors?: UseFormClearErrors<SupportTicketFormData>;
  errors: FieldErrors<SupportTicketFormData>;
  idPrefix?: string;
}

export function SupportTicketCategoryFields({
  watch,
  setValue,
  clearErrors,
  errors,
  idPrefix = '',
}: SupportTicketCategoryFieldsProps) {
  const rawCategory = watch('category');
  const selectedCategory = isSupportTicketCategory(rawCategory)
    ? rawCategory
    : SUPPORT_TICKET_CATEGORY.PAYMENT_AND_BILLING;
  const selectedIssueType = watch('issueType');
  const issueTypeOptions = getIssueTypeOptionsForCategory(selectedCategory);

  useEffect(() => {
    if (!isSupportTicketCategory(rawCategory)) {
      setValue('category', SUPPORT_TICKET_CATEGORY.PAYMENT_AND_BILLING, {
        shouldValidate: true,
      });
      return;
    }

    const validValues = issueTypeOptions.map((option) => option.value);
    if (!validValues.includes(selectedIssueType)) {
      setValue('issueType', getDefaultIssueTypeForCategory(selectedCategory), {
        shouldValidate: true,
      });
    }
  }, [rawCategory, selectedCategory, selectedIssueType, issueTypeOptions, setValue]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="min-w-0 space-y-2">
        <FormFieldLabel
          label="Select Issue Category"
          htmlFor={`${idPrefix}category`}
          required
        />
        <TableSelectField
          value={selectedCategory}
          onChange={(value) => {
            setValue('category', value as SupportTicketFormData['category'], {
              shouldDirty: true,
              shouldValidate: true,
            });
            clearErrors?.('category');
          }}
          options={SUPPORT_TICKET_CATEGORY_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          className="w-full min-w-0"
          aria-label="Select issue category"
        />
        {errors.category?.message ? (
          <p className={errorClass}>{String(errors.category.message)}</p>
        ) : null}
      </div>

      <div className="min-w-0 space-y-2">
        <FormFieldLabel label="Select Issue Type" htmlFor={`${idPrefix}issueType`} required />
        <TableSelectField
          value={selectedIssueType}
          onChange={(value) => {
            setValue('issueType', value as SupportTicketFormData['issueType'], {
              shouldDirty: true,
              shouldValidate: true,
            });
            clearErrors?.('issueType');
          }}
          options={issueTypeOptions}
          searchable
          searchPlaceholder="Search issue type..."
          className="w-full min-w-0"
          aria-label="Select issue type"
        />
        {errors.issueType?.message ? (
          <p className={errorClass}>{String(errors.issueType.message)}</p>
        ) : null}
      </div>
    </div>
  );
}

export const supportTicketFormFieldClass = fieldClass;
export const supportTicketFormErrorClass = errorClass;

export const defaultSupportTicketFormValues: SupportTicketFormData = {
  category: SUPPORT_TICKET_CATEGORY.PAYMENT_AND_BILLING,
  issueType: getDefaultIssueTypeForCategory(SUPPORT_TICKET_CATEGORY.PAYMENT_AND_BILLING),
  description: '',
};
