'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CreateReleaseWizard } from '@/components/dashboard/create-release/CreateReleaseWizard';
import { CreateReleaseScrollFix } from '@/components/dashboard/create-release/CreateReleaseScrollFix';
import { useGetMusicReleaseByIdQuery } from '@/store/api';
import { useAppSelector } from '@/hooks/useAppStore';
import { getApiErrorMessage } from '@/services/apiClient';
import { mapReleaseToFormData } from '@/features/create-release/mapReleaseToFormData';
import { canAdminEditRelease } from '@/features/create-release/releaseListUtils';
import { DASHBOARD_PAGE, DASHBOARD_PAGE_TITLE } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import { DASHBOARD_CARD } from '@/constants/dashboardLayout';

export default function EditReleasePage() {
  const params = useParams();
  const router = useRouter();
  const releaseId = params.id as string;
  const { user } = useAppSelector((s) => s.auth);

  const { data, isLoading, isError, error } = useGetMusicReleaseByIdQuery(releaseId);
  const release = data?.data;
  const errorMessage = isError ? getApiErrorMessage(error) : '';

  useEffect(() => {
    if (!isLoading && release && !canAdminEditRelease(release, user?.id)) {
      router.replace('/dashboard/assets');
    }
  }, [isLoading, release, user?.id, router]);

  if (isLoading) {
    return (
      <div className={`${DASHBOARD_PAGE} text-neutral-500`}>Loading release...</div>
    );
  }

  if (isError || !release) {
    return (
      <div className={DASHBOARD_PAGE}>
        <Card className={DASHBOARD_CARD}>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-400">{errorMessage || 'Release not found.'}</p>
            <button
              type="button"
              onClick={() => router.push('/dashboard/assets')}
              className="mt-4 text-brand-lime hover:underline"
            >
              Back to Assets
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canAdminEditRelease(release, user?.id)) {
    return (
      <div className={DASHBOARD_PAGE}>
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#222] bg-[#111] text-neutral-400 transition-colors hover:border-[#333] hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className={DASHBOARD_PAGE_TITLE}>Edit Release</h1>
        </div>
        <Card className={DASHBOARD_CARD}>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-400">
              This release can no longer be edited. Editing is only allowed while status is{' '}
              <span className="text-white">In Review</span> or{' '}
              <span className="text-white">Correction</span>.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard/release/correction')}
              className="mt-4 text-brand-lime hover:underline"
            >
              Back to Correction
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CreateReleaseScrollFix>
      <CreateReleaseWizard
        mode="edit"
        releaseId={releaseId}
        initialData={mapReleaseToFormData(release)}
      />
    </CreateReleaseScrollFix>
  );
}
