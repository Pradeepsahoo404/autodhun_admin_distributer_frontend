import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { TOKEN_STORAGE_KEY } from '@/constants';
import { logout, setAccessToken } from '@/store/slices/authSlice';
import type { RootState } from '@/store';
import { forceLogoutForInactiveAccount, isAccountInactiveError, shouldSkipInactiveLogoutRedirect } from '@/utils/accountAccess';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const getRequestUrl = (args: string | FetchArgs): string =>
  typeof args === 'string' ? args : args.url;

/** Endpoints where 401 is an expected business error — do not refresh the session. */
const SKIP_REAUTH_ON_401_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-register-otp',
  '/auth/verify-login-otp',
  '/auth/resend-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/google',
  '/auth/accept-terms',
  '/auth/terms-status',
  '/auth/refresh-token',
  '/auth/me/change-password',
];

const shouldSkipReauthOn401 = (args: string | FetchArgs): boolean => {
  const url = getRequestUrl(args);
  return SKIP_REAUTH_ON_401_PATHS.some((path) => url.includes(path));
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && isAccountInactiveError(result.error)) {
    api.dispatch(logout());
    if (!shouldSkipInactiveLogoutRedirect(getRequestUrl(args))) {
      forceLogoutForInactiveAccount();
    }
    return result;
  }

  // Wrong password / validation failures must not cascade into refresh-token spam.
  if (result.error?.status === 401 && !shouldSkipReauthOn401(args)) {
    const refresh = await rawBaseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions,
    );

    if (refresh.error && isAccountInactiveError(refresh.error)) {
      api.dispatch(logout());
      forceLogoutForInactiveAccount();
      return result;
    }

    if (refresh.data) {
      const accessToken = (refresh.data as { data: { accessToken: string } }).data.accessToken;
      api.dispatch(setAccessToken(accessToken));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.location.href = '/login';
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Users', 'Roles', 'Modules', 'Permissions', 'Sidebar', 'Notifications', 'CronjobSettings', 'ReferenceOverlaps', 'InvalidReferences', 'OwnershipTransfers', 'PotentialClaims', 'DisputedClaims', 'AppealedClaims', 'YoutubeClaimReleases', 'FacebookClaimReleases', 'ContentIds', 'Oac', 'ProfileLinking', 'Allowlist', 'ManualClaiming', 'Takedown', 'MusicReleases', 'ReleaseCatalog', 'LabelTransfer', 'LabelUpdate', 'Channels', 'ChannelLinking'],
  endpoints: () => ({}),
});
