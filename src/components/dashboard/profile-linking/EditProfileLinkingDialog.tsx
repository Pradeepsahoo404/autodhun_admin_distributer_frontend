'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useUpdateProfileLinkingEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  profileLinkingFormSchema,
  onProfileLinkingFormInvalid,
  type ProfileLinkingFormData,
} from '@/features/profile-linking/schemas';
import { ProfileLinkingFormFields } from './ProfileLinkingFormFields';
import type { ProfileLinking } from '@/types';

interface EditProfileLinkingDialogProps {
  open: boolean;
  item: ProfileLinking | null;
  onClose: () => void;
}

export function EditProfileLinkingDialog({ open, item, onClose }: EditProfileLinkingDialogProps) {
  const [updateEntry, { isLoading }] = useUpdateProfileLinkingEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileLinkingFormData>({
    resolver: zodResolver(profileLinkingFormSchema),
  });

  useEffect(() => {
    if (!item) return;
    reset({
      labelName: item.labelName,
      isrcCode: item.isrcCode,
      facebookPageLink: item.facebookPageLink,
      instagramHandleName: item.instagramHandleName,
    });
  }, [item, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ProfileLinkingFormData) => {
    if (!item) return;
    try {
      await updateEntry({ id: item._id, body: data }).unwrap();
      toast.success('Profile linking updated');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit Profile Linking"
      description={item ? `ISRC: ${item.isrcCode}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-profile-linking-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!item}
        />
      }
    >
      <form
        id="edit-profile-linking-form"
        onSubmit={handleSubmit(onSubmit, onProfileLinkingFormInvalid)}
        className={modalFormClass}
      >
        <ProfileLinkingFormFields register={register} errors={errors} idPrefix="edit-" />
      </form>
    </AppModal>
  );
}
