'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { ProfileField, ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { useUpdateUserMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { editUserSchema, type EditUserFormData } from '@/features/users/userSchemas';
import type { User } from '@/types';

interface EditUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export function EditUserDialog({ open, user, onClose }: EditUserDialogProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (!user) return;
    reset({ firstName: user.firstName, lastName: user.lastName ?? '' });
  }, [user, reset]);

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EditUserFormData) => {
    if (!user) return;
    try {
      await updateUser({
        id: user._id,
        body: { firstName: data.firstName, lastName: data.lastName || '' },
      }).unwrap();
      toast.success('User updated successfully');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit user"
      description={user ? `Update details for ${user.email}` : undefined}
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-user-form"
          submitLabel="Save changes"
          loading={isLoading}
          submitDisabled={!user}
        />
      }
    >
      <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)} className={modalFormClass}>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileInputField
            id="edit-firstName"
            label="First name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <ProfileInputField
            id="edit-lastName"
            label="Last name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <ProfileField label="Email" value={user?.email} />
      </form>
    </AppModal>
  );
}
