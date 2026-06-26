'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { useCreateProfileLinkingEntryMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  profileLinkingFormSchema,
  onProfileLinkingFormInvalid,
  type ProfileLinkingFormData,
} from '@/features/profile-linking/schemas';
import { ProfileLinkingFormFields } from './ProfileLinkingFormFields';

interface CreateProfileLinkingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProfileLinkingDialog({ open, onClose }: CreateProfileLinkingDialogProps) {
  const [createEntry, { isLoading }] = useCreateProfileLinkingEntryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileLinkingFormData>({
    resolver: zodResolver(profileLinkingFormSchema),
    defaultValues: {
      labelName: '',
      isrcCode: '',
      facebookPageLink: '',
      instagramHandleName: '',
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ProfileLinkingFormData) => {
    try {
      await createEntry(data).unwrap();
      toast.success('Profile linking created (status: deactive)');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Add Profile Linking"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="create-profile-linking-form"
          submitLabel="Create"
          loading={isLoading}
        />
      }
    >
      <form
        id="create-profile-linking-form"
        onSubmit={handleSubmit(onSubmit, onProfileLinkingFormInvalid)}
        className={modalFormClass}
      >
        <ProfileLinkingFormFields register={register} errors={errors} idPrefix="create-" />
      </form>
    </AppModal>
  );
}
