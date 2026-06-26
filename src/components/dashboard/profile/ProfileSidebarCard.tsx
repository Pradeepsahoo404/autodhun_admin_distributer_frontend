'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DASHBOARD_CARD } from '@/constants';
import { EditableProfileAvatar } from '@/components/dashboard/EditableProfileAvatar';
import { useAppSelector } from '@/hooks/useAppStore';

const formatRole = (role?: string): string =>
  role
    ? role
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '';

/** Shared left profile summary — visible on General, Bank Details, and Change Password tabs. */
export function ProfileSidebarCard() {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <Card className={`${DASHBOARD_CARD} h-fit xl:sticky xl:top-6`}>
      <CardContent className="flex flex-col items-center p-6 pt-8 text-center">
        <EditableProfileAvatar />
        <p className="mt-4 text-[16px] font-semibold text-white">{user?.name}</p>
        <p className="mt-1 max-w-full truncate text-[13px] text-neutral-500">{user?.email}</p>
        <p className="mt-3 rounded-full border border-[#252525] bg-[#0d0d0d] px-3 py-1 text-[12px] font-medium text-neutral-400">
          {formatRole(user?.role)}
        </p>
      </CardContent>
    </Card>
  );
}
