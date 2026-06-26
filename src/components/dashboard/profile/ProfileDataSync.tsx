'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppStore';
import { authApi } from '@/store/api';
import { setUser } from '@/store/slices/authSlice';

/** Loads the latest profile and bank details when entering the profile section. */
export function ProfileDataSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void (async () => {
      const result = await dispatch(
        authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true, subscribe: false }),
      );
      if ('data' in result && result.data?.data) {
        dispatch(setUser(result.data.data));
      }
    })();
  }, [dispatch]);

  return null;
}
