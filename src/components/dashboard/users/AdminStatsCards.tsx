'use client';

import { Loader2, UserPlus } from 'lucide-react';
import { useGetAdminCreationStatsQuery } from '@/store/api';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  accent?: 'lime' | 'purple';
}

function StatCard({ label, value, accent = 'lime' }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-500">{label}</p>
          <p
            className={cn(
              'mt-2 font-sans text-3xl font-bold leading-none',
              accent === 'lime' ? 'text-brand-lime' : 'text-brand-purple',
            )}
          >
            {value}
          </p>
          <p className="mt-1.5 text-[12px] text-neutral-500">Admins created</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1f1f1f] bg-[#111111]">
          <UserPlus className="h-4 w-4 text-neutral-400" />
        </div>
      </div>
    </article>
  );
}

export function AdminStatsCards() {
  const { data, isLoading } = useGetAdminCreationStatsQuery();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] py-10">
        <Loader2 className="h-5 w-5 animate-spin text-brand-lime" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Last 7 days" value={stats.last7Days} accent="lime" />
      <StatCard label="Last 30 days" value={stats.last30Days} accent="purple" />
      <StatCard label="Last 90 days" value={stats.last90Days} accent="lime" />
      <StatCard label="Last year" value={stats.last365Days} accent="purple" />
    </div>
  );
}
