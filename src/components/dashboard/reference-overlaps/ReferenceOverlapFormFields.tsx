'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
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
        error={errors.otherParty?.message ? String(errors.otherParty.message) : undefined}
        {...register('otherParty')}
      />

      <ProfileInputField
        id={`${idPrefix}assetName`}
        label="Asset name"
        placeholder="Asset name"
        error={errors.assetName?.message ? String(errors.assetName.message) : undefined}
        {...register('assetName')}
      />

      <ProfileInputField
        id={`${idPrefix}isrcCode`}
        label="ISRC"
        placeholder="ISRC code"
        error={errors.isrcCode?.message ? String(errors.isrcCode.message) : undefined}
        {...register('isrcCode')}
      />

      <ProfileInputField
        id={`${idPrefix}overlappingAssetName`}
        label="Overlapping asset name"
        placeholder="Overlapping asset name"
        error={
          errors.overlappingAssetName?.message
            ? String(errors.overlappingAssetName.message)
            : undefined
        }
        {...register('overlappingAssetName')}
      />

      <ProfileInputField
        id={`${idPrefix}labelName`}
        label="Label"
        placeholder="Label name"
        error={errors.labelName?.message ? String(errors.labelName.message) : undefined}
        {...register('labelName')}
      />

      <div className="min-w-0 space-y-2">
        <label className="text-[13px] font-medium text-neutral-400">Asset type</label>
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
          <label className="text-[13px] font-medium text-neutral-400">Assign to admin</label>
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
