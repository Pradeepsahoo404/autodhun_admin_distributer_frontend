'use client';

import { useFormContext } from 'react-hook-form';
import { ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { ReleaseRadioGroup } from '@/components/dashboard/create-release/ReleaseRadioGroup';
import {
  ReleaseFormGrid,
  ReleaseFormGrid3,
  ReleaseFormRow,
  ReleaseFormSection,
} from '@/components/dashboard/create-release/ReleaseFormRow';
import { ISRC_OPTIONS, PRICE_TIER_OPTIONS } from '@/features/create-release/constants';
import type { CreateReleaseFormData } from '@/features/create-release/types';

export function StepTrackDetails() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const tracks = watch('tracks');
  const audioFiles = watch('audioFiles').filter((f) => f.file);
  const trackCount = Math.max(audioFiles.length, tracks.length, 1);

  return (
    <div>
      {Array.from({ length: trackCount }).map((_, index) => {
        const trackErrors = errors.tracks?.[index];
        const fileName = audioFiles[index]?.fileName;
        const isrcOption = watch(`tracks.${index}.isrcOption`);

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

            <ReleaseFormGrid>
              <ReleaseFormRow label="ISRC" required>
                <ReleaseRadioGroup
                  name={`tracks.${index}.isrcOption`}
                  value={isrcOption}
                  onChange={(v) =>
                    setValue(`tracks.${index}.isrcOption`, v as 'own' | 'generate', { shouldDirty: true })
                  }
                  options={ISRC_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  direction="row"
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
                  placeholder="Enter ISRC"
                  error={trackErrors?.isrc?.message}
                  {...register(`tracks.${index}.isrc`)}
                />
              </ReleaseFormRow>
            ) : null}

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
