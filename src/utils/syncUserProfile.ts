import type { AppDispatch } from '@/store';
import { authApi } from '@/store/api';
import { setUser } from '@/store/slices/authSlice';

/** Loads the latest user profile (including avatarUrl) from `/auth/me`. */
export async function syncUserProfile(dispatch: AppDispatch): Promise<void> {
  const result = await dispatch(
    authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true, subscribe: false }),
  );

  if ('data' in result && result.data?.data) {
    dispatch(setUser(result.data.data));
  }
}
