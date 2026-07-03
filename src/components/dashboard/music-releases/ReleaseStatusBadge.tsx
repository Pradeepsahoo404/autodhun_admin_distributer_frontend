import { cn } from '@/lib/utils';
import {
  MUSIC_RELEASE_STATUS_LABELS,
  type MusicReleaseStatus,
} from '@/constants/musicReleaseStatus';

const STATUS_STYLES: Record<MusicReleaseStatus, string> = {
  in_review: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  correction: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  qc_approval: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  live: 'bg-brand-lime/15 text-brand-lime border-brand-lime/30',
};

export function ReleaseStatusBadge({ status }: { status: MusicReleaseStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
        STATUS_STYLES[status],
      )}
    >
      {MUSIC_RELEASE_STATUS_LABELS[status]}
    </span>
  );
}
