'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateChannelMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { channelFormSchema, onChannelFormInvalid, type ChannelFormData } from '@/features/channel/schemas';
import { ChannelFormFields } from './ChannelFormFields';

interface CreateChannelDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateChannelDialog({ open, onClose }: CreateChannelDialogProps) {
  const [createChannel, { isLoading }] = useCreateChannelMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChannelFormData>({
    resolver: zodResolver(channelFormSchema),
    defaultValues: {
      channelName: '',
      channelLink: '',
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChannelFormData) => {
    try {
      await createChannel(data).unwrap();
      toast.success('Channel created (status: active)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Channel"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-channel-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-channel-form"
        onSubmit={handleSubmit(onSubmit, onChannelFormInvalid)}
        className={modalFormClass}
      >
        <ChannelFormFields register={register} errors={errors} idPrefix="create-" />
      </form>
    </AppModal>
  );
}
