'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateFacebookClaimReleaseMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  facebookClaimReleaseFormSchema,
  onFacebookClaimReleaseFormInvalid,
  type FacebookClaimReleaseFormData,
} from '@/features/facebook-claim-release/schemas';
import { ClaimReleaseFormFields } from './ClaimReleaseFormFields';
import type { FacebookClaimRelease } from '@/types';

interface EditClaimReleaseDialogProps {
  open: boolean;
  item: FacebookClaimRelease | null;
  onClose: () => void;
}

export function EditClaimReleaseDialog({ open, item, onClose }: EditClaimReleaseDialogProps) {
  const [updateClaim, { isLoading }] = useUpdateFacebookClaimReleaseMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FacebookClaimReleaseFormData>({
    resolver: zodResolver(facebookClaimReleaseFormSchema),
  });

  useEffect(() => {
    if (!item) return;
    reset({
      senderLabelName: item.senderLabelName,
      receiverLabelName: item.receiverLabelName,
      facebookPageLink: item.facebookPageLink,
      isrcCode: item.isrcCode,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FacebookClaimReleaseFormData) => {
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
      title="Edit Facebook Claim Release"
      description={item ? `ISRC: ${item.isrcCode}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-facebook-claim-release-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-facebook-claim-release-form"
        onSubmit={handleSubmit(onSubmit, onFacebookClaimReleaseFormInvalid)}
        className={modalFormClass}
      >
        <ClaimReleaseFormFields register={register} errors={errors} idPrefix="edit-" />
      </form>
    </AppModal>
  );
}
