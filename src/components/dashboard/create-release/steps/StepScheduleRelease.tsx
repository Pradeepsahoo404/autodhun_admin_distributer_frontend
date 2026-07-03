'use client';

import { useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { DatePickerField } from '@/components/common/DatePickerField';
import { ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { ReleaseFormGrid, ReleaseFormRow, ReleaseFormSection } from '@/components/dashboard/create-release/ReleaseFormRow';
import { formatDisplayDate, parseApiDate } from '@/lib/dateUtils';
import { minScheduledReleaseDate } from '@/lib/releaseDateTime';
import { cn } from '@/lib/utils';
import type { CreateReleaseFormData } from '@/features/create-release/types';

export function StepScheduleRelease() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const releasingDate = watch('releasingDate');
  const scheduledReleaseDate = watch('scheduledReleaseDate');

  useEffect(() => {
    if (releasingDate && !scheduledReleaseDate) {
      setValue('scheduledReleaseDate', releasingDate, { shouldDirty: false });
    }
  }, [releasingDate, scheduledReleaseDate, setValue]);

  const parsed = parseApiDate(releasingDate);
  const displayReleasingDate = parsed ? formatDisplayDate(parsed) : releasingDate;

  const minDate = minScheduledReleaseDate(releasingDate);

  return (
    <ReleaseFormSection title="Release Schedule" description="Confirm when this release should go live.">
      <ReleaseFormGrid>
        <ReleaseFormRow label="Releasing Date (from Step 1)">
          <div className="flex h-10 items-center gap-3 rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4">
            <CalendarDays className="h-4 w-4 shrink-0 text-brand-lime" />
            <span className={cn('text-[14px] font-medium', releasingDate ? 'text-white' : 'text-neutral-500')}>
              {releasingDate ? displayReleasingDate : 'Not set in Step 1'}
            </span>
          </div>
        </ReleaseFormRow>

        <ReleaseFormRow label="Scheduled Release Date" required>
          <DatePickerField
            id="scheduled-release-date"
            label=""
            value={scheduledReleaseDate}
            onChange={(v) => setValue('scheduledReleaseDate', v, { shouldDirty: true })}
            minDate={minDate}
            className="[&>label]:sr-only w-full"
          />
          {errors.scheduledReleaseDate ? (
            <p className="mt-1 text-xs text-red-400">{errors.scheduledReleaseDate.message}</p>
          ) : null}
        </ReleaseFormRow>
      </ReleaseFormGrid>

      <ReleaseFormRow label="Notes">
        <ProfileTextareaField
          label=""
          className="[&>label]:sr-only"
          placeholder="Optional scheduling notes"
          rows={4}
          {...register('scheduleNotes')}
        />
      </ReleaseFormRow>
    </ReleaseFormSection>
  );
}
