'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormFieldLabel, ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { ReleaseLabelSelect } from '@/components/common/ReleaseLabelSelect';
import { TableSelectField } from '@/components/common/TableSelectField';
import { REFERENCE_OVERLAP_ASSET_TYPES } from '@/constants/referenceOverlap';
import type { ReferenceOverlapFormData } from '@/features/reference-overlaps/schemas';
import type { User } from '@/types';

interface ReferenceOverlapFormFieldsProps {
  register: UseFormRegister<ReferenceOverlapFormData>;
  errors: FieldErrors<ReferenceOverlapFormData>;
  idPrefix?: string;
  showAdminSelect?: boolean;
  admins?: User[];
  adminsLoading?: boolean;
  assetType?: string;
  onAssetTypeChange?: (value: string) => void;
  assignedTo?: string;
  onAssignedToChange?: (value: string) => void;
  labelName?: string;
  onLabelNameChange?: (value: string) => void;
}

function resolveUserId(user: User): string {
  return user._id;
}

export function ReferenceOverlapFormFields({
  register,
  errors,
  idPrefix = '',
  showAdminSelect = false,
  admins = [],
  adminsLoading = false,
  assetType = 'Track',
  onAssetTypeChange,
  assignedTo = '',
  onAssignedToChange,
  labelName = '',
  onLabelNameChange,
}: ReferenceOverlapFormFieldsProps) {
  const adminOptions = [
    { value: '', label: adminsLoading ? 'Loading admins...' : 'Select admin' },
    ...admins.map((admin) => ({
      value: resolveUserId(admin),
      label: `${admin.name} (${admin.email})`,
    })),
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <ProfileInputField
        id={`${idPrefix}otherParty`}
        label="Other party"
        placeholder="Other party name"
        required
        error={errors.otherParty?.message ? String(errors.otherParty.message) : undefined}
        {...register('otherParty')}
      />

      <ProfileInputField
        id={`${idPrefix}assetName`}
        label="Asset name"
        placeholder="Asset name"
        required
        error={errors.assetName?.message ? String(errors.assetName.message) : undefined}
        {...register('assetName')}
      />

      <ProfileInputField
        id={`${idPrefix}isrcCode`}
        label="ISRC"
        placeholder="ISRC code"
        required
        error={errors.isrcCode?.message ? String(errors.isrcCode.message) : undefined}
        {...register('isrcCode')}
      />

      <ProfileInputField
        id={`${idPrefix}overlappingAssetName`}
        label="Overlapping asset name"
        placeholder="Overlapping asset name"
        required
        error={
          errors.overlappingAssetName?.message
            ? String(errors.overlappingAssetName.message)
            : undefined
        }
        {...register('overlappingAssetName')}
      />

      <ReleaseLabelSelect
        value={labelName}
        onChange={(value) => onLabelNameChange?.(value)}
        error={errors.labelName?.message ? String(errors.labelName.message) : undefined}
      />

      <div className="min-w-0 space-y-2">
        <FormFieldLabel label="Asset type" required />
        <TableSelectField
          value={assetType}
          onChange={(value) => onAssetTypeChange?.(value)}
          options={REFERENCE_OVERLAP_ASSET_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
          className="w-full min-w-0"
          inModal
          aria-label="Asset type"
        />
        {errors.assetType?.message ? (
          <p className="text-xs text-red-400">{String(errors.assetType.message)}</p>
        ) : null}
      </div>

      {showAdminSelect ? (
        <div className="min-w-0 space-y-2 md:col-span-3">
          <FormFieldLabel label="Assign to admin" required />
          <div className="max-w-md">
            <TableSelectField
              value={assignedTo}
              onChange={(value) => onAssignedToChange?.(value)}
              options={adminOptions}
              className="w-full min-w-0"
              disabled={adminsLoading || admins.length === 0}
              inModal
              aria-label="Assign to admin"
            />
          </div>
          {!adminsLoading && admins.length === 0 ? (
            <p className="text-xs text-neutral-500">
              No active admins found. Invite an admin from Users first.
            </p>
          ) : null}
          {errors.assignedTo?.message ? (
            <p className="text-xs text-red-400">{String(errors.assignedTo.message)}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
