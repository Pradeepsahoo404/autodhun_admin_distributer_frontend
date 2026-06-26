'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { ProfileSectionCard } from '@/components/dashboard/profile/ProfileSectionCard';
import { ProfileSaveButton } from '@/components/dashboard/profile/ProfileSaveButton';
import { useAppSelector } from '@/hooks/useAppStore';
import { useUpdateBankDetailsMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { isProfileComplete } from '@/utils/profileCompletion';
import { bankDetailsSchema, type BankDetailsFormData } from '@/features/profile/profileSchemas';
import { ROUTES, ROLES } from '@/constants';

export default function BankDetailsPage() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [updateBankDetails, { isLoading }] = useUpdateBankDetailsMutation();
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankDetailsFormData>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      swiftCode: '',
      micrCode: '',
    },
  });

  useEffect(() => {
    if (isSuperAdmin) {
      router.replace(ROUTES.PROFILE);
    }
  }, [isSuperAdmin, router]);

  useEffect(() => {
    if (!user) return;
    reset({
      bankName: user.bankDetails?.bankName ?? '',
      accountNumber: user.bankDetails?.accountNumber ?? '',
      ifscCode: user.bankDetails?.ifscCode ?? '',
      swiftCode: user.bankDetails?.swiftCode ?? '',
      micrCode: user.bankDetails?.micrCode ?? '',
    });
  }, [user, reset]);

  const onSubmit = async (data: BankDetailsFormData) => {
    try {
      const response = await updateBankDetails(data).unwrap();
      toast.success(
        isProfileComplete(response.data)
          ? 'Bank details saved — you now have full access to the admin panel'
          : 'Bank details saved successfully',
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isSuperAdmin) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProfileSectionCard
        title="Bank Details"
        description="Payout and royalty settlement information linked to your account."
      >
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <ProfileInputField
            label="Bank name"
            placeholder="e.g. State Bank of India"
            autoComplete="organization"
            autoCapitalize="words"
            className="sm:col-span-2"
            error={errors.bankName?.message}
            onKeyDown={(event) => {
              if (event.key.length === 1 && /\d/.test(event.key)) {
                event.preventDefault();
              }
            }}
            {...register('bankName')}
          />
          <ProfileInputField
            label="Account number"
            placeholder="Enter your account number"
            inputMode="numeric"
            className="sm:col-span-2"
            error={errors.accountNumber?.message}
            {...register('accountNumber')}
          />
          <ProfileInputField
            label="IFSC code"
            placeholder="e.g. SBIN0001234"
            error={errors.ifscCode?.message}
            {...register('ifscCode')}
          />
          <ProfileInputField
            label="SWIFT code"
            placeholder="e.g. SBININBBXXX"
            error={errors.swiftCode?.message}
            {...register('swiftCode')}
          />
          <ProfileInputField
            label="MICR code"
            placeholder="e.g. 400002045"
            className="sm:col-span-2"
            error={errors.micrCode?.message}
            {...register('micrCode')}
          />
        </div>
      </ProfileSectionCard>

      <div className="flex items-center justify-end gap-3 border-t border-[#1a1a1a] pt-6">
        <ProfileSaveButton loading={isLoading} label="Save bank details" />
      </div>
    </form>
  );
}
