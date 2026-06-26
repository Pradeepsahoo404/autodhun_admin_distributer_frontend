import { baseApi } from './baseApi';
import type { ApiSuccess, Notification, PaginatedMeta } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      ApiSuccess<Notification[]> & { meta?: PaginatedMeta },
      { page?: number; limit?: number; unreadOnly?: boolean }
    >({
      query: (params) => ({
        url: '/notifications',
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          ...(params.unreadOnly ? { unreadOnly: 'true' } : {}),
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Notifications' as const, id: _id })),
              { type: 'Notifications', id: 'LIST' },
            ]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),
    getUnreadNotificationCount: builder.query<ApiSuccess<{ count: number }>, void>({
      query: () => '/notifications/unread-count',
      providesTags: [{ type: 'Notifications', id: 'UNREAD_COUNT' }],
    }),
    markNotificationRead: builder.mutation<ApiSuccess<Notification>, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notifications', id },
        { type: 'Notifications', id: 'LIST' },
        { type: 'Notifications', id: 'UNREAD_COUNT' },
      ],
    }),
    markAllNotificationsRead: builder.mutation<ApiSuccess<{ count: number }>, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }, { type: 'Notifications', id: 'UNREAD_COUNT' }],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;

export type NotificationsListMeta = PaginatedMeta;
