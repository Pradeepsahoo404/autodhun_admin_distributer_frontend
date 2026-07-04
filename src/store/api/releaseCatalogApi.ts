import { baseApi } from './baseApi';
import type { ApiSuccess, PaginatedMeta } from '@/types';

export type LabelStatus = 'active' | 'inactive';

export interface ReleaseCatalogItem {
  _id: string;
  name: string;
  normalizedName: string;
  status?: LabelStatus;
  createdAt: string;
  updatedAt: string;
  ownedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface ManagedLabelsQuery {
  status: LabelStatus;
  page?: number;
  limit?: number;
  search?: string;
}

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const releaseCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReleaseArtists: builder.query<ApiSuccess<ReleaseCatalogItem[]>, { search?: string; limit?: number } | void>({
      query: (params) => ({ url: '/release-catalog/artists', params: params ?? {} }),
      providesTags: ['ReleaseCatalog'],
    }),
    createReleaseArtist: builder.mutation<ApiSuccess<ReleaseCatalogItem>, { name: string }>({
      query: (body) => ({ url: '/release-catalog/artists', method: 'POST', body }),
      invalidatesTags: ['ReleaseCatalog'],
    }),
    getReleaseLabels: builder.query<ApiSuccess<ReleaseCatalogItem[]>, { search?: string; limit?: number } | void>({
      query: (params) => ({ url: '/release-catalog/labels', params: params ?? {} }),
      providesTags: ['ReleaseCatalog'],
    }),
    getManagedLabels: builder.query<
      ApiSuccess<PaginatedMeta & { items: ReleaseCatalogItem[] }>,
      ManagedLabelsQuery
    >({
      query: (params) => ({ url: '/release-catalog/labels/manage', params }),
      providesTags: ['ReleaseCatalog', 'LabelTransfer'],
    }),
    createReleaseLabel: builder.mutation<ApiSuccess<ReleaseCatalogItem>, { name: string }>({
      query: (body) => ({ url: '/release-catalog/labels', method: 'POST', body }),
      invalidatesTags: ['ReleaseCatalog', 'LabelTransfer'],
    }),
    updateReleaseLabel: builder.mutation<ApiSuccess<ReleaseCatalogItem>, { id: string; name: string }>({
      query: ({ id, name }) => ({ url: `/release-catalog/labels/${id}`, method: 'PUT', body: { name } }),
      invalidatesTags: ['ReleaseCatalog', 'LabelTransfer'],
    }),
    updateReleaseLabelStatus: builder.mutation<
      ApiSuccess<ReleaseCatalogItem>,
      { id: string; status: LabelStatus }
    >({
      query: ({ id, status }) => ({
        url: `/release-catalog/labels/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['ReleaseCatalog', 'LabelTransfer'],
    }),
    deleteReleaseLabel: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/release-catalog/labels/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ReleaseCatalog', 'LabelTransfer'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetReleaseArtistsQuery,
  useCreateReleaseArtistMutation,
  useGetReleaseLabelsQuery,
  useGetManagedLabelsQuery,
  useCreateReleaseLabelMutation,
  useUpdateReleaseLabelMutation,
  useUpdateReleaseLabelStatusMutation,
  useDeleteReleaseLabelMutation,
} = releaseCatalogApi;
