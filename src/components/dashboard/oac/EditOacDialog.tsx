'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateOacEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { oacFormSchema, onOacFormInvalid, type OacFormData } from '@/features/oac/schemas';
import { OacFormFields } from './OacFormFields';
import type { Oac } from '@/types';

interface EditOacDialogProps {
  open: boolean;
  item: Oac | null;
  onClose: () => void;
}

export function EditOacDialog({ open, item, onClose }: EditOacDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateOacEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OacFormData>({
    resolver: zodResolver(oacFormSchema),
  });

  useEffect(() => {
    if (!item) return;
    reset({
      artistChannelName: item.artistChannelName,
      artistChannelLink: item.artistChannelLink,
      artistChannelTopicLink: item.artistChannelTopicLink,
      isrcCode: item.isrcCode,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: OacFormData) => {
    if (!item) return;
    try {
      await updateEntry({ id: item._id, body: data }).unwrap();
      toast.success('OAC entry updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit OAC"
      description={item ? `ISRC: ${item.isrcCode}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-oac-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-oac-form"
        onSubmit={handleSubmit(onSubmit, onOacFormInvalid)}
        className={modalFormClass}
      >
        <OacFormFields register={register} errors={errors} idPrefix="edit-" />
      </form>
    </AppModal>
  );
}
