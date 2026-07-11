'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { ReleaseFormGrid, ReleaseFormRow, ReleaseFormSection } from '@/components/dashboard/create-release/ReleaseFormRow';
import type { CreateReleaseFormData } from '@/features/create-release/types';

export function StepCrbt() {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const releaseTitle = watch('title');
  const crbtTitle = watch('crbtEntries.0.title');
  const entryErrors = errors.crbtEntries?.[0];

  useEffect(() => {
    if (releaseTitle && !crbtTitle) {
      setValue('crbtEntries.0.title', releaseTitle, { shouldDirty: false });
    }
  }, [releaseTitle, crbtTitle, setValue]);

  return (
    <ReleaseFormSection title="CRBT Details" description="Configure caller ringback tone for this release.">
      <ReleaseFormGrid>
        <ReleaseFormRow label="Title" required>
          <ProfileInputField
            label=""
            className="[&>label]:sr-only"
            placeholder="Enter CRBT title"
            error={entryErrors?.title?.message}
            {...register('crbtEntries.0.title', {
              onChange: () => clearErrors('crbtEntries.0.title'),
            })}
          />
        </ReleaseFormRow>

        <ReleaseFormRow label="Start Time" required>
          <ProfileInputField
            label=""
            className="[&>label]:sr-only"
            placeholder="00:00:00"
            error={entryErrors?.startTime?.message}
            {...register('crbtEntries.0.startTime', {
              onChange: () => clearErrors('crbtEntries.0.startTime'),
            })}
          />
          <p className="mt-1 text-xs text-neutral-500">Format: HH:MM:SS (e.g. 00:00:00)</p>
        </ReleaseFormRow>
      </ReleaseFormGrid>
    </ReleaseFormSection>
  );
}
