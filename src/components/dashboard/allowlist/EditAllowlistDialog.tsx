'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateAllowlistEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  allowlistFormSchema,
  onAllowlistFormInvalid,
  type AllowlistFormData,
} from '@/features/allowlist/schemas';
import { AllowlistFormFields } from './AllowlistFormFields';
import type { Allowlist } from '@/types';

interface EditAllowlistDialogProps {
  open: boolean;
  item: Allowlist | null;
  onClose: () => void;
}

export function EditAllowlistDialog({ open, item, onClose }: EditAllowlistDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateAllowlistEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AllowlistFormData>({
    resolver: zodResolver(allowlistFormSchema),
  });

  const labelName = watch('labelName');

  useEffect(() => {
    if (!item) return;
    reset({
      labelName: item.labelName,
      channelLink: item.channelLink,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: AllowlistFormData) => {
    if (!item) return;
    try {
      await updateEntry({ id: item._id, body: data }).unwrap();
      toast.success('Allowlist entry updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Allowlist"
      description={item ? `Label: ${item.labelName}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-allowlist-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-allowlist-form"
        onSubmit={handleSubmit(onSubmit, onAllowlistFormInvalid)}
        className={modalFormClass}
      >
        <AllowlistFormFields
          register={register}
          errors={errors}
          idPrefix="edit-"
          labelName={labelName}
          onLabelNameChange={(value) => setValue('labelName', value, { shouldValidate: true })}
        />
      </form>
    </AppModal>
  );
}
