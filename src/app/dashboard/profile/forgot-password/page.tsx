'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { OtpInput } from '@/components/auth/OtpInput';
import { ProfileField, ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { ProfileSectionCard } from '@/components/dashboard/profile/ProfileSectionCard';
import { ProfileSaveButton } from '@/components/dashboard/profile/ProfileSaveButton';
import { useOtpTimer } from '@/hooks/useOtpTimer';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { useForgotPasswordMutation, useResetPasswordMutation, useResendOtpMutation } from '@/store/api';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/features/auth/schemas';
import { ROUTES, OTP_PURPOSE } from '@/constants';
import { getApiErrorMessage } from '@/services/apiClient';

type Step = 'request' | 'reset';

export default function ProfileForgotPasswordPage() {
  const router = useRouter();
  const { user, canManagePassword } = useAuthAccount();
  const email = user?.email ?? '';

  const [step, setStep] = useState<Step>('request');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const { seconds, canResend, reset } = useOtpTimer({ initialSeconds: 40 });
  const submittingRef = useRef(false);

  const [forgotPassword, { isLoading: sending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();
  const [resend, { isLoading: resending }] = useResendOtpMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!canManagePassword) {
      router.replace(ROUTES.PROFILE);
    }
  }, [canManagePassword, router]);

  useEffect(() => {
    if (email) {
      setValue('email', email);
    }
  }, [email, setValue]);

  const handleSendCode = async () => {
    if (!email || sending) return;

    try {
      const response = await forgotPassword({ email }).unwrap();
      reset(response.data.resendAfter);
      setStep('reset');
      setOtp('');
      setOtpError('');
      resetForm({ email, otp: '', newPassword: '', confirmPassword: '' });
      toast.success(response.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (submittingRef.current || resetting) return;

    const code = otp.trim();
    if (code.length !== 6) {
      setOtpError('Enter the complete 6-digit code');
      return;
    }

    submittingRef.current = true;
    setOtpError('');

    try {
      await resetPassword({ ...data, email, otp: code }).unwrap();
      toast.success('Password reset successfully');
      setStep('request');
      setOtp('');
      resetForm({ email, otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      submittingRef.current = false;
    }
  };

  const handleResend = async () => {
    try {
      const response = await resend({ email, purpose: OTP_PURPOSE.FORGOT_PASSWORD }).unwrap();
      reset(response.data.resendAfter);
      toast.success('A new code has been sent');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (!canManagePassword) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProfileSectionCard
        title="Forgot Password"
        description="Reset your password using a verification code sent to your email."
      >
        {step === 'request' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendCode();
            }}
            className="mt-8 space-y-6"
          >
            <ProfileField label="Email" value={email} />
            <p className="text-[13px] text-neutral-500">
              We&apos;ll send a 6-digit verification code to this email address.
            </p>
            <div className="flex items-center justify-end gap-3 border-t border-[#1a1a1a] pt-6">
              <ProfileSaveButton loading={sending} label="Send verification code" />
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <input type="hidden" {...register('email')} />
            <p className="text-[13px] text-neutral-500">
              Enter the code sent to <span className="font-medium text-neutral-300">{email}</span>
            </p>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-neutral-400">Verification code</label>
              <OtpInput
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setValue('otp', value);
                  if (otpError) setOtpError('');
                }}
                error={otpError || errors.otp?.message}
                disabled={resetting}
              />
            </div>

            <ProfileInputField
              label="New password"
              type="password"
              placeholder="At least 8 characters with uppercase, number & symbol"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <ProfileInputField
              label="Confirm new password"
              type="password"
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <p className="text-[13px] text-neutral-500">
              {canResend ? (
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={resending}
                  className="font-medium text-brand-lime hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              ) : (
                <>Resend code in {seconds}s</>
              )}
              <span className="mx-2 text-neutral-600">·</span>
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setOtp('');
                  setOtpError('');
                }}
                className="font-medium text-brand-lime hover:underline"
              >
                Start over
              </button>
            </p>

            <div className="flex items-center justify-end gap-3 border-t border-[#1a1a1a] pt-6">
              <ProfileSaveButton loading={resetting} label="Reset password" />
            </div>
          </form>
        )}
      </ProfileSectionCard>
    </div>
  );
}
