'use client';

import { cn } from '@/lib/utils';
import {
  SUPPORT_TICKET_STATUS_LABELS,
  getSupportTicketStatusBadgeClass,
  type SupportTicketStatus,
} from '@/constants/supportTicket';

interface SupportTicketStatusBadgeProps {
  status: SupportTicketStatus;
  className?: string;
}

export function SupportTicketStatusBadge({ status, className }: SupportTicketStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-3 py-1 text-xs font-medium',
        getSupportTicketStatusBadgeClass(status),
        className,
      )}
    >
      {SUPPORT_TICKET_STATUS_LABELS[status]}
    </span>
  );
}
