import { baseApi } from './baseApi';
import type { ApiSuccess, DashboardData } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<ApiSuccess<DashboardData>, void>({
      query: () => '/dashboard',
      providesTags: ['Sidebar'],
    }),
  }),
  ...injectOptions,
});

export const { useGetDashboardQuery } = dashboardApi;
