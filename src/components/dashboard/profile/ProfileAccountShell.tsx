'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DASHBOARD_PAGE, PROFILE_PAGE_TITLE, ROUTES } from '@/constants';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { ProfileSidebarCard } from '@/components/dashboard/profile/ProfileSidebarCard';

interface ProfileAccountShellProps {
  children: React.ReactNode;
  /** General tab target — `/dashboard/settings` from Settings, `/dashboard/profile` from Profile menu */
  generalHref?: string;
}

export function ProfileAccountShell({
  children,
  generalHref = ROUTES.PROFILE,
}: ProfileAccountShellProps) {
  const pathname = usePathname();
  const { isSuperAdmin, canManagePassword } = useAuthAccount();

  const tabs = [
    { label: 'General', href: generalHref },
    ...(!isSuperAdmin ? [{ label: 'Bank Details', href: ROUTES.PROFILE_BANK_DETAILS }] : []),
    ...(canManagePassword
      ? [
          { label: 'Change Password', href: ROUTES.CHANGE_PASSWORD },
          { label: 'Forgot Password', href: ROUTES.PROFILE_FORGOT_PASSWORD },
        ]
      : []),
  ];

  const isGeneralActive =
    pathname === ROUTES.PROFILE || pathname === ROUTES.SETTINGS;

  return (
    <div className={DASHBOARD_PAGE}>
      <h1 className={PROFILE_PAGE_TITLE}>Profile</h1>

      <nav
        className="mt-8 flex gap-6 overflow-x-auto border-b border-[#1f1f1f] sm:gap-8"
        aria-label="Profile sections"
      >
        {tabs.map((tab) => {
          const isGeneralTab = tab.href === generalHref || tab.href === ROUTES.PROFILE;
          const active = isGeneralTab ? isGeneralActive : pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                '-mb-px shrink-0 border-b-2 pb-3 text-[15px] font-medium transition-colors',
                active
                  ? 'border-brand-lime text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,300px)_1fr]">
        <ProfileSidebarCard />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
