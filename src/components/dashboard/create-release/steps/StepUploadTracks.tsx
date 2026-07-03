'use client';

import { useFormContext } from 'react-hook-form';
import { AudioFileUpload } from '@/components/dashboard/create-release/AudioFileUpload';
import { ReleaseFormSection } from '@/components/dashboard/create-release/ReleaseFormRow';
import { defaultTrackDetails, type CreateReleaseFormData } from '@/features/create-release/types';
import type { UploadedAudio } from '@/features/create-release/types';

function syncTracksWithAudio(
  files: UploadedAudio[],
  currentTracks: CreateReleaseFormData['tracks'],
  artist: string,
): CreateReleaseFormData['tracks'] {
  const count = Math.max(files.filter((f) => f.file || f.fileName.trim()).length, 1);
  const next = currentTracks.slice(0, count);

  while (next.length < count) {
    next.push({ ...defaultTrackDetails(), artist });
  }

  return next;
}

export function StepUploadTracks() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const artist = watch('artist');

  return (
    <ReleaseFormSection
      title="Audio Files"
      description="Upload one audio file for this release. Supported formats: MP3, WAV, FLAC, AAC."
    >
      <div className="px-5 py-6 sm:px-8">
        <AudioFileUpload
          files={watch('audioFiles')}
          onChange={(files) => {
            setValue('audioFiles', files, { shouldDirty: true });
            setValue('tracks', syncTracksWithAudio(files, watch('tracks'), artist), {
              shouldDirty: true,
            });
          }}
          error={errors.audioFiles?.message as string | undefined}
        />
      </div>
    </ReleaseFormSection>
  );
}
