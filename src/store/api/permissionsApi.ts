import { baseApi } from './baseApi';
import type { ApiSuccess, EffectivePermission, ModulePermission, Permission } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSidebar: builder.query<ApiSuccess<ModulePermission[]>, void>({
      query: () => '/permissions/me/sidebar',
      providesTags: ['Sidebar'],
    }),
    getPermissions: builder.query<ApiSuccess<Permission[]>, { roleId?: string }>({
      query: (params) => ({ url: '/permissions', params }),
      providesTags: ['Permissions'],
    }),
    getPermissionMatrix: builder.query<ApiSuccess<EffectivePermission[]>, { roleId: string }>({
      query: ({ roleId }) => ({ url: '/permissions/matrix', params: { roleId } }),
      providesTags: ['Permissions'],
    }),
    setPermission: builder.mutation<ApiSuccess<Permission>, Record<string, unknown>>({
      query: (body) => ({ url: '/permissions', method: 'POST', body }),
      invalidatesTags: ['Permissions', 'Sidebar'],
    }),
    bulkSetPermissions: builder.mutation<
      ApiSuccess<Permission[]>,
      { roleId: string; permissions: Array<Record<string, unknown>> }
    >({
      query: (body) => ({ url: '/permissions/bulk', method: 'POST', body }),
      invalidatesTags: ['Permissions', 'Sidebar'],
    }),
    updatePermission: builder.mutation<ApiSuccess<Permission>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/permissions/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Permissions', 'Sidebar'],
    }),
    deletePermission: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/permissions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Permissions', 'Sidebar'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetSidebarQuery,
  useGetPermissionsQuery,
  useGetPermissionMatrixQuery,
  useSetPermissionMutation,
  useBulkSetPermissionsMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApi;
