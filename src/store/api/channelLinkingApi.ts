import { baseApi } from './baseApi';
import type { ApiSuccess, ChannelLinking, PaginatedMeta } from '@/types';
import type { ChannelLinkingStatus } from '@/constants/channelLinkingStatus';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const channelLinkingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelLinkingEntries: builder.query<
      ApiSuccess<ChannelLinking[]> & { meta?: PaginatedMeta },
      Record<string, string | number>
    >({
      query: (params) => ({ url: '/channel-linking', params }),
      providesTags: ['ChannelLinking'],
    }),
    createChannelLinking: builder.mutation<ApiSuccess<ChannelLinking>, Record<string, unknown>>({
      query: (body) => ({ url: '/channel-linking', method: 'POST', body }),
      invalidatesTags: ['ChannelLinking'],
    }),
    updateChannelLinking: builder.mutation<
      ApiSuccess<ChannelLinking>,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({ url: `/channel-linking/${id}`, method: 'PUT', body }),
      invalidatesTags: ['ChannelLinking'],
    }),
    updateChannelLinkingStatus: builder.mutation<
      ApiSuccess<ChannelLinking>,
      { id: string; body: { status: ChannelLinkingStatus } }
    >({
      query: ({ id, body }) => ({ url: `/channel-linking/${id}/status`, method: 'PATCH', body }),
      invalidatesTags: ['ChannelLinking'],
    }),
    deleteChannelLinking: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/channel-linking/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ChannelLinking'],
    }),
    exportChannelLinking: builder.mutation<Blob, { dateFrom?: string; dateTo?: string }>({
      query: (params) => ({
        url: '/channel-linking/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  ...injectOptions,
});

export const {
  useGetChannelLinkingEntriesQuery,
  useCreateChannelLinkingMutation,
  useUpdateChannelLinkingMutation,
  useUpdateChannelLinkingStatusMutation,
  useDeleteChannelLinkingMutation,
  useExportChannelLinkingMutation,
} = channelLinkingApi;
