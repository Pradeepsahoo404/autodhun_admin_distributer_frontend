import { baseApi } from './baseApi';
import type { ApiSuccess, PaginatedMeta, SupportTicket } from '@/types';
import type { SupportTicketCaseFilter, SupportTicketStatus } from '@/constants/supportTicket';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const supportTicketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTickets: builder.query<
      ApiSuccess<SupportTicket[]> & { meta?: PaginatedMeta },
      Record<string, string | number>
    >({
      query: (params) => ({ url: '/support-tickets', params }),
      providesTags: ['SupportTickets'],
    }),
    getSupportTicketById: builder.query<ApiSuccess<SupportTicket>, string>({
      query: (id) => ({ url: `/support-tickets/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'SupportTickets', id }],
    }),
    createSupportTicket: builder.mutation<ApiSuccess<SupportTicket>, Record<string, unknown>>({
      query: (body) => ({ url: '/support-tickets', method: 'POST', body }),
      invalidatesTags: ['SupportTickets'],
    }),
    updateSupportTicket: builder.mutation<
      ApiSuccess<SupportTicket>,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({ url: `/support-tickets/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => ['SupportTickets', { type: 'SupportTickets', id }],
    }),
    updateSupportTicketStatus: builder.mutation<
      ApiSuccess<SupportTicket>,
      { id: string; body: { status: SupportTicketStatus; resolutionNote?: string } }
    >({
      query: ({ id, body }) => ({ url: `/support-tickets/${id}/status`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => ['SupportTickets', { type: 'SupportTickets', id }],
    }),
    deleteSupportTicket: builder.mutation<ApiSuccess<null>, string>({
      query: (id) => ({ url: `/support-tickets/${id}`, method: 'DELETE' }),
      invalidatesTags: ['SupportTickets'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useCreateSupportTicketMutation,
  useUpdateSupportTicketMutation,
  useUpdateSupportTicketStatusMutation,
  useDeleteSupportTicketMutation,
} = supportTicketApi;

export type { SupportTicketCaseFilter };
