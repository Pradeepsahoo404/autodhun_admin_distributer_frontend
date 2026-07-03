'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateFacebookClaimReleaseMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  facebookClaimReleaseFormSchema,
  onFacebookClaimReleaseFormInvalid,
  type FacebookClaimReleaseFormData,
} from '@/features/facebook-claim-release/schemas';
import { updateClaimLabelField } from '@/lib/forms/syncClaimLabels';
import { ClaimReleaseFormFields } from './ClaimReleaseFormFields';

interface CreateClaimReleaseDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateClaimReleaseDialog({ open, onClose }: CreateClaimReleaseDialogProps) {
  const [createClaim, { isLoading }] = useCreateFacebookClaimReleaseMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FacebookClaimReleaseFormData>({
    resolver: zodResolver(facebookClaimReleaseFormSchema),
    defaultValues: {
      senderLabelName: '',
      receiverLabelName: '',
      facebookPageLink: '',
      isrcCode: '',
    },
  });

  const senderLabelName = watch('senderLabelName');
  const receiverLabelName = watch('receiverLabelName');

  const handleSenderLabelChange = (value: string) => {
    updateClaimLabelField('senderLabelName', setValue, trigger, value);
  };

  const handleReceiverLabelChange = (value: string) => {
    updateClaimLabelField('receiverLabelName', setValue, trigger, value);
  };

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FacebookClaimReleaseFormData) => {
    try {
      await createClaim(data).unwrap();
      toast.success('Claim release created (status: deactive)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Facebook Claim Release"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-facebook-claim-release-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-facebook-claim-release-form"
        onSubmit={handleSubmit(onSubmit, onFacebookClaimReleaseFormInvalid)}
        className={modalFormClass}
      >
        <ClaimReleaseFormFields
          register={register}
          errors={errors}
          idPrefix="create-"
          senderLabelName={senderLabelName}
          receiverLabelName={receiverLabelName}
          onSenderLabelChange={handleSenderLabelChange}
          onReceiverLabelChange={handleReceiverLabelChange}
        />
      </form>
    </AppModal>
  );
}
