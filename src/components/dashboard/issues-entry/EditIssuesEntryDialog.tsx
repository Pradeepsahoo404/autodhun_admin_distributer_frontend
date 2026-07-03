'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useGetUsersQuery } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  issuesEntryFormSchema,
  onIssuesEntryFormInvalid,
  type IssuesEntryFormData,
} from '@/features/issues-entry/schemas';
import type { IssuesAssignedEntry } from '@/types';
import { IssuesEntryFormFields } from './IssuesEntryFormFields';

interface EditIssuesEntryDialogProps {
  open: boolean;
  item: IssuesAssignedEntry | null;
  onClose: () => void;
  title: string;
  successMessage: string;
  formId: string;
  useUpdateMutation: () => readonly [
    (args: { id: string; body: Record<string, unknown> }) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ];
}

export function EditIssuesEntryDialog({
  open,
  item,
  onClose,
  title,
  successMessage,
  formId,
  useUpdateMutation,
}: EditIssuesEntryDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateMutation();
  const { data: usersData, isLoading: adminsLoading } = useGetUsersQuery(
    { page: 1, limit: 100, status: 'active' },
    { skip: !open },
  );
  const admins = usersData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssuesEntryFormData>({
    resolver: zodResolver(issuesEntryFormSchema),
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

  const onSubmit = async (data: IssuesEntryFormData) => {
    if (!item) return;
    try {
      await updateEntry({
        id: item._id,
        body: {
          ...data,
          isrcCode: data.isrcCode.toUpperCase(),
        },
      }).unwrap();
      toast.success(successMessage);
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title={title}
      size="lg"
      className="max-w-4xl"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId={formId}
          submitLabel="Save"
          loading={isLoading}
        />
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit, onIssuesEntryFormInvalid)}
        className={modalFormClass}
      >
        <IssuesEntryFormFields
          register={register}
          errors={errors}
          idPrefix="edit-"
          showAdminSelect
          admins={admins}
          adminsLoading={adminsLoading}
          assetType={assetType}
          onAssetTypeChange={(value) =>
            setValue('assetType', value as IssuesEntryFormData['assetType'], {
              shouldValidate: true,
            })
          }
          assignedTo={assignedTo}
          onAssignedToChange={(value) => setValue('assignedTo', value, { shouldValidate: true })}
          labelName={labelName}
          onLabelNameChange={(value) => setValue('labelName', value, { shouldValidate: true })}
        />
      </form>
    </AppModal>
  );
}
