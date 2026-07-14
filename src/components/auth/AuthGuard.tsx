'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { useGetMeQuery } from '@/store/api';
import { setUser } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Client-side route guard. Redirects unauthenticated users away from protected
 * pages and authenticated users away from auth pages.
 */
export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [ready, setReady] = useState(false);

  const { data: meData, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated || !requireAuth,
  });

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (meData?.data) {
      dispatch(setUser(meData.data));
    }
  }, [meData, dispatch]);

  useEffect(() => {
    if (!ready) return;
    if (requireAuth && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
    if (!requireAuth && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [ready, isAuthenticated, requireAuth, router]);

  if (!ready) return null;
  if (requireAuth && isAuthenticated && meLoading && !user) return null;
  if (requireAuth && !isAuthenticated) return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}
