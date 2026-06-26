import { baseApi } from './baseApi';
import type { ApiSuccess, PaginatedMeta, Role } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<
      ApiSuccess<Role[]> & { meta?: PaginatedMeta },
      Record<string, string | number> | void
    >({
      query: (params) => ({
        url: '/roles',
        ...(params ? { params } : {}),
      }),
      providesTags: ['Roles'],
    }),
    createRole: builder.mutation<ApiSuccess<Role>, Record<string, unknown>>({
      query: (body) => ({ url: '/roles', method: 'POST', body }),
      invalidatesTags: ['Roles'],
    }),
    updateRole: builder.mutation<ApiSuccess<Role>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/roles/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Roles'],
    }),
    deleteRole: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Roles'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
