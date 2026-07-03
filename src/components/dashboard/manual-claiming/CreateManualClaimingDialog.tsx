'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateManualClaimingEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  manualClaimingFormSchema,
  onManualClaimingFormInvalid,
  type ManualClaimingFormData,
} from '@/features/manual-claiming/schemas';
import { ManualClaimingFormFields } from './ManualClaimingFormFields';

interface CreateManualClaimingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateManualClaimingDialog({ open, onClose }: CreateManualClaimingDialogProps) {
  const [createEntry, { isLoading }] = useCreateManualClaimingEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ManualClaimingFormData>({
    resolver: zodResolver(manualClaimingFormSchema),
    defaultValues: {
      labelName: '',
      originalSongLink: '',
      isrcCode: '',
      songLink: '',
    },
  });

  const labelName = watch('labelName');

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ManualClaimingFormData) => {
    try {
      await createEntry(data).unwrap();
      toast.success('Manual claiming entry created (status: deactive)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Manual Claiming"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-manual-claiming-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-manual-claiming-form"
        onSubmit={handleSubmit(onSubmit, onManualClaimingFormInvalid)}
        className={modalFormClass}
      >
        <ManualClaimingFormFields
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
