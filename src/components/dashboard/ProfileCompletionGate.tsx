'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppStore';
import { useGetMeQuery } from '@/store/api';
import { ROUTES } from '@/constants';
import { isProfileComplete } from '@/utils/profileCompletion';
import { ProfileCompletionOverlay } from '@/components/dashboard/ProfileCompletionOverlay';

/**
 * Blocks dashboard access until required bank details are saved.
 * Profile routes stay reachable so the user can complete bank details.
 */
export function ProfileCompletionGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const [dismissed, setDismissed] = useState(false);

  const { isLoading: meLoading, isFetching: meFetching } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const onProfileRoute = pathname === ROUTES.PROFILE || pathname.startsWith(`${ROUTES.PROFILE}/`);
  const complete = isProfileComplete(user);
  const userReady = Boolean(user) && !meLoading && !meFetching;
  const showPrompt = userReady && !complete && !onProfileRoute && !dismissed;

  useEffect(() => {
    if (complete) setDismissed(false);
  }, [complete]);

  return (
    <>
      {children}
      {showPrompt ? <ProfileCompletionOverlay onClose={() => setDismissed(true)} /> : null}
    </>
  );
}
