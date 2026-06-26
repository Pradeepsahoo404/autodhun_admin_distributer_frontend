'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { useGetMeQuery } from '@/store/api';
import { setUser } from '@/store/slices/authSlice';

/** Keeps Redux user profile in sync with the server (avatar, name, etc.). */
export function UserProfileSync() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const { data } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  return null;
}
