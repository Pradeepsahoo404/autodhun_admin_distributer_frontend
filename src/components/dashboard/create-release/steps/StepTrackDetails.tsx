'use client';

import { useCallback, useEffect } from 'react';
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
  formatReleaseIsrcExample,
  getReleaseIsrcPlaceholderHint,
  isGeneratedIsrcLocked,
} from '@/features/create-release/isrcUtils';
import type { CreateReleaseFormData } from '@/features/create-release/types';
import { useGetNextReleaseIsrcPreviewQuery, useLazyCheckReleaseIsrcQuery, useGetReleaseGenresQuery, useGetReleaseLanguagesQuery } from '@/store/api';

function TrackIsrcFields({ index }: { index: number }) {
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();
  const { isEdit, releaseId } = useReleaseWizardContext();

  const trackErrors = errors.tracks?.[index];
  const isrcOption = watch(`tracks.${index}.isrcOption`);
  const isrcValue = watch(`tracks.${index}.isrc`);
  const isLocked = isGeneratedIsrcLocked(isrcOption, isrcValue, isEdit);

  const { data: previewData } = useGetNextReleaseIsrcPreviewQuery(
    { count: 1 },
    { skip: isLocked },
  );

  const [checkReleaseIsrc] = useLazyCheckReleaseIsrcQuery();
  const exampleIsrc = formatReleaseIsrcExample();
  const previewIsrc = previewData?.data?.[0] ?? exampleIsrc;

  const handleIsrcOptionChange = (value: 'own' | 'generate') => {
    if (isLocked) return;
    setValue(`tracks.${index}.isrcOption`, value, { shouldDirty: true, shouldValidate: true });
    setValue(`tracks.${index}.isrc`, '', { shouldDirty: true, shouldValidate: true });
    clearErrors(`tracks.${index}.isrc`);
  };

  const verifyOwnIsrcAvailability = useCallback(
    async (rawValue: string) => {
      const code = rawValue.trim();
      if (!code) return;

      const tracks = watch('tracks');
      const normalized = code.toUpperCase();
      const duplicateInForm = tracks.some(
        (track, trackIndex) =>
          trackIndex !== index &&
          track.isrcOption === 'own' &&
          track.isrc?.trim().toUpperCase() === normalized,
      );

      if (duplicateInForm) {
        setError(`tracks.${index}.isrc`, { message: 'This ISRC is already used on another track' });
        return;
      }

      try {
        const result = await checkReleaseIsrc({
          code,
          excludeReleaseId: releaseId,
        }).unwrap();

        if (!result.data.available) {
          setError(`tracks.${index}.isrc`, { message: 'This ISRC is already taken' });
          return;
        }

        clearErrors(`tracks.${index}.isrc`);
      } catch {
        // Availability is re-checked when leaving the step or submitting.
      }
    },
    [checkReleaseIsrc, clearErrors, index, releaseId, setError, watch],
  );

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
            placeholder={exampleIsrc}
            error={trackErrors?.isrc?.message}
            disabled={isLocked}
            {...register(`tracks.${index}.isrc`, {
              onChange: () => clearErrors(`tracks.${index}.isrc`),
              onBlur: (event) => {
                void verifyOwnIsrcAvailability(event.target.value);
              },
            })}
          />
          <p className="mt-1 text-xs text-neutral-500">{getReleaseIsrcPlaceholderHint()}</p>
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

function TrackMetadataFields({ index }: { index: number }) {
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const { data: languagesData, isLoading: languagesLoading } = useGetReleaseLanguagesQuery({ limit: 500 });
  const { data: genresData, isLoading: genresLoading } = useGetReleaseGenresQuery({ limit: 500 });

  const trackErrors = errors.tracks?.[index];
  const genre = watch(`tracks.${index}.genre`);
  const language = watch(`tracks.${index}.language`);
  const subGenre = watch(`tracks.${index}.subGenre`);

  const languageOptions = [
    { value: '', label: languagesLoading ? 'Loading languages...' : 'Select language' },
    ...(languagesData?.data ?? []).map((item) => ({ value: item.name, label: item.name })),
  ];

  const genreOptions = [
    { value: '', label: genresLoading ? 'Loading genres...' : 'Select genre' },
    ...(genresData?.data ?? []).map((item) => ({ value: item.name, label: item.name })),
  ];

  const selectedGenre = genresData?.data?.find((item) => item.name === genre);
  const subGenreOptions = [
    { value: '', label: genre ? 'Select sub genre' : 'Select genre first' },
    ...(selectedGenre?.subGenres ?? []).map((name) => ({ value: name, label: name })),
  ];

  const clearTrackField = (field: 'language' | 'genre' | 'subGenre') => {
    clearErrors(`tracks.${index}.${field}` as never);
  };

  return (
    <ReleaseFormGrid3>
      <ReleaseFormRow label="Language" required>
        <TableSelectField
          value={language}
          onChange={(value) => {
            setValue(`tracks.${index}.language`, value, { shouldDirty: true, shouldValidate: true });
            clearTrackField('language');
          }}
          options={languageOptions}
          searchable
          searchPlaceholder="Search language..."
          disabled={languagesLoading}
          className="w-full"
          aria-label="Language"
        />
        {trackErrors?.language?.message ? (
          <p className="mt-1 text-xs text-red-400">{trackErrors.language.message}</p>
        ) : null}
      </ReleaseFormRow>

      <ReleaseFormRow label="Genre" required>
        <TableSelectField
          value={genre}
          onChange={(value) => {
            setValue(`tracks.${index}.genre`, value, { shouldDirty: true, shouldValidate: true });
            setValue(`tracks.${index}.subGenre`, '', { shouldDirty: true, shouldValidate: true });
            clearTrackField('genre');
            clearTrackField('subGenre');
          }}
          options={genreOptions}
          searchable
          searchPlaceholder="Search genre..."
          disabled={genresLoading}
          className="w-full"
          aria-label="Genre"
        />
        {trackErrors?.genre?.message ? (
          <p className="mt-1 text-xs text-red-400">{trackErrors.genre.message}</p>
        ) : null}
      </ReleaseFormRow>

      <ReleaseFormRow label="Sub Genre" required>
        <TableSelectField
          value={subGenre}
          onChange={(value) => {
            setValue(`tracks.${index}.subGenre`, value, { shouldDirty: true, shouldValidate: true });
            clearTrackField('subGenre');
          }}
          options={subGenreOptions}
          searchable
          searchPlaceholder="Search sub genre..."
          disabled={!genre || genresLoading}
          className="w-full"
          aria-label="Sub genre"
        />
        {trackErrors?.subGenre?.message ? (
          <p className="mt-1 text-xs text-red-400">{trackErrors.subGenre.message}</p>
        ) : null}
      </ReleaseFormRow>
    </ReleaseFormGrid3>
  );
}

export function StepTrackDetails() {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const releaseTitle = watch('title');
  const releaseArtist = watch('artist');
  const tracks = watch('tracks');
  const audioFiles = watch('audioFiles').filter((f) => f.file || f.fileName.trim());
  const trackCount = Math.max(audioFiles.length, tracks.length, 1);

  useEffect(() => {
    for (let index = 0; index < trackCount; index += 1) {
      const track = tracks[index];
      if (releaseTitle && !track?.title?.trim()) {
        setValue(`tracks.${index}.title`, releaseTitle, { shouldDirty: false });
      }
      if (releaseArtist && !track?.artist?.trim()) {
        setValue(`tracks.${index}.artist`, releaseArtist, { shouldDirty: false });
      }
    }
  }, [releaseTitle, releaseArtist, trackCount, tracks, setValue]);

  const clearTrackField = (index: number, field: keyof CreateReleaseFormData['tracks'][0]) => {
    clearErrors(`tracks.${index}.${field}` as never);
  };

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
                  {...register(`tracks.${index}.title`, {
                    onChange: () => clearTrackField(index, 'title'),
                  })}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Artist" required>
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter track artist"
                  error={trackErrors?.artist?.message}
                  {...register(`tracks.${index}.artist`, {
                    onChange: () => clearTrackField(index, 'artist'),
                  })}
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
              <ReleaseFormRow label="Composer" required>
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter composer"
                  error={trackErrors?.composer?.message}
                  {...register(`tracks.${index}.composer`, {
                    onChange: () => clearTrackField(index, 'composer'),
                  })}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Producer" required>
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter producer"
                  error={trackErrors?.producer?.message}
                  {...register(`tracks.${index}.producer`, {
                    onChange: () => clearTrackField(index, 'producer'),
                  })}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Director" required>
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter director"
                  error={trackErrors?.director?.message}
                  {...register(`tracks.${index}.director`, {
                    onChange: () => clearTrackField(index, 'director'),
                  })}
                />
              </ReleaseFormRow>
            </ReleaseFormGrid3>

            <TrackMetadataFields index={index} />
          </ReleaseFormSection>
        );
      })}
    </div>
  );
}

