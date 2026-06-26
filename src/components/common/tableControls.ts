import { cn } from '@/lib/utils';

/** Shared input/select styling for dashboard table toolbars. */
export const tableControlClass = cn(
  'h-11 rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] text-[14px] text-white outline-none transition-colors',
  'placeholder:text-neutral-600 focus:border-brand-lime/40 focus:ring-1 focus:ring-brand-lime/20',
);
