'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateContentIdMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  contentIdFormSchema,
  onContentIdFormInvalid,
  type ContentIdFormData,
} from '@/features/content-id/schemas';
import { ContentIdFormFields } from './ContentIdFormFields';

interface CreateContentIdDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentIdDialog({ open, onClose }: CreateContentIdDialogProps) {
  const [createEntry, { isLoading }] = useCreateContentIdMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentIdFormData>({
    resolver: zodResolver(contentIdFormSchema),
    defaultValues: {
      labelName: '',
      isrcCode: '',
    },
  });

  const labelName = watch('labelName');

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ContentIdFormData) => {
    try {
      await createEntry(data).unwrap();
      toast.success('Content ID created (status: deactive)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Content ID"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-content-id-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-content-id-form"
        onSubmit={handleSubmit(onSubmit, onContentIdFormInvalid)}
        className={modalFormClass}
      >
        <ContentIdFormFields
          register={register}
          errors={errors}
          idPrefix="create-"
          labelName={labelName}
          onLabelNameChange={(value) => setValue('labelName', value, { shouldValidate: true })}
        />
      </form>
    </AppModal>
  );
}
