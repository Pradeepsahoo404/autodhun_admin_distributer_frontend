'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ProfileField, ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { ProfileSectionCard } from '@/components/dashboard/profile/ProfileSectionCard';
import { ProfileSaveButton } from '@/components/dashboard/profile/ProfileSaveButton';
import { useAppSelector } from '@/hooks/useAppStore';
import { useUpdateProfileMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { generalProfileSchema, type GeneralProfileFormData } from '@/features/profile/profileSchemas';

export function GeneralProfileForm() {
  const { user } = useAppSelector((s) => s.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralProfileFormData>({
    resolver: zodResolver(generalProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      postalAddress: '',
      state: '',
      countryRegion: '',
      phoneNumber: '',
      labelName: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      postalAddress: user.profile?.postalAddress ?? '',
      state: user.profile?.state ?? '',
      countryRegion: user.profile?.countryRegion ?? '',
      phoneNumber: user.profile?.phoneNumber ?? '',
      labelName: user.profile?.labelName ?? '',
    });
  }, [user, reset]);

  const onSubmit = async (data: GeneralProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProfileSectionCard title="Your Details" description="Update your personal and contact information.">
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <ProfileInputField
            label="First name"
            autoComplete="given-name"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <ProfileInputField
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <ProfileField label="Email" value={user?.email} className="sm:col-span-2" />
          <ProfileTextareaField
            label="Postal address"
            placeholder="Street, city, ZIP"
            className="sm:col-span-2"
            required
            error={errors.postalAddress?.message}
            {...register('postalAddress')}
          />
          <ProfileInputField label="State" required error={errors.state?.message} {...register('state')} />
          <ProfileInputField
            label="Country / Region"
            required
            error={errors.countryRegion?.message}
            {...register('countryRegion')}
          />
          <ProfileInputField
            label="Phone number"
            type="tel"
            autoComplete="tel"
            required
            error={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />
          <ProfileInputField label="Label name" required error={errors.labelName?.message} {...register('labelName')} />
        </div>
      </ProfileSectionCard>

      <div className="flex items-center justify-end gap-3 border-t border-[#1a1a1a] pt-6">
        <ProfileSaveButton loading={isLoading} />
      </div>
    </form>
  );
}
