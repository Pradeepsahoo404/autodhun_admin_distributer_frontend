'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useGetIssueAssigneesQuery, useUpdateReferenceOverlapMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  onReferenceOverlapFormInvalid,
  referenceOverlapFormSchema,
  type ReferenceOverlapFormData,
} from '@/features/reference-overlaps/schemas';
import type { ReferenceOverlap } from '@/types';
import { ReferenceOverlapFormFields } from './ReferenceOverlapFormFields';

interface EditReferenceOverlapDialogProps {
  open: boolean;
  item: ReferenceOverlap | null;
  onClose: () => void;
}

export function EditReferenceOverlapDialog({ open, item, onClose }: EditReferenceOverlapDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateReferenceOverlapMutation();
  const { data: usersData, isLoading: adminsLoading } = useGetIssueAssigneesQuery(undefined, {
    skip: !open,
  });
  const admins = usersData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReferenceOverlapFormData>({
    resolver: zodResolver(referenceOverlapFormSchema),
  });

  const assignedTo = watch('assignedTo');
  const assetType = watch('assetType');
  const labelName = watch('labelName');

  useEffect(() => {
    if (!item || !open) return;
    reset({
      otherParty: item.otherParty,
      assetName: item.assetName,
      assetType: item.assetType,
      isrcCode: item.isrcCode,
      overlappingAssetName: item.overlappingAssetName,
      labelName: item.labelName,
      assignedTo: item.assignedTo?._id ?? '',
    });
  }, [item, open, reset]);

  const close = () => onClose();

  const onSubmit = async (data: ReferenceOverlapFormData) => {
    if (!item) return;
    try {
      await updateEntry({
        id: item._id,
        body: {
          ...data,
          isrcCode: data.isrcCode.toUpperCase(),
        },
      }).unwrap();
      toast.success('Reference overlap updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Reference Overlap"
      size="lg"
      className="max-w-4xl"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-reference-overlap-form"
          submitLabel="Save"
          loading={isLoading}
        />
      }
    >
      <form
        id="edit-reference-overlap-form"
        onSubmit={handleSubmit(onSubmit, onReferenceOverlapFormInvalid)}
        className={modalFormClass}
      >
        <ReferenceOverlapFormFields
          register={register}
          errors={errors}
          idPrefix="edit-"
          showAdminSelect
          admins={admins}
          adminsLoading={adminsLoading}
          assetType={assetType}
          onAssetTypeChange={(value) => setValue('assetType', value as ReferenceOverlapFormData['assetType'], { shouldValidate: true })}
          assignedTo={assignedTo}
          onAssignedToChange={(value) => setValue('assignedTo', value, { shouldValidate: true })}
          labelName={labelName}
          onLabelNameChange={(value) => setValue('labelName', value, { shouldValidate: true })}
        />
      </form>
    </AppModal>
  );
}
