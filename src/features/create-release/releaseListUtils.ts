import type { MusicRelease } from '@/types';
import { MUSIC_RELEASE_STATUS } from '@/constants/musicReleaseStatus';

export function formatReleaseIsrcDisplay(release: MusicRelease): string {
  if (!release.tracks?.length) return '—';

  const labels = release.tracks.map((track) =>
    track.isrcOption === 'own' && track.isrc?.trim() ? track.isrc.trim() : 'Generated',
  );

  if (labels.length === 1) return labels[0];
  return labels.join(', ');
}

export function getPrimaryIsrcCode(release: MusicRelease): string | null {
  const own = release.tracks.find((t) => t.isrcOption === 'own' && t.isrc?.trim());
  return own?.isrc?.trim() ?? null;
}

export function canAdminEditRelease(release: MusicRelease, userId?: string): boolean {
  if (!userId) return false;
  const editable =
    release.status === MUSIC_RELEASE_STATUS.IN_REVIEW ||
    release.status === MUSIC_RELEASE_STATUS.CORRECTION;
  if (!editable) return false;
  const ownerId = release.createdBy?._id;
  return Boolean(ownerId && ownerId === userId);
}

export function truncateReleaseTitle(title: string, maxLength = 22): string {
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}...`;
}
