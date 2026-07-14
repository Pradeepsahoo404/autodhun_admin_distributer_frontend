'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useGoogleAuthMutation } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants';
import { syncUserProfile } from '@/utils/syncUserProfile';
import { getApiErrorMessage } from '@/services/apiClient';
import { fetchGoogleIdToken } from '@/features/auth/googleIdToken';
import { signOut } from 'next-auth/react';
import { getPostLoginRoute } from '@/utils/postLoginRoute';

/** Finishes Google sign-in after NextAuth OAuth callback. */
export default function GoogleCompletePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [googleAuth] = useGoogleAuthMutation();
  const startedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(getPostLoginRoute(user));
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    const complete = async () => {
      const idToken = await fetchGoogleIdToken();
      if (!idToken) {
        toast.error('Could not complete Google sign-in. Please try again.');
        router.replace(ROUTES.LOGIN);
        return;
      }

      try {
        const response = await googleAuth({ idToken, acceptTerms: true }).unwrap();
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
          }),
        );
        await syncUserProfile(dispatch);
        await signOut({ redirect: false });
        toast.success('Signed in with Google');
        router.replace(getPostLoginRoute(response.data.user));
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Google authentication failed'));
        router.replace(ROUTES.LOGIN);
      }
    };

    void complete();
  }, [dispatch, googleAuth, isAuthenticated, router, user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
      <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      <p className="text-sm text-neutral-400">Completing Google sign-in…</p>
    </div>
  );
}
