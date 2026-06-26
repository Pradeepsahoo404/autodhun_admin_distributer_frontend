import type { BaseQueryFn, EndpointBuilder, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ApiSuccess, PaginatedMeta } from '@/types';

type LegalModuleBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  string,
  'api'
>;

export interface LegalModuleEndpointConfig<T> {
  tag: string;
  basePath: string;
  exportPath?: string;
}

export function legalModuleEndpoints<T>(builder: LegalModuleBuilder, config: LegalModuleEndpointConfig<T>) {
  const { tag, basePath } = config;
  const exportUrl = config.exportPath ?? `${basePath}/export`;

  return {
    list: builder.query<ApiSuccess<T[]> & { meta?: PaginatedMeta }, Record<string, string | number>>({
      query: (params) => ({ url: basePath, params }),
      providesTags: [tag],
    }),
    create: builder.mutation<ApiSuccess<T>, Record<string, unknown>>({
      query: (body) => ({ url: basePath, method: 'POST', body }),
      invalidatesTags: [tag],
    }),
    update: builder.mutation<ApiSuccess<T>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `${basePath}/${id}`, method: 'PUT', body }),
      invalidatesTags: [tag],
    }),
    updateStatus: builder.mutation<ApiSuccess<T>, { id: string; body: { status: 'active' | 'inactive' } }>({
      query: ({ id, body }) => ({ url: `${basePath}/${id}/status`, method: 'PATCH', body }),
      invalidatesTags: [tag],
    }),
    remove: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `${basePath}/${id}`, method: 'DELETE' }),
      invalidatesTags: [tag],
    }),
    export: builder.mutation<Blob, { dateFrom?: string; dateTo?: string }>({
      query: (params) => ({
        url: exportUrl,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  };
}
