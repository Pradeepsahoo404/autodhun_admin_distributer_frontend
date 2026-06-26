import { baseApi } from './baseApi';
import type { ApiSuccess, Module } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const modulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModules: builder.query<
      ApiSuccess<Module[]>,
      { rootsOnly?: boolean; activeOnly?: boolean; search?: string; status?: string } | void
    >({
      query: (params) => ({
        url: '/modules',
        params: {
          ...(params?.rootsOnly ? { rootsOnly: 'true' } : {}),
          ...(params?.activeOnly ? { activeOnly: 'true' } : {}),
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.status ? { status: params.status } : {}),
        },
      }),
      providesTags: ['Modules'],
    }),
    createModule: builder.mutation<ApiSuccess<Module>, Record<string, unknown>>({
      query: (body) => ({ url: '/modules', method: 'POST', body }),
      invalidatesTags: ['Modules', 'Sidebar'],
    }),
    updateModule: builder.mutation<ApiSuccess<Module>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/modules/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Modules', 'Sidebar'],
    }),
    deleteModule: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/modules/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Modules', 'Sidebar', 'Permissions'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = modulesApi;
