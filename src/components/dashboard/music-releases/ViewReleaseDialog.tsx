'use client';

import { Loader2 } from 'lucide-react';
import { AppModal } from '@/components/common/AppModal';
import { ReleaseDetailContent } from '@/components/dashboard/music-releases/ReleaseDetailContent';
import { useGetMusicReleaseByIdQuery } from '@/store/api';
import type { MusicRelease } from '@/types';

interface ViewReleaseDialogProps {
  open: boolean;
  releaseId: string | null;
  preview?: MusicRelease | null;
  showSubmittedBy?: boolean;
  onClose: () => void;
}

export function ViewReleaseDialog({
  open,
  releaseId,
  preview,
  showSubmittedBy = false,
  onClose,
}: ViewReleaseDialogProps) {
  const { data, isLoading, isFetching } = useGetMusicReleaseByIdQuery(releaseId ?? '', {
    skip: !open || !releaseId,
  });

  const release = data?.data ?? preview;
  const loading = isLoading || (isFetching && !data);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={release?.title ?? 'Release'}
      size="xl"
      className="max-w-5xl"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2a2a2a] px-5 text-[14px] font-medium text-neutral-300 transition-colors hover:border-brand-lime/30 hover:text-white"
          >
            Close
          </button>
        </div>
      }
    >
      {loading && !release ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-lime" />
        </div>
      ) : release ? (
        <ReleaseDetailContent release={release} showSubmittedBy={showSubmittedBy} />
      ) : (
        <p className="py-10 text-center text-neutral-500">Release not found.</p>
      )}
    </AppModal>
  );
}
