import { baseApi } from './baseApi';
import { setUser } from '@/store/slices/authSlice';
import type {
  ApiSuccess,
  AuthTokens,
  AuthUser,
  AuthSession,
  LoginResult,
  PendingOtpResult,
} from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

function syncGetMeCache(dispatch: (action: unknown) => void, user: AuthUser) {
  dispatch(setUser(user));
  dispatch(
    authApi.util.updateQueryData('getMe', undefined, (draft) => {
      draft.data = user;
    }),
  );
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiSuccess<PendingOtpResult>, Record<string, unknown>>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    verifyRegisterOtp: builder.mutation<ApiSuccess<AuthSession>, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-register-otp', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<ApiSuccess<LoginResult>, { email: string; password: string; acceptTerms: true }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth', 'Sidebar'],
    }),
    verifyLoginOtp: builder.mutation<ApiSuccess<AuthSession>, { email: string; otp: string }>({
      query: (body) => ({ url: '/auth/verify-login-otp', method: 'POST', body }),
      invalidatesTags: ['Auth', 'Sidebar'],
    }),
    resendOtp: builder.mutation<ApiSuccess<PendingOtpResult>, { email: string; purpose: string }>({
      query: (body) => ({ url: '/auth/resend-otp', method: 'POST', body }),
    }),
    forgotPassword: builder.mutation<ApiSuccess<PendingOtpResult>, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<
      ApiSuccess<null>,
      { email: string; otp: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
    googleAuth: builder.mutation<ApiSuccess<AuthSession>, { idToken: string; acceptTerms: true }>({
      query: (body) => ({ url: '/auth/google', method: 'POST', body }),
      invalidatesTags: ['Auth', 'Sidebar'],
    }),
    getTermsStatus: builder.query<ApiSuccess<{ termsAccepted: boolean }>, string>({
      query: (email) => ({ url: '/auth/terms-status', params: { email } }),
    }),
    acceptTerms: builder.mutation<ApiSuccess<{ termsAccepted: boolean }>, { email: string }>({
      query: (body) => ({ url: '/auth/accept-terms', method: 'POST', body }),
    }),
    logout: builder.mutation<ApiSuccess<null>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth', 'Sidebar'],
    }),
    refreshToken: builder.mutation<ApiSuccess<AuthTokens>, void>({
      query: () => ({ url: '/auth/refresh-token', method: 'POST' }),
    }),
    getMe: builder.query<ApiSuccess<AuthUser>, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    updateAvatar: builder.mutation<ApiSuccess<AuthUser>, FormData>({
      query: (body) => ({
        url: '/auth/me/avatar',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (response.data) syncGetMeCache(dispatch, response.data);
        } catch {
          // Caller handles mutation errors.
        }
      },
    }),
    changePassword: builder.mutation<
      ApiSuccess<null>,
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (body) => ({
        url: '/auth/me/change-password',
        method: 'POST',
        body,
      }),
    }),
    updateProfile: builder.mutation<
      ApiSuccess<AuthUser>,
      {
        firstName: string;
        lastName?: string;
        postalAddress?: string;
        state?: string;
        countryRegion?: string;
        phoneNumber?: string;
        labelName?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/me/profile',
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (response.data) syncGetMeCache(dispatch, response.data);
        } catch {
          // Caller handles mutation errors.
        }
      },
    }),
    updateBankDetails: builder.mutation<
      ApiSuccess<AuthUser>,
      {
        bankName?: string;
        accountNumber?: string;
        ifscCode?: string;
        swiftCode?: string;
        micrCode?: string;
      }
    >({
      query: (body) => ({
        url: '/auth/me/bank-details',
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          if (response.data) syncGetMeCache(dispatch, response.data);
        } catch {
          // Caller handles mutation errors.
        }
      },
    }),
  }),
  ...injectOptions,
});

export const {
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
  useLazyGetTermsStatusQuery,
  useAcceptTermsMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdateBankDetailsMutation,
} = authApi;
