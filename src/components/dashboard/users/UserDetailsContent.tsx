'use client';

import { UserAvatar } from '@/components/common/UserAvatar';
import { formatDateTime } from '@/lib/formatDateTime';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import type { UserDetailTab } from './UserDetailTabs';

function display(value?: string): string {
  return value?.trim() ? value : '—';
}

function statusLabel(status: string): string {
  if (status === 'active') return 'Active';
  if (status === 'inactive') return 'Inactive';
  if (status === 'blocked') return 'Blocked';
  return status;
}

function DetailField({
  label,
  value,
  multiline = false,
  className,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-500">{label}</p>
      <div
        className={cn(
          'rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4 py-3 text-[14px] leading-relaxed text-neutral-100 break-words',
          multiline ? 'min-h-[72px] whitespace-pre-wrap' : 'min-h-[44px] flex items-center',
        )}
      >
        {value}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-neutral-400">{children}</h4>
  );
}

export function UserDetailsHeader({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#1f1f1f] bg-gradient-to-b from-[#141414] to-[#0a0a0a] px-4 py-4 sm:flex-row sm:items-center sm:text-left">
      <div className="shrink-0 rounded-full bg-gradient-to-br from-brand-lime/80 via-brand-lime/40 to-brand-purple/70 p-[3px] shadow-[0_0_24px_rgba(163,255,18,0.12)]">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-[#0b0b0b] sm:h-[72px] sm:w-[72px]">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="h-full w-full text-2xl" />
        </div>
      </div>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-[17px] font-semibold text-white">{user.name}</p>
        <p className="mt-1 truncate text-[13px] text-neutral-400">{user.email}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="inline-flex rounded-full border border-[#2a2a2a] bg-[#111111] px-3 py-1 text-[12px] font-medium text-neutral-200">
            {user.role?.name ?? 'Admin'}
          </span>
          <span
            className={cn(
              'inline-flex rounded-full border px-3 py-1 text-[12px] font-medium',
              user.status === 'active'
                ? 'border-green-500/25 bg-green-500/10 text-green-400'
                : 'border-neutral-600/30 bg-neutral-500/10 text-neutral-400',
            )}
          >
            {statusLabel(user.status)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface UserDetailsContentProps {
  user: User;
  tab: UserDetailTab;
}

export function UserDetailsContent({ user, tab }: UserDetailsContentProps) {
  if (tab === 'bank') {
    return (
      <div className="space-y-5">
        <SectionTitle>Bank details</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Bank name" value={display(user.bankDetails?.bankName)} className="sm:col-span-2" />
          <DetailField
            label="Account number"
            value={display(user.bankDetails?.accountNumber)}
            className="sm:col-span-2"
          />
          <DetailField label="IFSC code" value={display(user.bankDetails?.ifscCode)} />
          <DetailField label="SWIFT code" value={display(user.bankDetails?.swiftCode)} />
          <DetailField label="MICR code" value={display(user.bankDetails?.micrCode)} className="sm:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <SectionTitle>Personal information</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField label="First name" value={display(user.firstName)} />
          <DetailField label="Last name" value={display(user.lastName)} />
          <DetailField label="Email" value={user.email} className="sm:col-span-2" />
          <DetailField
            label="Postal address"
            value={display(user.profile?.postalAddress)}
            multiline
            className="sm:col-span-2"
          />
          <DetailField label="State" value={display(user.profile?.state)} />
          <DetailField label="Country / Region" value={display(user.profile?.countryRegion)} />
          <DetailField label="Phone number" value={display(user.profile?.phoneNumber)} />
          <DetailField label="Label name" value={display(user.profile?.labelName)} />
        </div>
      </div>

      <div className="space-y-4 border-t border-[#1a1a1a] pt-6">
        <SectionTitle>Account activity</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Joined" value={user.createdAt ? formatDateTime(user.createdAt) : '—'} />
          <DetailField label="Last login" value={user.lastLogin ? formatDateTime(user.lastLogin) : '—'} />
          <DetailField label="Terms accepted" value={user.termsAccepted ? 'Yes' : 'No'} />
          <DetailField label="Email verified" value={user.emailVerified ? 'Yes' : 'No'} />
        </div>
      </div>
    </div>
  );
}
