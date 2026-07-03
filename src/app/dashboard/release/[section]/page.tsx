'use client';

import { useParams } from 'next/navigation';
import { DynamicModulePage } from '@/components/dashboard/DynamicModulePage';
import { MusicReleasesListPage } from '@/components/dashboard/music-releases/MusicReleasesListPage';
import { MUSIC_RELEASE_LIST_CONTEXT } from '@/constants/musicReleaseStatus';

export default function ReleaseSectionPage() {
  const params = useParams();
  const section = typeof params.section === 'string' ? params.section : '';

  if (section === 'correction') {
    return <MusicReleasesListPage context={MUSIC_RELEASE_LIST_CONTEXT.CORRECTION} />;
  }

  return <DynamicModulePage />;
}
