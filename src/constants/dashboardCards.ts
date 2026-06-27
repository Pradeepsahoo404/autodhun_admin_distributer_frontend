import { DashboardCard } from '@/types';

/** Visual slot — drives column span, height, and card interior layout. */
export type DashboardCardSlot = 'hero' | 'stat' | 'media' | 'compact' | 'list' | 'rights' | 'issues';

export interface DashboardCardLayout {
  slot: DashboardCardSlot;
  /** Lower numbers render first in the studio grid. */
  order: number;
}

/** Studio-style placement per card key (frontend-only; no API change required). */
export const DASHBOARD_CARD_LAYOUT: Record<string, DashboardCardLayout> = {
  issues: { slot: 'hero', order: 1 },
  'release-music': { slot: 'stat', order: 2 },
  'content-delivery': { slot: 'media', order: 3 },
  channels: { slot: 'list', order: 4 },
  'total-earnings': { slot: 'compact', order: 5 },
  'rights-manager': { slot: 'rights', order: 6 },
  analytics: { slot: 'issues', order: 7 },
};

const DEFAULT_LAYOUT: DashboardCardLayout = { slot: 'compact', order: 99 };

export const getCardLayout = (key: string): DashboardCardLayout =>
  DASHBOARD_CARD_LAYOUT[key] ?? DEFAULT_LAYOUT;

export const sortDashboardCards = (cards: DashboardCard[]): DashboardCard[] =>
  [...cards].sort((a, b) => getCardLayout(a.key).order - getCardLayout(b.key).order);

export const SLOT_GRID_CLASS: Record<DashboardCardSlot, string> = {
  hero: 'xl:row-span-2',
  stat: '',
  media: '',
  compact: '',
  list: '',
  rights: 'xl:row-span-2',
  issues: 'xl:row-span-2',
};

export const SLOT_MIN_HEIGHT: Record<DashboardCardSlot, string> = {
  hero: 'min-h-[380px] xl:min-h-full',
  stat: 'min-h-[300px]',
  media: 'min-h-[280px]',
  compact: 'min-h-[200px]',
  list: 'min-h-[220px]',
  rights: 'min-h-0',
  issues: 'min-h-0',
};
