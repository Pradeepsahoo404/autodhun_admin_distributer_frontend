export type LegalModuleStatus = 'in_progress' | 'active' | 'inactive';

export type LegalModuleStatusFilter = 'all' | LegalModuleStatus;

export const LEGAL_MODULE_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Deactive' },
] as const;

export const LEGAL_MODULE_SUPER_ADMIN_STATUS_OPTIONS = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Deactive' },
] as const;

export function getLegalModuleStatusLabel(status: string): string {
  if (status === 'in_progress') return 'In Progress';
  if (status === 'active') return 'Active';
  return 'Deactive';
}
