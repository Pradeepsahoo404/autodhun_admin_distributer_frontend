'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Bell, Calendar, CheckCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/store/api';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { getLegalModuleStatusLabel } from '@/constants/legalModuleStatus';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE } from '@/constants';
import { formatRelativeTime, formatShortDate } from '@/lib/formatDateTime';
import { cn } from '@/lib/utils';
import type { Notification, PaginatedMeta } from '@/types';

const DEFAULT_PAGE_LIMIT = 15;

function statusBadgeClass(status: string): string {
  if (status === 'active') return 'border-green-500/25 bg-green-500/10 text-green-400';
  if (status === 'in_progress') return 'border-brand-purple/30 bg-brand-purple/10 text-brand-purple';
  return 'border-neutral-600/30 bg-neutral-500/10 text-neutral-400';
}

function getNotificationSubject(item: Notification): string {
  if (item.type === 'rights_entry_created') return 'New entry submitted';
  if (item.type === 'issues_entry_assigned') return 'New assignment';

  if (item.type === 'issues_ownership_updated') {
    const ownership = item.entrySummary?.ownership;
    if (ownership === 'yes') return 'Ownership · Yes';
    if (ownership === 'no') return 'Ownership · No';
    return 'Ownership updated';
  }

  const status = item.entrySummary?.status;
  if (status) return `Status · ${getLegalModuleStatusLabel(status)}`;

  return 'Status updated';
}

function getNotificationTypeLabel(type: Notification['type']): string {
  if (type === 'rights_entry_created') return 'New entry';
  if (type === 'rights_status_updated') return 'Status update';
  if (type === 'issues_entry_assigned') return 'Assigned';
  return 'Ownership update';
}

function NotificationItem({
  item,
  onOpen,
  isOpening,
}: {
  item: Notification;
  onOpen: (item: Notification) => void;
  isOpening: boolean;
}) {
  const isUnread = !item.readAt;
  const status = item.entrySummary?.status;
  const subject = getNotificationSubject(item);
  const typeLabel = getNotificationTypeLabel(item.type);
  const timestamp = item.updatedAt ?? item.createdAt;
  const ownership = item.entrySummary?.ownership;
  const displayStatus = status ?? (ownership ? `ownership:${ownership}` : undefined);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      disabled={isOpening}
      className={cn(
        'group relative w-full px-4 py-4 text-left transition-colors sm:px-5',
        isUnread ? 'bg-[#111111]/70 hover:bg-[#141414]' : 'hover:bg-[#111111]/50',
      )}
    >
      {isUnread ? (
        <span
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-white"
          aria-hidden
        />
      ) : null}

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-[15px] font-semibold leading-snug text-white">
            <span className="uppercase tracking-wide text-neutral-300">{item.moduleName}</span>
            <span className="mx-2 font-normal text-neutral-600">|</span>
            <span className="font-medium text-white">{subject}</span>
          </p>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {displayStatus ? (
              <span
                className={cn(
                  'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
                  ownership === 'yes'
                    ? 'border-green-500/25 bg-green-500/10 text-green-400'
                    : ownership === 'no'
                      ? 'border-red-500/25 bg-red-500/10 text-red-400'
                      : statusBadgeClass(displayStatus.replace('ownership:', '')),
                )}
              >
                {ownership === 'yes'
                  ? 'Yes'
                  : ownership === 'no'
                    ? 'No'
                    : getLegalModuleStatusLabel(displayStatus)}
              </span>
            ) : null}
            <span className="inline-flex rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-neutral-300 whitespace-nowrap">
              {typeLabel}
            </span>
            {isOpening ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-neutral-500" />
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
          <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{formatShortDate(item.createdAt)}</span>
          <span className="text-neutral-600">·</span>
          <span>Last updated {formatRelativeTime(timestamp)}</span>
          {item.actor?.name ? (
            <>
              <span className="text-neutral-600">·</span>
              <span>by {item.actor.name}</span>
            </>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [openingId, setOpeningId] = useState<string | null>(null);

  const { data, isLoading } = useGetNotificationsQuery({ page, limit });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data ?? [];
  const meta = useMemo(
    () => (data?.meta as PaginatedMeta | undefined) ?? { total: 0, page: 1, limit, totalPages: 1 },
    [data?.meta, limit],
  );

  const handleOpen = async (item: Notification) => {
    setOpeningId(item._id);
    try {
      if (!item.readAt) {
        await markRead(item._id).unwrap();
      }
      router.push(item.route);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setOpeningId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const result = await markAllRead().unwrap();
      if (result.data.count > 0) {
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardPageHeader title="Notifications" />

      <Card className="overflow-hidden border-[#1a1a1a] bg-[#0a0a0a]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[#141414] px-4 py-4 sm:px-6">
          <CardTitle className="text-base font-medium text-white">All notifications</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll || notifications.every((n) => n.readAt)}
            className="border-[#2a2a2a] bg-transparent text-neutral-300 hover:bg-[#141414] hover:text-white"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-neutral-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading notifications…
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500">
              <Bell className="mb-3 h-10 w-10 text-neutral-600" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#1a1a1a]">
                {notifications.map((item) => (
                  <NotificationItem
                    key={item._id}
                    item={item}
                    onOpen={handleOpen}
                    isOpening={openingId === item._id}
                  />
                ))}
              </div>
              <div className="border-t border-[#1a1a1a] px-4 py-4 sm:px-6">
                <DataPagination
                  meta={meta}
                  onPageChange={setPage}
                  onLimitChange={(value) => {
                    setLimit(value);
                    setPage(1);
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
