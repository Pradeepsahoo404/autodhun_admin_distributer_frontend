'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, PanelLeftClose, PanelLeft } from 'lucide-react';
import { ProfileMenu } from '@/components/dashboard/ProfileMenu';
import { usePermission } from '@/hooks/usePermission';
import { useGetUnreadNotificationCountQuery } from '@/store/api';

interface HeaderProps {
  onSidebarToggle: () => void;
  desktopSidebarOpen: boolean;
  mobileSidebarOpen: boolean;
}

export function Header({ onSidebarToggle, desktopSidebarOpen, mobileSidebarOpen }: HeaderProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const { canView: canViewNotifications } = usePermission('notifications');
  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !canViewNotifications,
    pollingInterval: 30_000,
  });
  const unreadCount = unreadData?.data.count ?? 0;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const sidebarVisible = isDesktop ? desktopSidebarOpen : mobileSidebarOpen;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#141414] bg-brand-black px-4 sm:px-6 lg:h-16 lg:px-8">
      <button
        type="button"
        onClick={onSidebarToggle}
        className="inline-flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] p-2.5 text-neutral-300 transition-colors hover:border-neutral-600 hover:bg-[#1a1a1a] hover:text-white"
        aria-label={sidebarVisible ? 'Close sidebar' : 'Open sidebar'}
        title={sidebarVisible ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarVisible ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {canViewNotifications ? (
          <Link
            href="/dashboard/notifications"
            className="relative rounded-lg p-2.5 text-neutral-400 transition-colors hover:bg-[#141414] hover:text-white"
            aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-none text-black">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </Link>
        ) : null}
        <ProfileMenu />
      </div>
    </header>
  );
}
