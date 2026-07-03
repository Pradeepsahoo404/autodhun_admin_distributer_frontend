import { PRICE_TIER_OPTIONS, RELEASE_PLATFORM_OPTIONS, RELEASE_TYPE_OPTIONS } from '@/features/create-release/constants';
import { MUSIC_RELEASE_STATUS_LABELS } from '@/constants/musicReleaseStatus';
import { parseApiDate } from '@/lib/dateUtils';
import type { MusicRelease, MusicReleaseTrack } from '@/types';

export function displayDetailValue(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '—';
}

export function formatYesNoDetail(value: 'yes' | 'no'): string {
  return value === 'yes' ? 'Yes' : 'No';
}

export function formatReleaseTypeLabel(value: MusicRelease['releaseType']): string {
  return RELEASE_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function formatGenreDetail(track?: MusicReleaseTrack): string {
  if (!track) return '—';
  const genre = track.genre?.trim();
  const subGenre = track.subGenre?.trim();
  if (genre && subGenre) return `${genre} > ${subGenre}`;
  return genre || subGenre || '—';
}

export function formatApiDateDetail(value?: string): string {
  if (!value?.trim()) return '—';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return value.trim();
  const parsed = parseApiDate(value);
  if (!parsed) return value;
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatImportDateDetail(value?: string): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const PRICE_TIER_DETAIL_LABELS: Record<string, string> = {
  budget: '$0.49 ($0.69 SRLP) - T1',
  back: '$0.69 ($0.99 SRLP) - T2',
  mid: '$0.99 ($1.29 SRLP) - T3',
  front: '$1.29 ($1.49 SRLP) - T4',
  premium: '$1.49 ($1.99 SRLP) - T5',
};

export function formatPriceTierDetail(price?: string): string {
  if (!price) return '—';
  return PRICE_TIER_DETAIL_LABELS[price] ?? PRICE_TIER_OPTIONS.find((o) => o.value === price)?.label ?? price;
}

export function formatReleasePlatformDetail(platform?: string): string {
  if (!platform) return '—';
  return RELEASE_PLATFORM_OPTIONS.find((option) => option.value === platform)?.label ?? platform;
}

export function formatStatusDetail(status: MusicRelease['status']): string {
  return MUSIC_RELEASE_STATUS_LABELS[status] ?? status;
}

export function formatIsrcDetail(track?: MusicReleaseTrack): string {
  if (!track) return '—';
  if (track.isrcOption === 'own' && track.isrc?.trim()) return track.isrc.trim();
  return 'Generated';
}
