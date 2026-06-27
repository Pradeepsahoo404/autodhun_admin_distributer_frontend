'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthField } from '@/components/auth/AuthField';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/schemas';
import { useForgotPasswordMutation } from '@/store/api';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setPendingOtp } from '@/store/slices/authSlice';
import { ROUTES, OTP_PURPOSE } from '@/constants';
import { getApiErrorMessage } from '@/services/apiClient';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();
      dispatch(setPendingOtp({ email: data.email, purpose: OTP_PURPOSE.FORGOT_PASSWORD }));
      toast.success(response.message);
      router.push(ROUTES.RESET_PASSWORD);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <AuthCard
          title="Forgot your password?"
          subtitle="Enter your account email and we'll send you a verification code to reset your password."
        >
          <div className="space-y-6 text-left">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AuthField
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
              />
              <AuthButton type="submit" loading={isLoading}>
                Send verification code
              </AuthButton>
            </form>

            <p className="text-center">
              <Link href={ROUTES.LOGIN} className="text-[15px] font-medium text-brand-lime hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    </AuthGuard>
  );
}
