'use client';

import { Loader2 } from 'lucide-react';
import { TableSelectField } from '@/components/common/TableSelectField';
import {
  LEGAL_MODULE_SUPER_ADMIN_STATUS_OPTIONS,
  type LegalModuleStatus,
} from '@/constants/legalModuleStatus';

interface LegalModuleStatusSelectProps {
  value: LegalModuleStatus;
  disabled?: boolean;
  loading?: boolean;
  onChange: (status: 'active' | 'inactive') => void;
  'aria-label'?: string;
}

export function LegalModuleStatusSelect({
  value,
  disabled,
  loading,
  onChange,
  'aria-label': ariaLabel = 'Change entry status',
}: LegalModuleStatusSelectProps) {
  if (loading) {
    return (
      <div className="flex h-9 w-[130px] items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-brand-lime" aria-label="Updating status" />
      </div>
    );
  }

  const options =
    value === 'in_progress'
      ? [...LEGAL_MODULE_SUPER_ADMIN_STATUS_OPTIONS]
      : LEGAL_MODULE_SUPER_ADMIN_STATUS_OPTIONS.filter((option) => option.value !== 'in_progress');

  return (
    <TableSelectField
      value={value}
      onChange={(next) => {
        if (next === 'in_progress') return;
        onChange(next as 'active' | 'inactive');
      }}
      options={options}
      className="min-w-[130px]"
      aria-label={ariaLabel}
      disabled={disabled}
    />
  );
}
