'use client';

import { useFormContext } from 'react-hook-form';
import { DatePickerField } from '@/components/common/DatePickerField';
import { ReleaseFormRow, ReleaseFormSection } from '@/components/dashboard/create-release/ReleaseFormRow';
import { minScheduledReleaseDate } from '@/lib/releaseDateTime';
import type { CreateReleaseFormData } from '@/features/create-release/types';

export function StepScheduleRelease() {
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const releasingDate = watch('releasingDate');
  const scheduledReleaseDate = watch('scheduledReleaseDate');
  const minDate = minScheduledReleaseDate(releasingDate);

  return (
    <ReleaseFormSection title="Release Schedule" description="Choose when this release should go live.">
      <ReleaseFormRow label="Scheduled Release Date" required className="max-w-md">
        <DatePickerField
          id="scheduled-release-date"
          label=""
          value={scheduledReleaseDate}
          onChange={(v) => {
            setValue('scheduledReleaseDate', v, { shouldDirty: true });
            clearErrors('scheduledReleaseDate');
          }}
          minDate={minDate}
          className="[&>label]:sr-only w-full"
        />
        {errors.scheduledReleaseDate ? (
          <p className="mt-1 text-xs text-red-400">{errors.scheduledReleaseDate.message}</p>
        ) : (
          <p className="mt-1 text-xs text-neutral-500">
            Must be a future date (today and past dates are not allowed).
          </p>
        )}
      </ReleaseFormRow>
    </ReleaseFormSection>
  );
}
