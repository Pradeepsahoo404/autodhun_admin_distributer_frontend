'use client';

import { useMemo } from 'react';
import { TableSelectField } from '@/components/common/TableSelectField';
import { FormFieldLabel } from '@/components/dashboard/profile/ProfileField';
import { useGetReleaseLabelsQuery } from '@/store/api';

interface ReleaseLabelSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  inModal?: boolean;
  fieldLabel?: string;
  selectPlaceholder?: string;
}

/** Searchable label picker backed by release-catalog labels (select only, no create). */
export function ReleaseLabelSelect({
  value,
  onChange,
  error,
  disabled,
  inModal = true,
  fieldLabel = 'Label',
  selectPlaceholder,
}: ReleaseLabelSelectProps) {
  const { data, isLoading } = useGetReleaseLabelsQuery({ limit: 200 });

  const options = useMemo(() => {
    const names = (data?.data ?? []).map((item) => item.name);
    const uniqueNames = [...new Set(names)].sort((a, b) => a.localeCompare(b));

    return [
      {
        value: '',
        label: selectPlaceholder ?? (isLoading ? 'Loading labels...' : '- Select a label -'),
      },
      ...uniqueNames.map((name) => ({ value: name, label: name })),
    ];
  }, [data?.data, isLoading, selectPlaceholder]);

  return (
    <div className="min-w-0 space-y-2">
      <FormFieldLabel label={fieldLabel} required />
      <TableSelectField
        value={value}
        onChange={onChange}
        options={options}
        className="w-full min-w-0"
        searchable
        searchPlaceholder="Search labels..."
        inModal={inModal}
        disabled={disabled || isLoading}
        aria-label="Label"
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
