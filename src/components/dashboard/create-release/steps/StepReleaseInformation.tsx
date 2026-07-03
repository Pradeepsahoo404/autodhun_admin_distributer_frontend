'use client';

import { useFormContext } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { DatePickerField } from '@/components/common/DatePickerField';
import { TableSelectField } from '@/components/common/TableSelectField';
import {
  ReleaseFormGrid,
  ReleaseFormGrid3,
  ReleaseFormRow,
  ReleaseFormSection,
} from '@/components/dashboard/create-release/ReleaseFormRow';
import { ReleaseYesNoGroup } from '@/components/dashboard/create-release/ReleaseYesNoGroup';
import { CatalogLookupSelect } from '@/components/dashboard/create-release/CatalogLookupSelect';
import { CoverArtUpload } from '@/components/dashboard/create-release/CoverArtUpload';
import { RELEASE_TYPE_OPTIONS } from '@/features/create-release/constants';
import { todayApiDate } from '@/lib/releaseDateTime';
import type { CreateReleaseFormData } from '@/features/create-release/types';

export function StepReleaseInformation() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const coverArtPreview = watch('coverArtPreview');

  return (
    <div>
      <ReleaseFormSection title="Basic Information" description="Core details about your release.">
        <ReleaseFormGrid>
          <ReleaseFormRow label="Title" required>
            <ProfileInputField
              label=""
              className="[&>label]:sr-only"
              placeholder="Enter release title"
              error={errors.title?.message}
              {...register('title')}
            />
          </ReleaseFormRow>

          <ReleaseFormRow label="Version">
            <ProfileInputField
              label=""
              className="[&>label]:sr-only"
              placeholder="e.g. Deluxe, Remix"
              error={errors.version?.message}
              {...register('version')}
            />
          </ReleaseFormRow>
        </ReleaseFormGrid>

        <ReleaseFormGrid>
          <ReleaseFormRow label="Artist" required>
            <CatalogLookupSelect
              kind="artist"
              value={watch('artist')}
              onChange={(v) => setValue('artist', v, { shouldDirty: true })}
              selectPlaceholder="- Select an artist -"
              addNewLabel="-- Add New Artist --"
              error={errors.artist?.message}
              aria-label="Artist"
            />
          </ReleaseFormRow>

          <ReleaseFormRow label="Label" required>
            <CatalogLookupSelect
              kind="label"
              value={watch('label')}
              onChange={(v) => setValue('label', v, { shouldDirty: true })}
              selectPlaceholder="- Select a label -"
              addNewLabel="-- Add New Label --"
              error={errors.label?.message}
              aria-label="Label"
            />
          </ReleaseFormRow>
        </ReleaseFormGrid>

        <ReleaseFormGrid>
          <ReleaseFormRow label="Release Type" required>
            <TableSelectField
              value={watch('releaseType')}
              onChange={(v) => setValue('releaseType', v as CreateReleaseFormData['releaseType'], { shouldDirty: true })}
              options={RELEASE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              className="w-full"
              aria-label="Release type"
            />
          </ReleaseFormRow>

          <ReleaseFormRow label="Releasing Date" required>
            <DatePickerField
              id="releasing-date"
              label=""
              value={watch('releasingDate')}
              onChange={(v) => setValue('releasingDate', v, { shouldDirty: true })}
              minDate={todayApiDate()}
              className="[&>label]:sr-only w-full"
            />
            {errors.releasingDate ? (
              <p className="mt-1 text-xs text-red-400">{errors.releasingDate.message}</p>
            ) : null}
          </ReleaseFormRow>
        </ReleaseFormGrid>
      </ReleaseFormSection>

      <ReleaseFormSection title="Content & Rights" description="Classification and copyright information.">
        <ReleaseFormGrid3>
          <ReleaseFormRow label="Instrumental">
            <ReleaseYesNoGroup
              name="instrumental"
              value={watch('instrumental')}
              onChange={(v) => setValue('instrumental', v, { shouldDirty: true })}
            />
          </ReleaseFormRow>

          <ReleaseFormRow label="Explicit" required>
            <ReleaseYesNoGroup
              name="explicit"
              value={watch('explicit')}
              onChange={(v) => setValue('explicit', v, { shouldDirty: true })}
            />
          </ReleaseFormRow>

          <ReleaseFormRow label="AI Generated" required>
            <ReleaseYesNoGroup
              name="aiGenerated"
              value={watch('aiGenerated')}
              onChange={(v) => setValue('aiGenerated', v, { shouldDirty: true })}
            />
          </ReleaseFormRow>
        </ReleaseFormGrid3>

        <ReleaseFormGrid3>
          <ReleaseFormRow label="UPC">
            <ProfileInputField
              label=""
              className="[&>label]:sr-only"
              placeholder="Enter UPC"
              error={errors.upc?.message}
              {...register('upc')}
            />
          </ReleaseFormRow>

          <ReleaseFormRow label="P Line">
            <ProfileInputField
              label=""
              className="[&>label]:sr-only"
              placeholder="Enter P Line"
              error={errors.pLine?.message}
              {...register('pLine')}
            />
          </ReleaseFormRow>

          <ReleaseFormRow label="C Line">
            <ProfileInputField
              label=""
              className="[&>label]:sr-only"
              placeholder="Enter C Line"
              error={errors.cLine?.message}
              {...register('cLine')}
            />
          </ReleaseFormRow>
        </ReleaseFormGrid3>
      </ReleaseFormSection>

      <ReleaseFormSection title="Cover Art" description="Add the perfect artwork for your upcoming release.">
        <div className="px-5 py-6 sm:px-8">
          <CoverArtUpload
            preview={coverArtPreview}
            onChange={(file, preview) => {
              setValue('coverArt', file, { shouldDirty: true });
              setValue('coverArtPreview', preview, { shouldDirty: true });
            }}
            error={errors.coverArt?.message as string | undefined}
          />
        </div>
      </ReleaseFormSection>
    </div>
  );
}
