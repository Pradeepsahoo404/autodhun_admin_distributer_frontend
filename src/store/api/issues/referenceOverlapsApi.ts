import { baseApi } from '../baseApi';
import type { ApiSuccess, PaginatedMeta, ReferenceOverlap } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

const REFERENCE_OVERLAPS_TAG = 'ReferenceOverlaps' as const;

export const referenceOverlapsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferenceOverlaps: builder.query<
      ApiSuccess<ReferenceOverlap[]> & { meta?: PaginatedMeta },
      Record<string, string | number>
    >({
      query: (params) => ({ url: '/reference-overlaps', params }),
      providesTags: [REFERENCE_OVERLAPS_TAG],
    }),
    createReferenceOverlap: builder.mutation<ApiSuccess<ReferenceOverlap>, Record<string, unknown>>({
      query: (body) => ({ url: '/reference-overlaps', method: 'POST', body }),
      invalidatesTags: [REFERENCE_OVERLAPS_TAG, 'Notifications'],
    }),
    updateReferenceOverlap: builder.mutation<
      ApiSuccess<ReferenceOverlap>,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({ url: `/reference-overlaps/${id}`, method: 'PUT', body }),
      invalidatesTags: [REFERENCE_OVERLAPS_TAG],
    }),
    updateReferenceOverlapStatus: builder.mutation<
      ApiSuccess<ReferenceOverlap>,
      { id: string; body: { status: 'active' | 'inactive' } }
    >({
      query: ({ id, body }) => ({
        url: `/reference-overlaps/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [REFERENCE_OVERLAPS_TAG],
    }),
    updateReferenceOverlapOwnership: builder.mutation<
      ApiSuccess<ReferenceOverlap>,
      { id: string; body: { ownership: 'yes' | 'no' } }
    >({
      query: ({ id, body }) => ({
        url: `/reference-overlaps/${id}/ownership`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [REFERENCE_OVERLAPS_TAG, 'Notifications'],
    }),
    deleteReferenceOverlap: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/reference-overlaps/${id}`, method: 'DELETE' }),
      invalidatesTags: [REFERENCE_OVERLAPS_TAG],
    }),
    exportReferenceOverlaps: builder.mutation<Blob, { dateFrom?: string; dateTo?: string }>({
      query: (params) => ({
        url: '/reference-overlaps/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  ...injectOptions,
});

export const {
  useGetReferenceOverlapsQuery,
  useCreateReferenceOverlapMutation,
  useUpdateReferenceOverlapMutation,
  useUpdateReferenceOverlapStatusMutation,
  useUpdateReferenceOverlapOwnershipMutation,
  useDeleteReferenceOverlapMutation,
  useExportReferenceOverlapsMutation,
} = referenceOverlapsApi;
