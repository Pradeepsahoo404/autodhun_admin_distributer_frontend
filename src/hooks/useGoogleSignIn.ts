'use client';

import { useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGoogleAuthMutation } from '@/store/api';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants';
import { syncUserProfile } from '@/utils/syncUserProfile';
import { getApiErrorMessage } from '@/services/apiClient';
import { fetchGoogleIdToken, googleCompleteCallbackUrl } from '@/features/auth/googleIdToken';
import { signOut } from 'next-auth/react';
import { getPostLoginRoute } from '@/utils/postLoginRoute';

/**
 * Google sign-in flow:
 * 1. Redirect to Google via NextAuth (callback → /auth/google-complete)
 * 2. Completion page reads idToken server-side and exchanges with backend
 */
export function useGoogleSignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();

  const completeGoogleAuth = useCallback(
    async (idToken: string) => {
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
      router.push(getPostLoginRoute(response.data.user));
    },
    [dispatch, googleAuth, router],
  );

  const signInWithGoogle = useCallback(
    async (acceptTerms = false) => {
      if (!acceptTerms) return;
      try {
        const result = await signIn('google', {
          redirect: false,
          callbackUrl: googleCompleteCallbackUrl(),
        });

        if (result?.error) {
          toast.error('Google sign-in was cancelled or failed');
          return;
        }

        if (result?.url) {
          window.location.href = result.url;
          return;
        }

        const idToken = await fetchGoogleIdToken();
        if (!idToken) {
          toast.error('Could not obtain Google credentials');
          return;
        }

        await completeGoogleAuth(idToken);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Google authentication failed'));
      }
    },
    [completeGoogleAuth],
  );

  return { signInWithGoogle, isLoading };
}
