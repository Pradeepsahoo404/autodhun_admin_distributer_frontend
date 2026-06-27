'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthField } from '@/components/auth/AuthField';
import { AuthButton } from '@/components/auth/AuthButton';
import { SocialButton } from '@/components/auth/SocialButton';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AuthTermsCheckbox } from '@/components/auth/AuthTermsCheckbox';
import { registerSchema, RegisterFormData } from '@/features/auth/schemas';
import { useRegisterMutation } from '@/store/api';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setPendingOtp } from '@/store/slices/authSlice';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { useTermsAcceptance } from '@/hooks/useTermsAcceptance';
import { ROUTES, OTP_PURPOSE } from '@/constants';
import { getApiErrorMessage } from '@/services/apiClient';

const fieldProps = { fieldSize: 'compact' as const };

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleSignIn();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

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

  const onSubmit = async (data: RegisterFormData) => {
    if (!requireTermsChecked()) return;
    try {
      const response = await registerUser({ ...data, acceptTerms: true }).unwrap();
      dispatch(setPendingOtp({ email: data.email, purpose: OTP_PURPOSE.REGISTER }));
      toast.success(response.message);
      router.push(ROUTES.VERIFY_REGISTER);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Registration failed'));
    }
  };

  const handleGoogleSignIn = () => {
    if (!requireTermsChecked()) return;
    void signInWithGoogle(true);
  };

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout wide={showEmailForm}>
        <AuthCard
          compact={showEmailForm}
          title={showEmailForm ? 'Create your account' : undefined}
          subtitle={
            showEmailForm
              ? "We'll send a one-time code to verify your email."
              : 'Select a sign up method to continue'
          }
        >
          <div className={showEmailForm ? 'space-y-3' : 'space-y-4'}>
            {showEmailForm ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-left">
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <AuthField label="First Name" error={errors.firstName?.message} {...fieldProps} {...register('firstName')} />
                  <AuthField label="Last Name" error={errors.lastName?.message} {...fieldProps} {...register('lastName')} />
                  <div className="col-span-2">
                    <AuthField
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      error={errors.email?.message}
                      {...fieldProps}
                      {...register('email')}
                    />
                  </div>
                  <AuthField
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter password"
                    error={errors.password?.message}
                    {...fieldProps}
                    {...register('password')}
                  />
                  <AuthField
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    error={errors.confirmPassword?.message}
                    {...fieldProps}
                    {...register('confirmPassword')}
                  />
                </div>

                <AuthTermsCheckbox
                  variant="register"
                  checked={checked}
                  onChange={handleChange}
                  error={termsError}
                  loading={saving}
                  compact
                />

                <AuthButton type="submit" loading={isLoading} size="compact">
                  Send Verification Code
                </AuthButton>

                <div className="space-y-1 pt-0.5 text-center">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="block w-full text-[13px] font-medium text-neutral-500 hover:text-neutral-300"
                  >
                    Back to sign up methods
                  </button>
                  <p className="text-[13px] text-neutral-500">
                    Already have an account?{' '}
                    <Link href={ROUTES.LOGIN} className="font-medium text-brand-lime hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <>
                <SocialButton provider="email" onClick={() => setShowEmailForm(true)}>
                  Continue with Email
                </SocialButton>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-neutral-800" />
                  <span className="text-xs font-medium text-neutral-600">OR</span>
                  <div className="h-px flex-1 bg-neutral-800" />
                </div>

                <SocialButton provider="google" onClick={handleGoogleSignIn} loading={googleLoading}>
                  Continue with Google
                </SocialButton>

                <p className="pt-1 text-center text-[14px] text-neutral-500">
                  Already have an account?{' '}
                  <Link href={ROUTES.LOGIN} className="font-medium text-brand-lime hover:underline">
                    Sign in
                  </Link>
                </p>

                <AuthTermsCheckbox
                  variant="register"
                  checked={checked}
                  onChange={handleChange}
                  error={termsError}
                  loading={saving}
                />
              </>
            )}
          </div>
        </AuthCard>
      </AuthLayout>
    </AuthGuard>
  );
}
