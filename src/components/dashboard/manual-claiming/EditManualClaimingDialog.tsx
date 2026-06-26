'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateManualClaimingEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  manualClaimingFormSchema,
  onManualClaimingFormInvalid,
  type ManualClaimingFormData,
} from '@/features/manual-claiming/schemas';
import { ManualClaimingFormFields } from './ManualClaimingFormFields';
import type { ManualClaiming } from '@/types';

interface EditManualClaimingDialogProps {
  open: boolean;
  item: ManualClaiming | null;
  onClose: () => void;
}

export function EditManualClaimingDialog({ open, item, onClose }: EditManualClaimingDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateManualClaimingEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualClaimingFormData>({
    resolver: zodResolver(manualClaimingFormSchema),
  });

  useEffect(() => {
    if (!item) return;
    reset({
      labelName: item.labelName,
      originalSongLink: item.originalSongLink,
      isrcCode: item.isrcCode,
      songLink: item.songLink,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ManualClaimingFormData) => {
    if (!item) return;
    try {
      await updateEntry({ id: item._id, body: data }).unwrap();
      toast.success('Manual claiming entry updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Manual Claiming"
      description={item ? `ISRC: ${item.isrcCode}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-manual-claiming-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-manual-claiming-form"
        onSubmit={handleSubmit(onSubmit, onManualClaimingFormInvalid)}
        className={modalFormClass}
      >
        <ManualClaimingFormFields register={register} errors={errors} idPrefix="edit-" />
      </form>
    </AppModal>
  );
}
