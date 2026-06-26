'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateTakedownEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  takedownFormSchema,
  onTakedownFormInvalid,
  type TakedownFormData,
} from '@/features/takedown/schemas';
import { TakedownFormFields } from './TakedownFormFields';

interface CreateTakedownDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTakedownDialog({ open, onClose }: CreateTakedownDialogProps) {
  const [createEntry, { isLoading }] = useCreateTakedownEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TakedownFormData>({
    resolver: zodResolver(takedownFormSchema),
    defaultValues: {
      labelName: '',
      isrcCode: '',
      songLink: '',
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: TakedownFormData) => {
    try {
      await createEntry(data).unwrap();
      toast.success('Takedown entry created (status: deactive)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Takedown"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-takedown-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-takedown-form"
        onSubmit={handleSubmit(onSubmit, onTakedownFormInvalid)}
        className={modalFormClass}
      >
        <TakedownFormFields register={register} errors={errors} idPrefix="create-" />
      </form>
    </AppModal>
  );
}
