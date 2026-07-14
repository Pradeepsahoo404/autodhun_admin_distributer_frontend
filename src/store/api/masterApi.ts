import { baseApi } from './baseApi';
import type { ApiSuccess } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export interface MasterDashboardTenantRow {
  tenantId: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  admins: number;
  superAdmins: number;
  users: number;
  releases: number;
  channels: number;
  channelLinkings: number;
  openTickets: number;
}

export interface MasterDashboardSummary {
  tenants: number;
  activeTenants: number;
  inactiveTenants: number;
  admins: number;
  superAdmins: number;
  releases: number;
  channels: number;
  openTickets: number;
}

export interface MasterDashboardData {
  summary: MasterDashboardSummary;
  tenants: MasterDashboardTenantRow[];
}

export const masterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMasterDashboard: builder.query<
      ApiSuccess<MasterDashboardData>,
      { tenantId?: string } | void
    >({
      query: (params) => ({
        url: '/master/dashboard',
        params: params?.tenantId ? { tenantId: params.tenantId } : undefined,
      }),
      providesTags: ['Tenants'],
    }),
  }),
  ...injectOptions,
});

export const { useGetMasterDashboardQuery } = masterApi;
