'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateContentIdMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  contentIdFormSchema,
  onContentIdFormInvalid,
  type ContentIdFormData,
} from '@/features/content-id/schemas';
import { ContentIdFormFields } from './ContentIdFormFields';
import type { ContentId } from '@/types';

interface EditContentIdDialogProps {
  open: boolean;
  item: ContentId | null;
  onClose: () => void;
}

export function EditContentIdDialog({ open, item, onClose }: EditContentIdDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateContentIdMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentIdFormData>({
    resolver: zodResolver(contentIdFormSchema),
  });

  const labelName = watch('labelName');

  useEffect(() => {
    if (!item) return;
    reset({
      labelName: item.labelName,
      isrcCode: item.isrcCode,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ContentIdFormData) => {
    if (!item) return;
    try {
      await updateEntry({ id: item._id, body: data }).unwrap();
      toast.success('Content ID updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Content ID"
      description={item ? `ISRC: ${item.isrcCode}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-content-id-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-content-id-form"
        onSubmit={handleSubmit(onSubmit, onContentIdFormInvalid)}
        className={modalFormClass}
      >
        <ContentIdFormFields
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
