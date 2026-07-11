'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateChannelLinkingMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  channelLinkingFormSchema,
  onChannelLinkingFormInvalid,
  type ChannelLinkingFormData,
} from '@/features/channel-linking/schemas';
import { ChannelLinkingFormFields } from './ChannelLinkingFormFields';
import type { ChannelLinking } from '@/types';

interface EditChannelLinkingDialogProps {
  open: boolean;
  item: ChannelLinking | null;
  onClose: () => void;
}

export function EditChannelLinkingDialog({ open, item, onClose }: EditChannelLinkingDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateChannelLinkingMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChannelLinkingFormData>({
    resolver: zodResolver(channelLinkingFormSchema),
  });

  const revenueValue = watch('totalRevenue90Days');

  useEffect(() => {
    if (!item) return;
    reset({
      channelLink: item.channelLink,
      channelName: item.channelName,
      totalRevenue90Days: item.totalRevenue90Days,
      totalViews90Days: item.totalViews90Days,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChannelLinkingFormData) => {
    if (!item) return;
    try {
      await updateEntry({ id: item._id, body: data }).unwrap();
      toast.success('Channel linking updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Channel Linking"
      description={item ? item.channelName : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-channel-linking-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-channel-linking-form"
        onSubmit={handleSubmit(onSubmit, onChannelLinkingFormInvalid)}
        className={modalFormClass}
      >
        <ChannelLinkingFormFields
          register={register}
          errors={errors}
          idPrefix="edit-"
          revenueValue={Number(revenueValue)}
        />
      </form>
    </AppModal>
  );
}
