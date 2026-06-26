import { UserRound } from 'lucide-react';
import { adminBadgeClass } from '@/components/common/dashboardTableStyles';

interface AdminBadgeProps {
  name?: string;
}

export function AdminBadge({ name }: AdminBadgeProps) {
  if (!name) return <span className="text-neutral-600">—</span>;

  return (
    <span className={`${adminBadgeClass} items-center gap-1`}>
      <UserRound className="h-3 w-3 shrink-0 text-neutral-500" aria-hidden />
      {name}
    </span>
  );
}
