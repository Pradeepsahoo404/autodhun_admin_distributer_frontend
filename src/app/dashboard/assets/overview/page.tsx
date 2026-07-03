'use client';

import { MusicReleasesListPage } from '@/components/dashboard/music-releases/MusicReleasesListPage';
import { MUSIC_RELEASE_LIST_CONTEXT } from '@/constants/musicReleaseStatus';

export default function AssetsOverviewPage() {
  return <MusicReleasesListPage context={MUSIC_RELEASE_LIST_CONTEXT.ASSETS_OVERVIEW} />;
}
