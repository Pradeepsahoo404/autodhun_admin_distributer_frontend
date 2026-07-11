'use client';

import { Loader2 } from 'lucide-react';
import { TableSelectField } from '@/components/common/TableSelectField';
import {
  CHANNEL_LINKING_SUPER_ADMIN_STATUS_OPTIONS,
  type ChannelLinkingStatus,
} from '@/constants/channelLinkingStatus';

interface ChannelLinkingStatusSelectProps {
  value: ChannelLinkingStatus;
  disabled?: boolean;
  loading?: boolean;
  onChange: (status: ChannelLinkingStatus) => void;
  'aria-label'?: string;
}

export function ChannelLinkingStatusSelect({
  value,
  disabled,
  loading,
  onChange,
  'aria-label': ariaLabel = 'Change linking status',
}: ChannelLinkingStatusSelectProps) {
  if (loading) {
    return (
      <div className="flex h-9 w-[130px] items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-brand-lime" aria-label="Updating status" />
      </div>
    );
  }

  return (
    <TableSelectField
      value={value}
      onChange={(next) => onChange(next as ChannelLinkingStatus)}
      options={[...CHANNEL_LINKING_SUPER_ADMIN_STATUS_OPTIONS]}
      className="min-w-[130px]"
      aria-label={ariaLabel}
      disabled={disabled}
    />
  );
}
