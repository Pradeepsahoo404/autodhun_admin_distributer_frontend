'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthField } from '@/components/auth/AuthField';
import { AuthButton } from '@/components/auth/AuthButton';
import { SocialButton } from '@/components/auth/SocialButton';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AuthTermsCheckbox } from '@/components/auth/AuthTermsCheckbox';
import { loginSchema, LoginFormData } from '@/features/auth/schemas';
import { useLoginMutation } from '@/store/api';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setPendingOtp, setCredentials } from '@/store/slices/authSlice';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { useTermsAcceptance } from '@/hooks/useTermsAcceptance';
import { ROUTES, OTP_PURPOSE } from '@/constants';
import { getApiErrorMessage } from '@/services/apiClient';
import { syncUserProfile } from '@/utils/syncUserProfile';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleSignIn();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const emailValue = watch('email');
  const { checked, saving, error: termsError, handleChange, setError: setTermsError } = useTermsAcceptance(
    showEmailForm ? emailValue : undefined,
  );

  const requireTermsChecked = (): boolean => {
    if (checked) {
      setTermsError('');
      return true;
    }
    setTermsError('Please accept the terms to continue');
    return false;
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!requireTermsChecked()) return;
    try {
      const response = await login({ ...data, acceptTerms: true }).unwrap();
      if ('accessToken' in response.data) {
        dispatch(setCredentials({ user: response.data.user, accessToken: response.data.accessToken }));
        await syncUserProfile(dispatch);
        toast.success(response.message);
        router.push(ROUTES.DASHBOARD);
        return;
      }
      dispatch(setPendingOtp({ email: data.email, purpose: OTP_PURPOSE.LOGIN }));
      toast.success(response.message);
      router.push(ROUTES.VERIFY_LOGIN);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Login failed'));
    }
  };

  const handleGoogleSignIn = () => {
    if (!requireTermsChecked()) return;
    void signInWithGoogle(true);
  };

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <div className="w-full space-y-8 text-center">
          <div className="w-full px-1">
            <AuthHeading className="mx-auto max-w-[600px] text-[28px] sm:text-[32px] lg:text-[36px]">
              If you&apos;ve got the beats,
              <br />
              we&apos;ve got the tech.
            </AuthHeading>
            <p className="mt-3 text-[16px] text-neutral-500">
              {showEmailForm ? 'Enter your credentials to continue' : 'Select a login method to continue'}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[420px] space-y-4">
            {showEmailForm ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                <AuthField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
                <AuthField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <div className="flex justify-end">
                  <Link href={ROUTES.FORGOT_PASSWORD} className="text-[13px] font-medium text-brand-lime hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="pt-1">
                  <AuthButton type="submit" loading={isLoading}>
                    Login
                  </AuthButton>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-center text-[14px] font-medium text-neutral-500 hover:text-neutral-300"
                >
                  Back to login methods
                </button>
              </form>
            ) : (
              <>
                <SocialButton provider="email" onClick={() => setShowEmailForm(true)}>
                  Login with Email
                </SocialButton>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-neutral-800" />
                  <span className="text-xs font-medium text-neutral-600">OR</span>
                  <div className="h-px flex-1 bg-neutral-800" />
                </div>

                <SocialButton provider="google" onClick={handleGoogleSignIn} loading={googleLoading}>
                  Continue with Google
                </SocialButton>
              </>
            )}

            <p className="pt-2 text-[14px] leading-relaxed text-neutral-500">
              Don&apos;t have an account?{' '}
              <Link href={ROUTES.REGISTER} className="font-medium text-brand-lime hover:underline">
                Create account
              </Link>
            </p>

            <AuthTermsCheckbox
              variant="login"
              checked={checked}
              onChange={handleChange}
              error={termsError}
              loading={saving}
            />
          </div>
        </div>
      </AuthLayout>
    </AuthGuard>
  );
}
