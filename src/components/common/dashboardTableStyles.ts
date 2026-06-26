import { cn } from '@/lib/utils';

export const legalModuleCardClass =
  'border-[#252525] bg-[#111111] shadow-[0_12px_40px_rgba(0,0,0,0.28)]';

export const legalModuleCardHeaderClass =
  'space-y-4 border-b border-[#252525] bg-gradient-to-r from-[#161616] via-[#121212] to-[#111111] pb-5';

export function dashboardTableWrapperClass(minWidth?: number) {
  return cn('overflow-hidden rounded-xl border border-[#252525] bg-[#0a0a0a]', minWidth && `min-w-0`);
}

export const dashboardTableClass = 'w-full text-sm';

export const dashboardTableHeadClass =
  'bg-gradient-to-b from-[#1a1a1a] to-[#121212] [&_th]:px-4 [&_th]:py-3.5 [&_th]:text-left [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.07em] [&_th]:text-neutral-500 [&_th.text-right]:text-right';

export const dashboardTableHeadCellActions =
  'w-[1%] whitespace-nowrap text-right';

export const dashboardTableHeadCellStatus =
  'w-[1%] whitespace-nowrap';

export const dashboardTableHeadClassCenter =
  'bg-gradient-to-b from-[#1a1a1a] to-[#121212] [&_th]:px-4 [&_th]:py-3.5 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.07em] [&_th]:text-neutral-500 [&_th:first-child]:text-left [&_th:not(:first-child)]:text-center';

export const dashboardTableHeadRowClass = 'border-b border-[#2a2a2a]';

export const dashboardTableBodyClass = 'divide-y divide-[#1f1f1f]';

export const dashboardTableRowClass =
  'transition-colors hover:bg-[#161616]/90 odd:bg-[#0d0d0d]/40 even:bg-transparent';

export const dashboardTableCellPrimary = 'px-4 py-4 font-medium text-white';
export const dashboardTableCellMuted = 'px-4 py-4 text-neutral-400';
export const dashboardTableCellMeta = 'px-4 py-4 text-[13px] text-neutral-500';
export const dashboardTableCellActions =
  'w-[1%] whitespace-nowrap px-4 py-4 text-right align-middle';

export const dashboardTableCellStatusControl =
  'w-[1%] whitespace-nowrap px-4 py-4 align-middle';

export const dashboardTableCellStatus =
  'w-[1%] min-w-[7.5rem] whitespace-nowrap px-4 py-4 align-middle';
export const dashboardTableCellCenter = 'px-4 py-4 text-center';

export const slugBadgeClass =
  'inline-flex rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-0.5 font-mono text-xs text-neutral-400';

export const systemBadgeClass =
  'inline-flex items-center gap-1.5 rounded-full border border-brand-lime/25 bg-brand-lime/10 px-2.5 py-1 text-xs font-medium text-brand-lime';

export const customBadgeClass =
  'inline-flex rounded-full border border-neutral-600/30 bg-neutral-500/10 px-2.5 py-1 text-xs font-medium text-neutral-400';

export const groupBadgeClass =
  'ml-2 rounded-full border border-neutral-600/30 bg-neutral-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400';

export const isrcBadgeClass =
  'inline-flex rounded-md border border-brand-lime/15 bg-brand-lime/5 px-2 py-0.5 font-mono text-xs text-brand-lime';

export const adminBadgeClass =
  'inline-flex max-w-[140px] truncate rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-0.5 text-xs text-neutral-300';

export const tableIconButtonClass =
  'h-8 w-8 rounded-lg border border-transparent p-0 text-neutral-400 transition-colors hover:border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-white';

export const tableIconButtonDangerClass =
  'h-8 w-8 rounded-lg border border-transparent p-0 text-neutral-400 transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400';
