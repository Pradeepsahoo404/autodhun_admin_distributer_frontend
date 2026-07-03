'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateAllowlistEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  allowlistFormSchema,
  onAllowlistFormInvalid,
  type AllowlistFormData,
} from '@/features/allowlist/schemas';
import { AllowlistFormFields } from './AllowlistFormFields';

interface CreateAllowlistDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAllowlistDialog({ open, onClose }: CreateAllowlistDialogProps) {
  const [createEntry, { isLoading }] = useCreateAllowlistEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AllowlistFormData>({
    resolver: zodResolver(allowlistFormSchema),
    defaultValues: {
      labelName: '',
      channelLink: '',
    },
  });

  const labelName = watch('labelName');

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: AllowlistFormData) => {
    try {
      await createEntry(data).unwrap();
      toast.success('Allowlist entry created (status: deactive)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Allowlist"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-allowlist-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-allowlist-form"
        onSubmit={handleSubmit(onSubmit, onAllowlistFormInvalid)}
        className={modalFormClass}
      >
        <AllowlistFormFields
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
