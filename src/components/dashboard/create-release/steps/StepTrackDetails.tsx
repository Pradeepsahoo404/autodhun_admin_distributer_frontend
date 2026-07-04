'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { ReleaseRadioGroup } from '@/components/dashboard/create-release/ReleaseRadioGroup';
import { useReleaseWizardContext } from '@/components/dashboard/create-release/ReleaseWizardContext';
import {
  ReleaseFormGrid,
  ReleaseFormGrid3,
  ReleaseFormRow,
  ReleaseFormSection,
} from '@/components/dashboard/create-release/ReleaseFormRow';
import { ISRC_OPTIONS, PRICE_TIER_OPTIONS } from '@/features/create-release/constants';
import {
  RELEASE_ISRC_MESSAGE,
  formatReleaseIsrcExample,
  isGeneratedIsrcLocked,
} from '@/features/create-release/isrcUtils';
import type { CreateReleaseFormData } from '@/features/create-release/types';
import { useGetNextReleaseIsrcPreviewQuery } from '@/store/api';

function TrackIsrcFields({ index }: { index: number }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();
  const { isEdit } = useReleaseWizardContext();

  const trackErrors = errors.tracks?.[index];
  const isrcOption = watch(`tracks.${index}.isrcOption`);
  const isrcValue = watch(`tracks.${index}.isrc`);
  const isLocked = isGeneratedIsrcLocked(isrcOption, isrcValue, isEdit);

  const { data: previewData } = useGetNextReleaseIsrcPreviewQuery(
    { count: 1 },
    { skip: isLocked },
  );

  const previewIsrc = previewData?.data?.[0] ?? formatReleaseIsrcExample();

  useEffect(() => {
    if (isLocked || isrcOption !== 'own') return;
    if (!isrcValue?.trim()) {
      setValue(`tracks.${index}.isrc`, previewIsrc, { shouldDirty: false, shouldValidate: true });
    }
  }, [isLocked, isrcOption, isrcValue, previewIsrc, index, setValue]);

  const handleIsrcOptionChange = (value: 'own' | 'generate') => {
    if (isLocked) return;
    setValue(`tracks.${index}.isrcOption`, value, { shouldDirty: true, shouldValidate: true });
    if (value === 'generate') {
      setValue(`tracks.${index}.isrc`, '', { shouldDirty: true, shouldValidate: true });
      return;
    }
    setValue(`tracks.${index}.isrc`, previewIsrc, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <>
      <ReleaseFormGrid>
        <ReleaseFormRow label="ISRC" required>
          <ReleaseRadioGroup
            name={`tracks.${index}.isrcOption`}
            value={isrcOption}
            onChange={(v) => handleIsrcOptionChange(v as 'own' | 'generate')}
            options={ISRC_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            direction="row"
            disabled={isLocked}
          />
        </ReleaseFormRow>

        <ReleaseFormRow label="Price" required>
          <TableSelectField
            value={watch(`tracks.${index}.price`)}
            onChange={(v) =>
              setValue(`tracks.${index}.price`, v as CreateReleaseFormData['tracks'][0]['price'], {
                shouldDirty: true,
              })
            }
            options={PRICE_TIER_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            className="w-full"
            aria-label="Price tier"
          />
        </ReleaseFormRow>
      </ReleaseFormGrid>

      {isrcOption === 'own' ? (
        <ReleaseFormRow label="ISRC Code" required>
          <ProfileInputField
            label=""
            className="[&>label]:sr-only"
            placeholder={previewIsrc}
            error={trackErrors?.isrc?.message}
            disabled={isLocked}
            {...register(`tracks.${index}.isrc`)}
          />
          <p className="mt-1 text-xs text-neutral-500">
            Format example: {formatReleaseIsrcExample()} ({RELEASE_ISRC_MESSAGE})
          </p>
        </ReleaseFormRow>
      ) : (
        <ReleaseFormRow label="Generated ISRC" required>
          <ProfileInputField
            label=""
            className="[&>label]:sr-only"
            value={isLocked ? isrcValue : previewIsrc}
            readOnly
            disabled
            placeholder="Generating..."
          />
          <p className="mt-1 text-xs text-neutral-500">
            {isLocked
              ? 'This generated ISRC is locked and cannot be changed after the release was saved.'
              : 'This ISRC will be assigned automatically when you submit the release.'}
          </p>
        </ReleaseFormRow>
      )}
    </>
  );
}

export function StepTrackDetails() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const tracks = watch('tracks');
  const audioFiles = watch('audioFiles').filter((f) => f.file || f.fileName.trim());
  const trackCount = Math.max(audioFiles.length, tracks.length, 1);

  return (
    <div>
      {Array.from({ length: trackCount }).map((_, index) => {
        const trackErrors = errors.tracks?.[index];
        const fileName = audioFiles[index]?.fileName;

        return (
          <ReleaseFormSection
            key={`track-details-${index}`}
            title={`Track ${index + 1}${fileName ? ` — ${fileName}` : ''}`}
            description="Enter metadata for this track."
          >
            <ReleaseFormGrid>
              <ReleaseFormRow label="Title" required>
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter track title"
                  error={trackErrors?.title?.message}
                  {...register(`tracks.${index}.title`)}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Artist" required>
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter track artist"
                  error={trackErrors?.artist?.message}
                  {...register(`tracks.${index}.artist`)}
                />
              </ReleaseFormRow>
            </ReleaseFormGrid>

            <ReleaseFormRow label="Lyrics">
              <ProfileTextareaField
                label=""
                className="[&>label]:sr-only"
                placeholder="Enter lyrics"
                rows={3}
                {...register(`tracks.${index}.lyrics`)}
              />
            </ReleaseFormRow>

            <TrackIsrcFields index={index} />

            <ReleaseFormGrid3>
              <ReleaseFormRow label="Composer">
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter composer"
                  {...register(`tracks.${index}.composer`)}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Producer">
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter producer"
                  {...register(`tracks.${index}.producer`)}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Director">
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter director"
                  {...register(`tracks.${index}.director`)}
                />
              </ReleaseFormRow>
            </ReleaseFormGrid3>

            <ReleaseFormGrid3>
              <ReleaseFormRow label="Language">
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter language"
                  {...register(`tracks.${index}.language`)}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Genre">
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter genre"
                  {...register(`tracks.${index}.genre`)}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Sub Genre">
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter sub genre"
                  {...register(`tracks.${index}.subGenre`)}
                />
              </ReleaseFormRow>
            </ReleaseFormGrid3>
          </ReleaseFormSection>
        );
      })}
    </div>
  );
}
