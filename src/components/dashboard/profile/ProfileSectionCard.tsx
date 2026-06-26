import { Card, CardContent } from '@/components/ui/card';
import { DASHBOARD_CARD } from '@/constants';
import { cn } from '@/lib/utils';

interface ProfileSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/** Shared card shell used across General, Bank Details, and Change Password tabs. */
export function ProfileSectionCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: ProfileSectionCardProps) {
  return (
    <Card className={cn(DASHBOARD_CARD, className)}>
      <CardContent className={cn('p-6 pt-8 sm:p-8', contentClassName)}>
        <h2 className="text-[18px] font-semibold text-white">{title}</h2>
        {description ? <p className="mt-1 text-[13px] text-neutral-500">{description}</p> : null}
        {children}
      </CardContent>
    </Card>
  );
}
