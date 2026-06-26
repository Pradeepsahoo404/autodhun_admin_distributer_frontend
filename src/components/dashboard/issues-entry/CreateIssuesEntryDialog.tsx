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
import { IssuesEntryFormFields } from './IssuesEntryFormFields';

interface CreateIssuesEntryDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  successMessage: string;
  formId: string;
  useCreateMutation: () => readonly [
    (body: Record<string, unknown>) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ];
}

export function CreateIssuesEntryDialog({
  open,
  onClose,
  title,
  successMessage,
  formId,
  useCreateMutation,
}: CreateIssuesEntryDialogProps) {
  const [createEntry, { isLoading }] = useCreateMutation();
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

  const onSubmit = async (data: IssuesEntryFormData) => {
    try {
      await createEntry({
        ...data,
        isrcCode: data.isrcCode.toUpperCase(),
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
          submitLabel="Create"
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
          idPrefix="create-"
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
        />
      </form>
    </AppModal>
  );
}
