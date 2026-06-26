'use client';

import { BarChart3, ChevronLeft, ChevronRight, Music2, Play, Radio, Shield, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardCard, IssuesAnalytics, RightsManagerAnalytics } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { RightsManagerDashboardCard } from '@/components/dashboard/RightsManagerDashboardCard';
import { IssuesDashboardCard } from '@/components/dashboard/IssuesDashboardCard';
import type { DashboardCardSlot } from '@/constants/dashboardCards';

type Action = 'view' | 'create' | 'update' | 'delete';

const BADGE_STYLES: Record<string, string> = {
  POPULAR: 'rounded-md bg-brand-purple/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-purple',
  'NEW FEATURE': 'rounded-md bg-brand-purple/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-purple',
  NEW: 'rounded-md bg-brand-lime/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-lime',
  'TOTAL EARNINGS': 'text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-lime',
};

const CARD_BG: Record<DashboardCard['variant'], string> = {
  feature:
    'border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_top_right,rgba(163,255,18,0.14),transparent_55%)] hover:border-brand-lime/30',
  popular:
    'border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,127,240,0.22),transparent_55%)] hover:border-brand-purple/30',
  'new-feature':
    'border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_right,rgba(139,127,240,0.18),transparent_55%)] hover:border-brand-purple/30',
  earnings:
    'border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_bottom_left,rgba(163,255,18,0.1),transparent_60%)] hover:border-brand-lime/25',
  link:
    'border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_top_left,rgba(163,255,18,0.1),transparent_55%)] hover:border-brand-lime/25',
  sync:
    'border-[#222222] bg-[#111111] bg-[radial-gradient(ellipse_at_top_right,rgba(139,127,240,0.16),transparent_55%)] hover:border-brand-purple/25',
};

const cardShell = (variant: DashboardCard['variant']) =>
  cn(
    'font-sans flex h-full w-full flex-col overflow-hidden rounded-2xl border transition-all duration-200',
    CARD_BG[variant],
  );

interface DashboardCardItemProps {
  card: DashboardCard;
  currency: string;
  earnings: number;
  slot: DashboardCardSlot;
  rightsManagerAnalytics?: RightsManagerAnalytics | null;
  issuesAnalytics?: IssuesAnalytics | null;
}

export function DashboardCardItem({
  card,
  currency,
  earnings,
  slot,
  rightsManagerAnalytics,
  issuesAnalytics,
}: DashboardCardItemProps) {
  const ctaModule = card.cta?.moduleSlug ?? '';
  const { can } = usePermission(ctaModule);
  const ctaAllowed = card.cta ? can(card.cta.action as Action) : false;

  if (slot === 'rights' && card.key === 'rights-manager') {
    if (rightsManagerAnalytics) {
      return (
        <RightsManagerDashboardCard card={card} analytics={rightsManagerAnalytics} ctaAllowed={ctaAllowed} />
      );
    }
    return <ListCard card={card} ctaAllowed={ctaAllowed} />;
  }
  if (slot === 'issues' && card.key === 'issues') {
    if (issuesAnalytics) {
      return <IssuesDashboardCard card={card} analytics={issuesAnalytics} ctaAllowed={ctaAllowed} />;
    }
    return <ListCard card={card} ctaAllowed={ctaAllowed} />;
  }
  if (slot === 'hero') return <HeroCard card={card} ctaAllowed={ctaAllowed} />;
  if (slot === 'stat') return <StatCard card={card} ctaAllowed={ctaAllowed} />;
  if (slot === 'media') return <MediaCard card={card} ctaAllowed={ctaAllowed} />;
  if (slot === 'list') return <ListCard card={card} ctaAllowed={ctaAllowed} />;
  return <CompactCard card={card} currency={currency} earnings={earnings} ctaAllowed={ctaAllowed} />;
}

function HeroCard({ card, ctaAllowed }: { card: DashboardCard; ctaAllowed: boolean }) {
  return (
    <article className={cardShell(card.variant)}>
      <div className="flex flex-1 flex-col p-5">
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-brand-lime/25 bg-[#0d0d0d]/80 px-6 py-10 text-center">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-lime/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-brand-purple/15 blur-2xl" />
          <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-lime/25 to-brand-purple/20 ring-2 ring-brand-lime/30">
            <Music2 className="h-10 w-10 text-brand-lime" />
          </div>
          <h3 className="relative mb-2 text-[16px] font-semibold text-white">{card.title}</h3>
          <p className="relative max-w-[240px] text-[13px] leading-relaxed text-neutral-400">{card.description}</p>
        </div>
      </div>
      <footer className="border-t border-[#1f1f1f] px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {card.cta && ctaAllowed && (
            <button
              type="button"
              className="rounded-full bg-brand-lime px-5 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-brand-lime-dark"
            >
              {card.cta.label}
            </button>
          )}
          {card.secondaryCta && (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium text-brand-purple transition-colors hover:bg-brand-purple/10"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {card.secondaryCta.label}
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}

function StatCard({ card, ctaAllowed }: { card: DashboardCard; ctaAllowed: boolean }) {
  return (
    <article className={cardShell(card.variant)}>
      <header className="border-b border-[#1f1f1f] px-5 py-4">
        {card.badge && <span className={cn('mb-2 inline-block', BADGE_STYLES[card.badge])}>{card.badge}</span>}
        <h3 className="text-[15px] font-semibold text-white">{card.title}</h3>
        <p className="mt-0.5 text-[12px] text-neutral-500">Last 28 days</p>
      </header>

      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="mb-4">
          <p className="font-sans text-4xl font-bold leading-none text-brand-purple">—</p>
          <p className="mt-1 text-[12px] text-neutral-500">Performance overview</p>
        </div>

        <div className="mb-4 space-y-2.5 border-b border-[#1f1f1f] pb-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-neutral-500">Views</span>
            <span className="font-semibold text-brand-lime">—</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-neutral-500">Watch time</span>
            <span className="font-semibold text-white">—</span>
          </div>
        </div>

        <div className="mb-2 flex h-12 items-end gap-1.5">
          {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
            <div
              key={i}
              className={cn('flex-1 rounded-sm', i % 2 === 0 ? 'bg-brand-lime/50' : 'bg-brand-purple/45')}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-neutral-500">{card.description}</p>
      </div>

      {card.cta && (
        <footer className="border-t border-[#1f1f1f] px-5 py-3">
          <button
            type="button"
            disabled={!ctaAllowed}
            className="rounded-full bg-brand-purple px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-brand-purple/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {card.cta.label}
          </button>
        </footer>
      )}
    </article>
  );
}

function MediaCard({ card, ctaAllowed }: { card: DashboardCard; ctaAllowed: boolean }) {
  const Icon = card.variant === 'popular' ? Truck : BarChart3;

  return (
    <article className={cardShell(card.variant)}>
      <header className="flex items-center justify-between border-b border-[#1f1f1f] px-5 py-3">
        <div>
          {card.badge && <span className={cn('mb-1 inline-block', BADGE_STYLES[card.badge])}>{card.badge}</span>}
          <h3 className="text-[15px] font-semibold text-white">{card.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-neutral-500">
          <button type="button" className="rounded p-0.5 hover:bg-brand-purple/10 hover:text-brand-purple" aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px]">1 / 3</span>
          <button type="button" className="rounded p-0.5 hover:bg-brand-purple/10 hover:text-brand-purple" aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col p-5">
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-[#2a2a2a]">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/40 via-[#1a1030] to-brand-lime/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(163,255,18,0.15),transparent_50%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 ring-2 ring-brand-lime/40 backdrop-blur-sm">
              <Icon className="h-7 w-7 text-brand-lime" />
            </div>
          </div>
        </div>
        <p className="flex-1 text-[13px] leading-relaxed text-neutral-400">{card.description}</p>
      </div>

      {card.cta && (
        <footer className="border-t border-[#1f1f1f] px-5 py-3">
          <button
            type="button"
            disabled={!ctaAllowed}
            className="rounded-full bg-brand-purple px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-brand-purple/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {card.cta.label}
          </button>
        </footer>
      )}
    </article>
  );
}

function CompactCard({
  card,
  currency,
  earnings,
  ctaAllowed,
}: {
  card: DashboardCard;
  currency: string;
  earnings: number;
  ctaAllowed: boolean;
}) {
  return (
    <article className={cardShell(card.variant)}>
      <header className="border-b border-[#1f1f1f] px-5 py-4">
        {card.badge && <span className={cn('mb-1 inline-block', BADGE_STYLES[card.badge])}>{card.badge}</span>}
        <h3 className="text-[15px] font-semibold text-white">Total earnings</h3>
      </header>

      <div className="flex flex-1 flex-col justify-between px-5 py-4">
        <div>
          <p className="font-sans text-4xl font-bold leading-none text-brand-lime">
            {currency}
            {earnings}
          </p>
          <div className="mt-3 rounded-xl border border-[#1f1f1f] bg-[#0d0d0d]/60 p-3">
            <p className="text-[12px] leading-relaxed text-neutral-500">{card.description}</p>
          </div>
        </div>
      </div>

      {(card.cta || card.secondaryCta) && (
        <footer className="border-t border-[#1f1f1f] px-5 py-3">
          <div className="flex flex-wrap gap-2">
            {card.cta && (
              <button
                type="button"
                disabled={!ctaAllowed}
                className="rounded-full bg-[#2a2a2a] px-4 py-2 text-[12px] font-medium text-neutral-200 transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {card.cta.label}
              </button>
            )}
            {card.secondaryCta && (
              <button
                type="button"
                className="rounded-full border border-brand-lime/40 px-4 py-2 text-[12px] font-medium text-brand-lime transition-colors hover:bg-brand-lime/10"
              >
                {card.secondaryCta.label}
              </button>
            )}
          </div>
        </footer>
      )}
    </article>
  );
}

const LIST_PREVIEW: Record<string, { icon: typeof Radio; label: string; sub: string; accent: 'lime' | 'purple' }[]> = {
  channels: [
    { icon: Radio, label: 'Link a channel', sub: 'Connect YouTube or Facebook', accent: 'lime' },
    { icon: Radio, label: 'Create channel', sub: 'Start a new distribution channel', accent: 'purple' },
    { icon: Radio, label: 'Manage channels', sub: 'View linked accounts', accent: 'lime' },
  ],
  'rights-manager': [
    { icon: Shield, label: 'YouTube claim release', sub: 'Manage Content ID claims', accent: 'purple' },
    { icon: Shield, label: 'Allowlist & takedowns', sub: 'Rights protection tools', accent: 'lime' },
    { icon: Shield, label: 'Manual claiming', sub: 'Submit platform claims', accent: 'purple' },
  ],
};

function ListCard({ card, ctaAllowed }: { card: DashboardCard; ctaAllowed: boolean }) {
  const items = LIST_PREVIEW[card.key] ?? [
    { icon: Shield, label: card.title, sub: card.description, accent: 'purple' as const },
  ];

  const ctaClass =
    card.variant === 'link'
      ? 'bg-brand-lime text-black hover:bg-brand-lime-dark'
      : 'bg-brand-purple text-white hover:bg-brand-purple/80';

  return (
    <article className={cardShell(card.variant)}>
      <header className="border-b border-[#1f1f1f] px-5 py-4">
        {card.badge && <span className={cn('mb-2 inline-block', BADGE_STYLES[card.badge])}>{card.badge}</span>}
        <h3 className="text-[15px] font-semibold text-white">{card.title}</h3>
      </header>

      <ul className="flex flex-1 flex-col divide-y divide-[#1f1f1f] px-2 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const iconBg =
            item.accent === 'lime' ? 'bg-brand-lime/15 text-brand-lime' : 'bg-brand-purple/15 text-brand-purple';
          return (
            <li key={item.label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/[0.04]"
              >
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', iconBg)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-white">{item.label}</span>
                  <span className="block truncate text-[11px] text-neutral-500">{item.sub}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {card.cta && (
        <footer className="border-t border-[#1f1f1f] px-5 py-3">
          <button
            type="button"
            disabled={!ctaAllowed}
            className={cn(
              'rounded-full px-4 py-2 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              ctaClass,
            )}
          >
            {card.cta.label}
          </button>
        </footer>
      )}
    </article>
  );
}
