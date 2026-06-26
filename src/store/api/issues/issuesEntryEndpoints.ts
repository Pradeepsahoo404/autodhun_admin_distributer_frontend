import type { EndpointBuilder } from '@reduxjs/toolkit/query';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ApiSuccess, IssuesAssignedEntry, PaginatedMeta } from '@/types';

type Builder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  string,
  'api'
>;

export function buildIssuesEntryEndpoints(builder: Builder, apiPath: string, tag: string) {
  return {
    list: builder.query<
      ApiSuccess<IssuesAssignedEntry[]> & { meta?: PaginatedMeta },
      Record<string, string | number>
    >({
      query: (params) => ({ url: apiPath, params }),
      providesTags: [tag],
    }),
    create: builder.mutation<ApiSuccess<IssuesAssignedEntry>, Record<string, unknown>>({
      query: (body) => ({ url: apiPath, method: 'POST', body }),
      invalidatesTags: [tag, 'Notifications'],
    }),
    update: builder.mutation<
      ApiSuccess<IssuesAssignedEntry>,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({ url: `${apiPath}/${id}`, method: 'PUT', body }),
      invalidatesTags: [tag],
    }),
    updateStatus: builder.mutation<
      ApiSuccess<IssuesAssignedEntry>,
      { id: string; body: { status: 'active' | 'inactive' } }
    >({
      query: ({ id, body }) => ({
        url: `${apiPath}/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [tag],
    }),
    updateOwnership: builder.mutation<
      ApiSuccess<IssuesAssignedEntry>,
      { id: string; body: { ownership: 'yes' | 'no' } }
    >({
      query: ({ id, body }) => ({
        url: `${apiPath}/${id}/ownership`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [tag, 'Notifications'],
    }),
    delete: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `${apiPath}/${id}`, method: 'DELETE' }),
      invalidatesTags: [tag],
    }),
    exportCsv: builder.mutation<Blob, { dateFrom?: string; dateTo?: string }>({
      query: (params) => ({
        url: `${apiPath}/export`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  };
}
