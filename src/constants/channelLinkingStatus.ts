export type ChannelLinkingStatus = 'in_process' | 'approved' | 'rejected';

export type ChannelLinkingStatusFilter = 'all' | ChannelLinkingStatus;

export const CHANNEL_LINKING_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'in_process', label: 'In Process' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export const CHANNEL_LINKING_SUPER_ADMIN_STATUS_OPTIONS = [
  { value: 'in_process', label: 'In Process' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export function getChannelLinkingStatusLabel(status: string): string {
  if (status === 'in_process') return 'In Process';
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return status;
}

export const CHANNEL_LINKING_MIN_REVENUE_USD = 100;
