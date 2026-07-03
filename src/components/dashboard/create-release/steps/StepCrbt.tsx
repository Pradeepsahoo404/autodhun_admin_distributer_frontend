'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { TimePickerField } from '@/components/common/TimePickerField';
import { ReleaseFormGrid, ReleaseFormRow, ReleaseFormSection } from '@/components/dashboard/create-release/ReleaseFormRow';
import { currentTimeHHmm, todayApiDate } from '@/lib/releaseDateTime';

import type { CreateReleaseFormData } from '@/features/create-release/types';

export function StepCrbt() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const entries = watch('crbtEntries');
  const releasingDate = watch('releasingDate');
  const minTime = releasingDate === todayApiDate() ? currentTimeHHmm() : undefined;

  const addEntry = () => setValue('crbtEntries', [...entries, { title: '', startTime: '' }], { shouldDirty: true });

  const removeAt = (index: number) => {
    if (entries.length <= 1) return;
    setValue(
      'crbtEntries',
      entries.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <div>
      {entries.map((_, index) => {
        const entryErrors = errors.crbtEntries?.[index];
        return (
          <ReleaseFormSection
            key={`crbt-${index}`}
            title={entries.length > 1 ? `CRBT ${index + 1}` : 'CRBT Details'}
            description="Configure caller ringback tone for this release."
          >
            {entries.length > 1 ? (
              <div className="flex justify-end px-5 pt-4 sm:px-8">
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="inline-flex items-center gap-1 text-[13px] text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            ) : null}

            <ReleaseFormGrid>
              <ReleaseFormRow label="Title" required>
                <ProfileInputField
                  label=""
                  className="[&>label]:sr-only"
                  placeholder="Enter CRBT title"
                  error={entryErrors?.title?.message}
                  {...register(`crbtEntries.${index}.title`)}
                />
              </ReleaseFormRow>

              <ReleaseFormRow label="Start Time" required>
                <TimePickerField
                  id={`crbt-start-time-${index}`}
                  label=""
                  value={watch(`crbtEntries.${index}.startTime`)}
                  onChange={(v) => setValue(`crbtEntries.${index}.startTime`, v, { shouldDirty: true })}
                  minTime={minTime}
                  placeholder="Select time"
                  className="[&>label]:sr-only w-full"
                />
                {entryErrors?.startTime ? (
                  <p className="mt-1 text-xs text-red-400">{entryErrors.startTime.message}</p>
                ) : null}
              </ReleaseFormRow>
            </ReleaseFormGrid>
          </ReleaseFormSection>
        );
      })}

      <div className="px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={addEntry}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-lime transition-colors hover:text-brand-lime-dark"
        >
          <Plus className="h-4 w-4" />
          Add another CRBT
        </button>
      </div>
    </div>
  );
}
