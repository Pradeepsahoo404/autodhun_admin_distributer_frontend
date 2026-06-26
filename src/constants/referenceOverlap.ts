export const REFERENCE_OVERLAP_ASSET_TYPES = [
  'Track',
  'Album',
  'Music Video',
  'Composition',
  'Other',
] as const;

export const REFERENCE_OVERLAP_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Deactive' },
] as const;

export const REFERENCE_OVERLAP_OWNERSHIP_FILTER_OPTIONS = [
  { value: 'all', label: 'All ownership' },
  { value: 'pending', label: 'Pending' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const;

export function getReferenceOverlapOwnershipLabel(ownership: string): string {
  if (ownership === 'yes') return 'Yes';
  if (ownership === 'no') return 'No';
  return 'Pending';
}

export function getReferenceOverlapStatusLabel(status: string): string {
  return status === 'active' ? 'Active' : 'Deactive';
}
