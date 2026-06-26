'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthField } from '@/components/auth/AuthField';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { OtpInput } from '@/components/auth/OtpInput';
import { useOtpTimer } from '@/hooks/useOtpTimer';
import { useAppSelector } from '@/hooks/useAppStore';
import { useResetPasswordMutation, useResendOtpMutation } from '@/store/api';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/features/auth/schemas';
import { ROUTES, OTP_PURPOSE } from '@/constants';
import { getApiErrorMessage } from '@/services/apiClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { pendingEmail, pendingPurpose } = useAppSelector((s) => s.auth);
  const email = pendingEmail ?? '';

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const { seconds, canResend, reset } = useOtpTimer({ initialSeconds: 40 });
  const submittingRef = useRef(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [resend, { isLoading: resending }] = useResendOtpMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (email) {
      setValue('email', email);
    }
  }, [email, setValue]);

  useEffect(() => {
    if (!email || pendingPurpose !== OTP_PURPOSE.FORGOT_PASSWORD) {
      router.replace(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, pendingPurpose, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (submittingRef.current || isLoading) return;

    const code = otp.trim();
    if (code.length !== 6) {
      setOtpError('Enter the complete 6-digit code');
      return;
    }

    submittingRef.current = true;
    setOtpError('');

    try {
      await resetPassword({ ...data, email, otp: code }).unwrap();
      toast.success('Password reset successfully. Please log in.');
      router.push(ROUTES.LOGIN);
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

  if (!email) {
    return null;
  }

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <div className="w-full space-y-8 text-center">
          <div className="w-full px-1">
            <AuthHeading className="sm:text-[34px]">Reset your password</AuthHeading>
            <p className="mt-3 text-[16px] text-neutral-500">
              Enter the 6-digit code sent to{' '}
              <span className="font-medium text-neutral-300">{email}</span> and choose a new password.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[420px] space-y-6 text-left">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <input type="hidden" {...register('email')} />

              <OtpInput
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setValue('otp', value);
                  if (otpError) setOtpError('');
                }}
                error={otpError || errors.otp?.message}
                disabled={isLoading}
              />

              <AuthField
                label="New password"
                type="password"
                autoComplete="new-password"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <AuthField
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <p className="text-center text-[14px] text-neutral-500">
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
              </p>

              <AuthButton type="submit" loading={isLoading}>
                Reset password
              </AuthButton>
            </form>

            <p className="text-center">
              <Link href={ROUTES.FORGOT_PASSWORD} className="text-[15px] font-medium text-brand-lime hover:underline">
                Change email
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>
    </AuthGuard>
  );
}
