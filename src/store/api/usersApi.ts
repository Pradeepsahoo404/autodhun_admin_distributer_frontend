import { baseApi } from './baseApi';
import type { AdminCreationStats, ApiSuccess, PaginatedMeta, User } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiSuccess<User[]> & { meta?: PaginatedMeta }, Record<string, string | number>>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['Users'],
    }),
    getUserById: builder.query<ApiSuccess<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    getAdminCreationStats: builder.query<ApiSuccess<AdminCreationStats>, void>({
      query: () => '/users/stats/admins-created',
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
  useGetUserByIdQuery,
  useGetAdminCreationStatsQuery,
  useCreateUserMutation,
  useInviteAdminMutation,
  useResendInviteMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
