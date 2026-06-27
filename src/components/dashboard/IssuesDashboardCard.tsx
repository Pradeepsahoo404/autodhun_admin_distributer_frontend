'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightLeft,
  FileWarning,
  Gavel,
  GitMerge,
  Scale,
  Shield,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardCard, IssuesAnalytics } from '@/types';
import { DashboardLineChart } from '@/components/dashboard/DashboardLineChart';

type PeriodDays = 7 | 30;

const MODULE_ICONS: Record<string, LucideIcon> = {
  GitMerge,
  FileWarning,
  ArrowRightLeft,
  ShieldAlert,
  Scale,
  Gavel,
};

const BADGE_NEW =
  'rounded-md bg-brand-lime/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-lime';

const CARD_SHELL = cn(
  'font-sans flex w-full flex-col overflow-hidden rounded-2xl border transition-all duration-200',
  'border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_top_left,rgba(163,255,18,0.12),transparent_55%)] hover:border-brand-lime/25',
);

const PERIOD_TOGGLE_CLASS = (active: boolean) =>
  cn(
    'rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
    active
      ? 'bg-brand-lime text-black shadow-[0_0_12px_rgba(163,255,18,0.28)]'
      : 'text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-300',
  );

interface IssuesDashboardCardProps {
  card: DashboardCard;
  analytics: IssuesAnalytics;
  ctaAllowed: boolean;
  /** Fill the tall hero column on the dashboard grid. */
  fillHeight?: boolean;
}

export function IssuesDashboardCard({
  card,
  analytics,
  ctaAllowed,
  fillHeight,
}: IssuesDashboardCardProps) {
  const [period, setPeriod] = useState<PeriodDays>(7);
  const { summary, modules, dailyTrend7, dailyTrend30, scopeLabel } = analytics;

  const trend = period === 7 ? dailyTrend7 : dailyTrend30;
  const newInPeriod = period === 7 ? summary.last7Days : summary.last30Days;
  const primaryRoute = modules[0]?.route ?? '/dashboard/issues/reference-overlaps';

  const chartStroke = useMemo(
    () => (period === 7 ? 'stroke-brand-lime' : 'stroke-brand-purple'),
    [period],
  );
  const chartFill = useMemo(
    () => (period === 7 ? 'fill-brand-lime/15' : 'fill-brand-purple/15'),
    [period],
  );

  return (
    <article
      className={cn(
        CARD_SHELL,
        fillHeight ? 'h-full min-h-0' : 'h-auto shrink-0 self-start',
      )}
    >
      <header className="border-b border-[#1f1f1f] px-4 py-3 sm:px-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {card.badge ? <span className={BADGE_NEW}>{card.badge}</span> : <span aria-hidden />}

          <div className="flex items-center rounded-full border border-[#2a2a2a] bg-[#0d0d0d] p-0.5">
            <button
              type="button"
              onClick={() => setPeriod(7)}
              className={PERIOD_TOGGLE_CLASS(period === 7)}
              aria-pressed={period === 7}
            >
              7 days
            </button>
            <button
              type="button"
              onClick={() => setPeriod(30)}
              className={PERIOD_TOGGLE_CLASS(period === 30)}
              aria-pressed={period === 30}
            >
              30 days
            </button>
          </div>
        </div>

        <h3 className="text-[15px] font-semibold text-white">{card.title}</h3>
        <p className="mt-0.5 text-[12px] text-neutral-500">
          Last {period} days · {scopeLabel}
        </p>
      </header>

      <div className="border-b border-[#1f1f1f] px-4 py-3 sm:px-5">
        <p className="font-sans text-3xl font-bold leading-none text-brand-lime">{summary.total}</p>
        <p className="mt-1 text-[12px] text-neutral-500">Total entries</p>

        <div className="mt-3 space-y-1.5 border-b border-[#1f1f1f] pb-3">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-neutral-500">Ownership pending</span>
            <span className="font-semibold text-brand-purple">{summary.ownershipPending}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-neutral-500">Active</span>
            <span className="font-semibold text-brand-lime">{summary.active}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-neutral-500">Deactive</span>
            <span className="font-semibold text-white">{summary.inactive}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-neutral-500">New in {period} days</span>
            <span className="font-semibold text-brand-lime">{newInPeriod}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Entries per day</span>
            <span className="tabular-nums">{newInPeriod} in period</span>
          </div>
          <DashboardLineChart
            values={trend}
            strokeClassName={chartStroke}
            fillClassName={chartFill}
          />
        </div>
      </div>

      <ul className="divide-y divide-[#1f1f1f] px-1.5 py-0.5">
        {modules.map((mod, index) => {
          const Icon = MODULE_ICONS[mod.icon] ?? Shield;
          const accent = index % 2 === 0 ? 'lime' : 'purple';
          const iconBg =
            accent === 'lime' ? 'bg-brand-lime/15 text-brand-lime' : 'bg-brand-purple/15 text-brand-purple';
          const recentCount = period === 7 ? mod.last7Days : mod.last30Days;

          return (
            <li key={mod.slug}>
              <Link
                href={mod.route}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.04]"
              >
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconBg)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-white">{mod.name}</span>
                  <span className="block truncate text-[11px] text-neutral-500">
                    {mod.total} total · {mod.active} active · {recentCount} in {period}d
                  </span>
                </span>
                <span className="shrink-0 text-[12px] font-semibold tabular-nums text-brand-lime">
                  {recentCount}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {card.cta ? (
        <footer className="border-t border-[#1f1f1f] px-4 py-2 sm:px-5">
          {ctaAllowed ? (
            <Link
              href={primaryRoute}
              className="inline-flex rounded-full bg-brand-lime px-4 py-2 text-[12px] font-semibold text-black transition-colors hover:bg-brand-lime-dark"
            >
              {card.cta.label}
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed rounded-full bg-brand-lime/50 px-4 py-2 text-[12px] font-semibold text-black/60">
              {card.cta.label}
            </span>
          )}
        </footer>
      ) : null}
    </article>
  );
}
