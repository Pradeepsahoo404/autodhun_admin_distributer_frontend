'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AppModal, modalFormClass } from '@/components/common/AppModal';
import { ModalFormFooter } from '@/components/common/ModalFormFooter';
import { ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { editUserSchema, type EditUserFormData } from '@/features/users/userSchemas';
import { UserDetailTabs } from './UserDetailTabs';
import { UserDetailsHeader } from './UserDetailsContent';
import type { User } from '@/types';

interface EditUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export function EditUserDialog({ open, user, onClose }: EditUserDialogProps) {
  const [tab, setTab] = useState<'general' | 'bank'>('general');
  const { data, isLoading } = useGetUserByIdQuery(user?._id ?? '', {
    skip: !open || !user?._id,
  });
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

  const details = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (!details) return;
    reset({
      firstName: details.firstName ?? '',
      lastName: details.lastName ?? '',
      postalAddress: details.profile?.postalAddress ?? '',
      state: details.profile?.state ?? '',
      countryRegion: details.profile?.countryRegion ?? '',
      phoneNumber: details.profile?.phoneNumber ?? '',
      labelName: details.profile?.labelName ?? '',
      bankName: details.bankDetails?.bankName ?? '',
      accountNumber: details.bankDetails?.accountNumber ?? '',
      ifscCode: details.bankDetails?.ifscCode ?? '',
      swiftCode: details.bankDetails?.swiftCode ?? '',
      micrCode: details.bankDetails?.micrCode ?? '',
    });
  }, [details, reset]);

  const close = () => {
    setTab('general');
    reset();
    onClose();
  };

  const onSubmit = async (formData: EditUserFormData) => {
    if (!user) return;
    try {
      await updateUser({
        id: user._id,
        body: formData,
      }).unwrap();
      toast.success('Admin updated successfully');
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={close}
      title="Edit admin"
      description={user ? `Update profile for ${user.email}` : undefined}
      size="xl"
      footer={
        <ModalFormFooter
          onCancel={close}
          formId="edit-user-form"
          submitLabel="Save changes"
          loading={saving}
          submitDisabled={!user || isLoading || !details}
        />
      }
    >
      {isLoading || !details ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-lime" />
        </div>
      ) : (
        <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)} className={modalFormClass}>
          <UserDetailsHeader user={details} />
          <UserDetailTabs active={tab} onChange={setTab} />

          {tab === 'general' ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              <ProfileTextareaField
                label="Postal address"
                placeholder="Street, city, ZIP"
                className="sm:col-span-2"
                error={errors.postalAddress?.message}
                {...register('postalAddress')}
              />
              <ProfileInputField label="State" error={errors.state?.message} {...register('state')} />
              <ProfileInputField
                label="Country / Region"
                error={errors.countryRegion?.message}
                {...register('countryRegion')}
              />
              <ProfileInputField
                label="Phone number"
                type="tel"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />
              <ProfileInputField label="Label name" error={errors.labelName?.message} {...register('labelName')} />
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileInputField
                label="Bank name"
                placeholder="e.g. State Bank of India"
                className="sm:col-span-2"
                error={errors.bankName?.message}
                {...register('bankName')}
              />
              <ProfileInputField
                label="Account number"
                inputMode="numeric"
                className="sm:col-span-2"
                error={errors.accountNumber?.message}
                {...register('accountNumber')}
              />
              <ProfileInputField label="IFSC code" error={errors.ifscCode?.message} {...register('ifscCode')} />
              <ProfileInputField label="SWIFT code" error={errors.swiftCode?.message} {...register('swiftCode')} />
              <ProfileInputField
                label="MICR code"
                className="sm:col-span-2"
                error={errors.micrCode?.message}
                {...register('micrCode')}
              />
            </div>
          )}
        </form>
      )}
    </AppModal>
  );
}
