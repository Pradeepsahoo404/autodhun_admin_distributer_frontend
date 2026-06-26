'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateOacEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { oacFormSchema, onOacFormInvalid, type OacFormData } from '@/features/oac/schemas';
import { OacFormFields } from './OacFormFields';

interface CreateOacDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateOacDialog({ open, onClose }: CreateOacDialogProps) {
  const [createEntry, { isLoading }] = useCreateOacEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OacFormData>({
    resolver: zodResolver(oacFormSchema),
    defaultValues: {
      artistChannelName: '',
      artistChannelLink: '',
      artistChannelTopicLink: '',
      isrcCode: '',
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: OacFormData) => {
    try {
      await createEntry(data).unwrap();
      toast.success('OAC entry created (status: deactive)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add OAC"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-oac-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-oac-form"
        onSubmit={handleSubmit(onSubmit, onOacFormInvalid)}
        className={modalFormClass}
      >
        <OacFormFields register={register} errors={errors} idPrefix="create-" />
      </form>
    </AppModal>
  );
}
