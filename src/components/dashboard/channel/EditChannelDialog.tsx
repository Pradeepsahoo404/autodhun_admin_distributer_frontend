'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateChannelMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { channelFormSchema, onChannelFormInvalid, type ChannelFormData } from '@/features/channel/schemas';
import { ChannelFormFields } from './ChannelFormFields';
import type { Channel } from '@/types';

interface EditChannelDialogProps {
  open: boolean;
  item: Channel | null;
  onClose: () => void;
}

export function EditChannelDialog({ open, item, onClose }: EditChannelDialogProps) {
  const [updateChannel, { isLoading }] = useUpdateChannelMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChannelFormData>({
    resolver: zodResolver(channelFormSchema),
  });

  useEffect(() => {
    if (!item) return;
    reset({
      channelName: item.channelName,
      channelLink: item.channelLink,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChannelFormData) => {
    if (!item) return;
    try {
      await updateChannel({ id: item._id, body: data }).unwrap();
      toast.success('Channel updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Channel"
      description={item ? item.channelName : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-channel-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-channel-form"
        onSubmit={handleSubmit(onSubmit, onChannelFormInvalid)}
        className={modalFormClass}
      >
        <ChannelFormFields register={register} errors={errors} idPrefix="edit-" />
      </form>
    </AppModal>
  );
}
