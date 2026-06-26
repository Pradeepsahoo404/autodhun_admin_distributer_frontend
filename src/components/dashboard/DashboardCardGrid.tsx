'use client';

import { cn } from '@/lib/utils';
import { DashboardCard, IssuesAnalytics, RightsManagerAnalytics } from '@/types';
import { DashboardCardItem } from './DashboardCardItem';
import { getCardLayout, SLOT_GRID_CLASS, SLOT_MIN_HEIGHT, sortDashboardCards } from '@/constants/dashboardCards';

interface DashboardCardGridProps {
  cards: DashboardCard[];
  currency: string;
  earnings: number;
  rightsManagerAnalytics?: RightsManagerAnalytics | null;
  issuesAnalytics?: IssuesAnalytics | null;
}

/**
 * YouTube Studio–inspired dashboard: 3 columns on desktop, mixed card heights,
 * hero card spans two rows on the left.
 */
export function DashboardCardGrid({
  cards,
  currency,
  earnings,
  rightsManagerAnalytics,
  issuesAnalytics,
}: DashboardCardGridProps) {
  const sorted = sortDashboardCards(cards);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:auto-rows-fr">
      {sorted.map((card) => {
        const { slot } = getCardLayout(card.key);
        return (
          <div
            key={card.key}
            className={cn(
              'flex',
              (slot === 'rights' || slot === 'issues') && 'items-start self-start',
              SLOT_GRID_CLASS[slot],
              SLOT_MIN_HEIGHT[slot],
            )}
          >
            <DashboardCardItem
              card={card}
              currency={currency}
              earnings={earnings}
              slot={slot}
              rightsManagerAnalytics={rightsManagerAnalytics}
              issuesAnalytics={issuesAnalytics}
            />
          </div>
        );
      })}
    </div>
  );
}
