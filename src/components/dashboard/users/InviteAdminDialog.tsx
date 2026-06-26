'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { useInviteAdminMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { inviteAdminSchema, type InviteAdminFormData } from '@/features/users/userSchemas';

interface InviteAdminDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InviteAdminDialog({ open, onClose }: InviteAdminDialogProps) {
  const [inviteAdmin, { isLoading }] = useInviteAdminMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteAdminFormData>({
    resolver: zodResolver(inviteAdminSchema),
    defaultValues: { firstName: '', lastName: '', email: '', personalMessage: '' },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: InviteAdminFormData) => {
    try {
      const response = await inviteAdmin({
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        personalMessage: data.personalMessage || undefined,
      }).unwrap();
      toast.success(response.message || 'Admin invited successfully');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Invite Admin"
      description="An email with login credentials will be sent to the new admin."
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="invite-admin-form"
          submitLabel="Send invite"
          loading={isLoading}
        />
      }
    >
      <form id="invite-admin-form" onSubmit={handleSubmit(onSubmit)} className={modalFormClass}>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileInputField
            id="invite-firstName"
            label="First name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <ProfileInputField
            id="invite-lastName"
            label="Last name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <ProfileInputField
          id="invite-email"
          label="Email"
          type="email"
          placeholder="admin@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <ProfileTextareaField
          id="invite-message"
          label="Additional note (optional)"
          placeholder="Add a short note for the invitee (optional)..."
          error={errors.personalMessage?.message}
          {...register('personalMessage')}
        />
      </form>
    </AppModal>
  );
}
