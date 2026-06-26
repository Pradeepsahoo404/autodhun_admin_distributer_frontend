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

/**
 * Wraps the Google sign-in flow:
 * 1. NextAuth obtains the Google ID token
 * 2. Backend verifies it, creates the user if needed, and returns JWT
 * 3. Redux stores the session and the user is sent to the dashboard
 */
export function useGoogleSignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();

  const signInWithGoogle = useCallback(
    async (acceptTerms = false) => {
      if (!acceptTerms) return;
      try {
        const result = await signIn('google', { redirect: false });
        if (result?.error) {
          toast.error('Google sign-in was cancelled or failed');
          return;
        }

        const sessionRes = await fetch('/api/auth/session');
        const session = (await sessionRes.json()) as { idToken?: string };

        if (!session?.idToken) {
          toast.error('Could not obtain Google credentials');
          return;
        }

        const response = await googleAuth({ idToken: session.idToken, acceptTerms: true }).unwrap();
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
          }),
        );
        await syncUserProfile(dispatch);
        toast.success('Signed in with Google');
        router.push(ROUTES.DASHBOARD);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Google authentication failed';
        toast.error(message);
      }
    },
    [dispatch, googleAuth, router],
  );

  return { signInWithGoogle, isLoading };
}
