'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateYoutubeClaimReleaseMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { claimReleaseFormSchema, onClaimReleaseFormInvalid, type ClaimReleaseFormData } from '@/features/youtube-claim-release/schemas';
import { ClaimReleaseFormFields } from './ClaimReleaseFormFields';

interface CreateClaimReleaseDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateClaimReleaseDialog({ open, onClose }: CreateClaimReleaseDialogProps) {
  const [createClaim, { isLoading }] = useCreateYoutubeClaimReleaseMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimReleaseFormData>({
    resolver: zodResolver(claimReleaseFormSchema),
    defaultValues: {
      senderLabelName: '',
      receiverLabelName: '',
      youtubeLink: '',
      isrcCode: '',
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ClaimReleaseFormData) => {
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
      title="Add Youtube Claim Release"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-claim-release-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-claim-release-form"
        onSubmit={handleSubmit(onSubmit, onClaimReleaseFormInvalid)}
        className={modalFormClass}
      >
        <ClaimReleaseFormFields register={register} errors={errors} idPrefix="create-" />
      </form>
    </AppModal>
  );
}
