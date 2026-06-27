'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { OtpInput } from '@/components/auth/OtpInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useOtpTimer } from '@/hooks/useOtpTimer';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setCredentials } from '@/store/slices/authSlice';
import { useVerifyRegisterOtpMutation, useResendOtpMutation } from '@/store/api';
import { ROUTES, OTP_PURPOSE } from '@/constants';
import { getApiErrorMessage } from '@/services/apiClient';

export default function VerifyRegisterOtpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pendingEmail } = useAppSelector((s) => s.auth);
  const email = pendingEmail ?? '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { seconds, canResend, reset } = useOtpTimer({ initialSeconds: 40 });

  const [verify, { isLoading }] = useVerifyRegisterOtpMutation();
  const [resend, { isLoading: resending }] = useResendOtpMutation();
  const verifyingRef = useRef(false);

  const handleVerify = useCallback(
    async (code?: string) => {
      if (verifyingRef.current || isLoading) return;
      const value = code ?? otp;
      if (value.length !== 6) {
        setError('Enter the complete 6-digit code');
        return;
      }
      verifyingRef.current = true;
      try {
        const response = await verify({ email, otp: value }).unwrap();
        dispatch(setCredentials({ user: response.data.user, accessToken: response.data.accessToken }));
        toast.success('Account verified successfully');
        router.push(ROUTES.LOGIN);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Invalid code'));
      } finally {
        verifyingRef.current = false;
      }
    },
    [dispatch, email, isLoading, otp, router, verify],
  );

  const handleResend = async () => {
    try {
      const response = await resend({ email, purpose: OTP_PURPOSE.REGISTER }).unwrap();
      reset(response.data.resendAfter);
      toast.success('A new code has been sent');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  useEffect(() => {
    if (!email) {
      router.replace(ROUTES.REGISTER);
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <AuthCard
          title="Verify your email"
          subtitle={
            <>
              Enter the 6 digit code we just sent to{' '}
              <span className="font-medium text-neutral-300">{email}</span>
            </>
          }
        >
          <div className="space-y-6 text-left">
            <OtpInput value={otp} onChange={setOtp} onComplete={handleVerify} error={error} disabled={isLoading} />

            <p className="text-center text-[14px] text-neutral-500">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-medium text-brand-lime hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <>Resend OTP in {seconds}s</>
              )}
            </p>

            <AuthButton onClick={() => handleVerify()} loading={isLoading}>
              Submit
            </AuthButton>

            <p className="text-center">
              <Link href={ROUTES.REGISTER} className="text-[15px] font-medium text-brand-lime hover:underline">
                Change email
              </Link>
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    </AuthGuard>
  );
}
