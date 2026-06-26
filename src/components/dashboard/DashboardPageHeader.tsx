import { cn } from '@/lib/utils';
import { DASHBOARD_PAGE_TITLE, DASHBOARD_PAGE_SUBTITLE } from '@/constants';

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Large page heading with title on the left and optional action on the right. */
export function DashboardPageHeader({ title, description, action, className }: DashboardPageHeaderProps) {
  return (
    <div className={cn('mb-10 border-b border-[#1a1a1a] pb-10', className)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1">
          <h1 className={DASHBOARD_PAGE_TITLE}>{title}</h1>
          {description ? <p className={DASHBOARD_PAGE_SUBTITLE}>{description}</p> : null}
        </div>
        {action ? <div className="shrink-0 sm:pt-2">{action}</div> : null}
      </div>
    </div>
  );
}
