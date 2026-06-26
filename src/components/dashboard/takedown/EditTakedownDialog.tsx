'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateTakedownEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  takedownFormSchema,
  onTakedownFormInvalid,
  type TakedownFormData,
} from '@/features/takedown/schemas';
import { TakedownFormFields } from './TakedownFormFields';
import type { Takedown } from '@/types';

interface EditTakedownDialogProps {
  open: boolean;
  item: Takedown | null;
  onClose: () => void;
}

export function EditTakedownDialog({ open, item, onClose }: EditTakedownDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateTakedownEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TakedownFormData>({
    resolver: zodResolver(takedownFormSchema),
  });

  useEffect(() => {
    if (!item) return;
    reset({
      labelName: item.labelName,
      isrcCode: item.isrcCode,
      songLink: item.songLink,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: TakedownFormData) => {
    if (!item) return;
    try {
      await updateEntry({ id: item._id, body: data }).unwrap();
      toast.success('Takedown entry updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Takedown"
      description={item ? `ISRC: ${item.isrcCode}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-takedown-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-takedown-form"
        onSubmit={handleSubmit(onSubmit, onTakedownFormInvalid)}
        className={modalFormClass}
      >
        <TakedownFormFields register={register} errors={errors} idPrefix="edit-" />
      </form>
    </AppModal>
  );
}
