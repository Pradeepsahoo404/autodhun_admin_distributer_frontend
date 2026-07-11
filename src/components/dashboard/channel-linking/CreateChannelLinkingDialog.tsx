'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateChannelLinkingMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  channelLinkingFormSchema,
  onChannelLinkingFormInvalid,
  type ChannelLinkingFormData,
} from '@/features/channel-linking/schemas';
import { ChannelLinkingFormFields } from './ChannelLinkingFormFields';

interface CreateChannelLinkingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateChannelLinkingDialog({ open, onClose }: CreateChannelLinkingDialogProps) {
  const [createEntry, { isLoading }] = useCreateChannelLinkingMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChannelLinkingFormData>({
    resolver: zodResolver(channelLinkingFormSchema),
    defaultValues: {
      channelLink: '',
      channelName: '',
      totalRevenue90Days: 0,
      totalViews90Days: 0,
    },
  });

  const revenueValue = watch('totalRevenue90Days');

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChannelLinkingFormData) => {
    try {
      await createEntry(data).unwrap();
      toast.success('Channel linking submitted — status: In Process');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Channel Linking"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-channel-linking-form"
          submitLabel="Submit"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-channel-linking-form"
        onSubmit={handleSubmit(onSubmit, onChannelLinkingFormInvalid)}
        className={modalFormClass}
      >
        <ChannelLinkingFormFields
          register={register}
          errors={errors}
          idPrefix="create-"
          revenueValue={Number(revenueValue)}
        />
      </form>
    </AppModal>
  );
}
