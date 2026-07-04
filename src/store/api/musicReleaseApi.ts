import { baseApi } from './baseApi';
import type { ApiSuccess, MusicRelease, PaginatedMeta } from '@/types';
import type { MusicReleaseListContext, MusicReleaseStatus } from '@/constants/musicReleaseStatus';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const musicReleaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMusicReleases: builder.query<
      ApiSuccess<MusicRelease[]> & { meta?: PaginatedMeta },
      {
        context: MusicReleaseListContext;
        page?: number;
        limit?: number;
        search?: string;
        status?: MusicReleaseStatus;
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => ({ url: '/music-releases', params }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}:${JSON.stringify(queryArgs)}`,
      providesTags: ['MusicReleases'],
    }),
    getMusicReleaseById: builder.query<ApiSuccess<MusicRelease>, string>({
      query: (id) => `/music-releases/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'MusicReleases', id }],
    }),
    getNextReleaseIsrcPreview: builder.query<ApiSuccess<string[]>, { count?: number } | void>({
      query: (params) => ({
        url: '/music-releases/isrc/next',
        params: params?.count ? { count: params.count } : {},
      }),
    }),
    createMusicRelease: builder.mutation<ApiSuccess<MusicRelease>, FormData>({
      query: (body) => ({ url: '/music-releases', method: 'POST', body }),
      invalidatesTags: ['MusicReleases'],
    }),
    updateMusicRelease: builder.mutation<ApiSuccess<MusicRelease>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/music-releases/${id}`, method: 'PUT', body }),
      invalidatesTags: ['MusicReleases'],
    }),
    updateMusicReleaseStatus: builder.mutation<
      ApiSuccess<MusicRelease>,
      { id: string; status: MusicReleaseStatus; correctionReasons?: string[] }
    >({
      query: ({ id, status, correctionReasons }) => ({
        url: `/music-releases/${id}/status`,
        method: 'PATCH',
        body: {
          status,
          ...(correctionReasons?.length ? { correctionReasons } : {}),
        },
      }),
      invalidatesTags: ['MusicReleases'],
    }),
    bulkUpdateMusicReleaseStatus: builder.mutation<
      ApiSuccess<{ updated: number }>,
      { ids: string[]; status: MusicReleaseStatus; correctionReasons?: string[] }
    >({
      query: ({ ids, status, correctionReasons }) => ({
        url: '/music-releases/bulk/status',
        method: 'PATCH',
        body: {
          ids,
          status,
          ...(correctionReasons?.length ? { correctionReasons } : {}),
        },
      }),
      invalidatesTags: ['MusicReleases'],
    }),
    deleteMusicRelease: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/music-releases/${id}`, method: 'DELETE' }),
      invalidatesTags: ['MusicReleases'],
    }),
    exportMusicReleases: builder.mutation<
      Blob,
      { context: MusicReleaseListContext; dateFrom?: string; dateTo?: string }
    >({
      query: (params) => ({
        url: '/music-releases/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  ...injectOptions,
});

export const {
  useGetMusicReleasesQuery,
  useGetMusicReleaseByIdQuery,
  useGetNextReleaseIsrcPreviewQuery,
  useCreateMusicReleaseMutation,
  useUpdateMusicReleaseMutation,
  useUpdateMusicReleaseStatusMutation,
  useBulkUpdateMusicReleaseStatusMutation,
  useDeleteMusicReleaseMutation,
  useExportMusicReleasesMutation,
} = musicReleaseApi;
