'use client';

import { TableSelectField } from '@/components/common/TableSelectField';
import {
  MUSIC_RELEASE_STATUS_OPTIONS,
  type MusicReleaseStatus,
} from '@/constants/musicReleaseStatus';

interface StatusOption {
  value: string;
  label: string;
}

interface ReleaseStatusSelectProps {
  value: MusicReleaseStatus;
  onChange: (value: MusicReleaseStatus) => void;
  disabled?: boolean;
  className?: string;
  options?: StatusOption[];
}

export function ReleaseStatusSelect({
  value,
  onChange,
  disabled,
  className,
  options = MUSIC_RELEASE_STATUS_OPTIONS,
}: ReleaseStatusSelectProps) {
  return (
    <TableSelectField
      value={value}
      onChange={(v) => onChange(v as MusicReleaseStatus)}
      options={options}
      disabled={disabled}
      className={className}
      aria-label="Release status"
    />
  );
}
