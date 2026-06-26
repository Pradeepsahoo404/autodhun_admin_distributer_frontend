'use client';

import { useGetDashboardQuery } from '@/store/api';
import { DashboardCardGrid } from '@/components/dashboard/DashboardCardGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DASHBOARD_PAGE } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardQuery(undefined, { refetchOnMountOrArgChange: true });
  const dashboard = data?.data;

  const currency = dashboard?.currency === 'INR' ? '₹' : '$';
  const earnings = dashboard?.earnings ?? 0;
  const cards = dashboard?.cards ?? [];
  const quickActions = dashboard?.quickActions ?? [];
  const rightsManagerAnalytics = dashboard?.rightsManagerAnalytics ?? null;
  const issuesAnalytics = dashboard?.issuesAnalytics ?? null;

  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardPageHeader title="Dashboard" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-[400px] animate-pulse rounded-2xl border border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_top_right,rgba(163,255,18,0.1),transparent_60%)] xl:row-span-2" />
          <div className="h-[300px] animate-pulse rounded-2xl border border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_right,rgba(139,127,240,0.12),transparent_60%)]" />
          <div className="h-[280px] animate-pulse rounded-2xl border border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,127,240,0.15),transparent_60%)]" />
          <div className="h-[200px] animate-pulse rounded-2xl border border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_bottom_left,rgba(163,255,18,0.08),transparent_60%)]" />
          <div className="h-[420px] animate-pulse rounded-2xl border border-[#222222] bg-[#111111] xl:row-span-2" />
          <div className="h-[220px] animate-pulse rounded-2xl border border-[#222222] bg-[#111111]" />
        </div>
      ) : (
        <div className="space-y-8">
          {cards.length > 0 ? (
            <DashboardCardGrid
              cards={cards}
              currency={currency}
              earnings={earnings}
              rightsManagerAnalytics={rightsManagerAnalytics}
              issuesAnalytics={issuesAnalytics}
            />
          ) : (
            <p className="rounded-2xl border border-[#222222] bg-[#111111] p-8 text-center text-sm text-neutral-500">
              No dashboard widgets available for your role yet.
            </p>
          )}

          <QuickActions actions={quickActions} />
        </div>
      )}
    </div>
  );
}
