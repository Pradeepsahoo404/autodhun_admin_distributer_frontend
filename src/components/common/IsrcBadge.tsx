import { isrcBadgeClass } from '@/components/common/dashboardTableStyles';

interface IsrcBadgeProps {
  value: string;
}

export function IsrcBadge({ value }: IsrcBadgeProps) {
  return <span className={isrcBadgeClass}>{value}</span>;
}
