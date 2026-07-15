'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateReferenceOverlapMutation } from '@/store/api/issues/referenceOverlapsApi';
import { useGetIssueAssigneesQuery } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  onReferenceOverlapFormInvalid,
  referenceOverlapFormSchema,
  type ReferenceOverlapFormData,
} from '@/features/reference-overlaps/schemas';
import { ReferenceOverlapFormFields } from './ReferenceOverlapFormFields';

interface CreateReferenceOverlapDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateReferenceOverlapDialog({ open, onClose }: CreateReferenceOverlapDialogProps) {
  const [createEntry, { isLoading }] = useCreateReferenceOverlapMutation();
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
    defaultValues: {
      otherParty: '',
      assetName: '',
      assetType: 'Track',
      isrcCode: '',
      overlappingAssetName: '',
      labelName: '',
      assignedTo: '',
    },
  });

  const assignedTo = watch('assignedTo');
  const assetType = watch('assetType');
  const labelName = watch('labelName');

  useEffect(() => {
    if (!open) return;
    reset({
      otherParty: '',
      assetName: '',
      assetType: 'Track',
      isrcCode: '',
      overlappingAssetName: '',
      labelName: '',
      assignedTo: '',
    });
  }, [open, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ReferenceOverlapFormData) => {
    try {
      await createEntry({
        ...data,
        isrcCode: data.isrcCode.toUpperCase(),
      }).unwrap();
      toast.success('Reference overlap created and assigned');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Reference Overlap"
      size="lg"
      className="max-w-4xl"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-reference-overlap-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-reference-overlap-form"
        onSubmit={handleSubmit(onSubmit, onReferenceOverlapFormInvalid)}
        className={modalFormClass}
      >
        <ReferenceOverlapFormFields
          register={register}
          errors={errors}
          idPrefix="create-"
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
