'use client';

import { cn } from '@/lib/utils';
import { DashboardCard, IssuesAnalytics, ReleaseAnalyticsBundle, RightsManagerAnalytics } from '@/types';
import { DashboardCardItem } from './DashboardCardItem';
import { getCardLayout, SLOT_GRID_CLASS, SLOT_MIN_HEIGHT, sortDashboardCards } from '@/constants/dashboardCards';

interface DashboardCardGridProps {
  cards: DashboardCard[];
  currency: string;
  earnings: number;
  rightsManagerAnalytics?: RightsManagerAnalytics | null;
  issuesAnalytics?: IssuesAnalytics | null;
  releaseAnalytics?: ReleaseAnalyticsBundle | null;
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
  releaseAnalytics,
}: DashboardCardGridProps) {
  const sorted = sortDashboardCards(cards);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:auto-rows-fr">
      {sorted.map((card) => {
        const { slot } = getCardLayout(card.key);
        const isTallAnalyticsCard = slot === 'rights' || slot === 'issues';
        const isHeroIssues = slot === 'hero' && card.key === 'issues';

        return (
          <div
            key={card.key}
            className={cn(
              'flex',
              (isTallAnalyticsCard || isHeroIssues) && 'h-full',
              (isTallAnalyticsCard || isHeroIssues) && 'items-start self-start',
              SLOT_GRID_CLASS[slot],
              isHeroIssues ? 'min-h-[380px] xl:min-h-full' : SLOT_MIN_HEIGHT[slot],
            )}
          >
            <DashboardCardItem
              card={card}
              currency={currency}
              earnings={earnings}
              slot={slot}
              rightsManagerAnalytics={rightsManagerAnalytics}
              issuesAnalytics={issuesAnalytics}
              releaseAnalytics={releaseAnalytics}
            />
          </div>
        );
      })}
    </div>
  );
}
