'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateYoutubeClaimReleaseMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { claimReleaseFormSchema, onClaimReleaseFormInvalid, type ClaimReleaseFormData } from '@/features/youtube-claim-release/schemas';
import { ClaimReleaseFormFields } from './ClaimReleaseFormFields';
import type { YoutubeClaimRelease } from '@/types';

interface EditClaimReleaseDialogProps {
  open: boolean;
  item: YoutubeClaimRelease | null;
  onClose: () => void;
}

export function EditClaimReleaseDialog({ open, item, onClose }: EditClaimReleaseDialogProps) {
  const [updateClaim, { isLoading }] = useUpdateYoutubeClaimReleaseMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimReleaseFormData>({
    resolver: zodResolver(claimReleaseFormSchema),
  });

  useEffect(() => {
    if (!item) return;
    reset({
      senderLabelName: item.senderLabelName,
      receiverLabelName: item.receiverLabelName,
      youtubeLink: item.youtubeLink,
      isrcCode: item.isrcCode,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ClaimReleaseFormData) => {
    if (!item) return;
    try {
      await updateClaim({ id: item._id, body: data }).unwrap();
      toast.success('Claim release updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Youtube Claim Release"
      description={item ? `ISRC: ${item.isrcCode}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-claim-release-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-claim-release-form"
        onSubmit={handleSubmit(onSubmit, onClaimReleaseFormInvalid)}
        className={modalFormClass}
      >
        <ClaimReleaseFormFields register={register} errors={errors} idPrefix="edit-" />
      </form>
    </AppModal>
  );
}
