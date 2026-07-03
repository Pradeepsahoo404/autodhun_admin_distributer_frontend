import { baseApi } from './baseApi';
import type { ApiSuccess } from '@/types';

export interface ReleaseCatalogItem {
  _id: string;
  name: string;
  normalizedName: string;
  createdAt: string;
  updatedAt: string;
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
    createReleaseLabel: builder.mutation<ApiSuccess<ReleaseCatalogItem>, { name: string }>({
      query: (body) => ({ url: '/release-catalog/labels', method: 'POST', body }),
      invalidatesTags: ['ReleaseCatalog'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetReleaseArtistsQuery,
  useCreateReleaseArtistMutation,
  useGetReleaseLabelsQuery,
  useCreateReleaseLabelMutation,
} = releaseCatalogApi;
