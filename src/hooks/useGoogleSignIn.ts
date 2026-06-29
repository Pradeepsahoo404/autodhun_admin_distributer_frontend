'use client';

import { useCallback, useEffect, useRef } from 'react';
import { signIn, getSession, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGoogleAuthMutation } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants';
import { syncUserProfile } from '@/utils/syncUserProfile';
import { getApiErrorMessage } from '@/services/apiClient';

const GOOGLE_AUTH_PENDING_KEY = 'google-auth-pending';
const SESSION_RETRY_MS = 350;
const SESSION_MAX_RETRIES = 12;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Google sign-in flow:
 * 1. Redirect to Google via NextAuth
 * 2. After callback, read idToken from NextAuth session (with retries)
 * 3. Exchange idToken with backend for app JWT and go to dashboard
 */
export function useGoogleSignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: session, status, update } = useSession();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();
  const completingRef = useRef(false);
  const resumeStartedRef = useRef(false);

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
      sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
      resumeStartedRef.current = false;
      toast.success('Signed in with Google');
      router.push(ROUTES.DASHBOARD);
    },
    [dispatch, googleAuth, router],
  );

  const resolveIdToken = useCallback(async (): Promise<string | null> => {
    if (session?.idToken) return session.idToken;

    await update();
    const refreshed = await getSession();
    return refreshed?.idToken ?? null;
  }, [session?.idToken, update]);

  /** Resume after Google redirects back — polls until NextAuth session + idToken are ready. */
  useEffect(() => {
    if (isAuthenticated || completingRef.current) return;
    if (sessionStorage.getItem(GOOGLE_AUTH_PENDING_KEY) !== '1') return;
    if (status === 'loading') return;
    if (resumeStartedRef.current) return;

    resumeStartedRef.current = true;
    let cancelled = false;

    const resume = async () => {
      for (let attempt = 0; attempt < SESSION_MAX_RETRIES; attempt += 1) {
        if (cancelled || isAuthenticated || completingRef.current) return;

        const idToken = await resolveIdToken();
        if (idToken) {
          completingRef.current = true;
          try {
            await completeGoogleAuth(idToken);
          } catch (error) {
            sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
            toast.error(getApiErrorMessage(error, 'Google authentication failed'));
          } finally {
            completingRef.current = false;
            resumeStartedRef.current = false;
          }
          return;
        }

        if (attempt < SESSION_MAX_RETRIES - 1) {
          await sleep(SESSION_RETRY_MS);
        }
      }

      resumeStartedRef.current = false;
      sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
      toast.error('Could not obtain Google credentials. Please try again.');
    };

    void resume();

    return () => {
      cancelled = true;
      resumeStartedRef.current = false;
    };
  }, [status, isAuthenticated, completeGoogleAuth, resolveIdToken]);

  const signInWithGoogle = useCallback(
    async (acceptTerms = false) => {
      if (!acceptTerms) return;
      try {
        resumeStartedRef.current = false;
        sessionStorage.setItem(GOOGLE_AUTH_PENDING_KEY, '1');

        const result = await signIn('google', {
          redirect: false,
          callbackUrl: window.location.href,
        });

        if (result?.error) {
          sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
          toast.error('Google sign-in was cancelled or failed');
          return;
        }

        if (result?.url) {
          window.location.href = result.url;
          return;
        }

        for (let attempt = 0; attempt < SESSION_MAX_RETRIES; attempt += 1) {
          const idToken = await resolveIdToken();
          if (idToken) {
            await completeGoogleAuth(idToken);
            return;
          }
          await sleep(SESSION_RETRY_MS);
        }

        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
        toast.error('Could not obtain Google credentials');
      } catch (error) {
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_KEY);
        toast.error(getApiErrorMessage(error, 'Google authentication failed'));
      }
    },
    [completeGoogleAuth, resolveIdToken],
  );

  return { signInWithGoogle, isLoading };
}
