import { baseApi } from './baseApi';
import type { ApiSuccess, PaginatedMeta, User } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiSuccess<User[]> & { meta?: PaginatedMeta }, Record<string, string | number>>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<ApiSuccess<User>, Record<string, unknown>>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    inviteAdmin: builder.mutation<ApiSuccess<User>, Record<string, unknown>>({
      query: (body) => ({ url: '/users/invite-admin', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    resendInvite: builder.mutation<ApiSuccess<User>, { id: string; body?: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/users/${id}/resend-invite`, method: 'POST', body: body ?? {} }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<ApiSuccess<User>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useInviteAdminMutation,
  useResendInviteMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
