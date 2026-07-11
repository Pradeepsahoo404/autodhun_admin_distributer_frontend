'use client';

import { useFormContext } from 'react-hook-form';
import { AudioFileUpload } from '@/components/dashboard/create-release/AudioFileUpload';
import { ReleaseFormSection } from '@/components/dashboard/create-release/ReleaseFormRow';
import { defaultTrackDetails, type CreateReleaseFormData } from '@/features/create-release/types';
import type { UploadedAudio } from '@/features/create-release/types';

function syncTracksWithAudio(
  files: UploadedAudio[],
  currentTracks: CreateReleaseFormData['tracks'],
  title: string,
  artist: string,
): CreateReleaseFormData['tracks'] {
  const count = Math.max(files.filter((f) => f.file || f.fileName.trim()).length, 1);
  const next = currentTracks.slice(0, count);

  while (next.length < count) {
    next.push({ ...defaultTrackDetails(), title, artist });
  }

  return next.map((track) => ({
    ...track,
    title: track.title.trim() || title,
    artist: track.artist.trim() || artist,
  }));
}

export function StepUploadTracks() {
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const title = watch('title');
  const artist = watch('artist');

  return (
    <ReleaseFormSection
      title="Audio Files"
      description="Upload one WAV audio file for this release."
    >
      <div className="px-5 py-6 sm:px-8">
        <AudioFileUpload
          files={watch('audioFiles')}
          onChange={(files) => {
            setValue('audioFiles', files, { shouldDirty: true });
            setValue('tracks', syncTracksWithAudio(files, watch('tracks'), title, artist), {
              shouldDirty: true,
            });
            clearErrors('audioFiles');
          }}
          error={errors.audioFiles?.message as string | undefined}
        />
      </div>
    </ReleaseFormSection>
  );
}
