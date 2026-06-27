'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { ProfileSectionCard } from '@/components/dashboard/profile/ProfileSectionCard';
import { ProfileSaveButton } from '@/components/dashboard/profile/ProfileSaveButton';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { useChangePasswordMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { changePasswordSchema, type ChangePasswordFormData } from '@/features/profile/profileSchemas';
import { ROUTES } from '@/constants';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { canManagePassword } = useAuthAccount();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  useEffect(() => {
    if (!canManagePassword) {
      router.replace(ROUTES.PROFILE);
    }
  }, [canManagePassword, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      reset();
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (!canManagePassword) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProfileSectionCard
        title="Change Password"
        description="Update your password to keep your account secure."
      >
        <div className="mt-8 space-y-5">
          <ProfileInputField
            label="Current password"
            type="password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            required
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <ProfileInputField
            label="New password"
            type="password"
            placeholder="At least 8 characters with uppercase, number & symbol"
            autoComplete="new-password"
            required
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <ProfileInputField
            label="Confirm new password"
            type="password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>
      </ProfileSectionCard>

      <div className="flex items-center justify-end gap-3 border-t border-[#1a1a1a] pt-6">
        <ProfileSaveButton loading={isLoading} label="Update password" />
      </div>
    </form>
  );
}
