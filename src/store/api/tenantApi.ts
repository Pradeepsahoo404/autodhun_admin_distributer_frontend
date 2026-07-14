import { baseApi } from './baseApi';
import type { ApiSuccess, PaginatedMeta, Tenant } from '@/types';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export interface TenantSuperAdminSummary {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  status?: string;
  createdAt?: string;
}

export interface CreateTenantPayload {
  name: string;
  slug?: string;
  superAdmin: {
    firstName: string;
    lastName?: string;
    email: string;
    password?: string;
  };
}

export interface CreateTenantResult {
  tenant: Tenant;
  superAdmin: TenantSuperAdminSummary;
  temporaryPassword?: string;
}

export type TenantDetail = Tenant & {
  superAdmin?: TenantSuperAdminSummary | null;
};

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<
      ApiSuccess<Tenant[]> & { meta?: PaginatedMeta },
      Record<string, string | number>
    >({
      query: (params) => ({ url: '/tenants', params }),
      providesTags: ['Tenants'],
    }),
    getTenantById: builder.query<ApiSuccess<TenantDetail>, string>({
      query: (id) => ({ url: `/tenants/${id}` }),
      providesTags: (_r, _e, id) => [{ type: 'Tenants', id }],
    }),
    createTenant: builder.mutation<ApiSuccess<CreateTenantResult>, CreateTenantPayload>({
      query: (body) => ({ url: '/tenants', method: 'POST', body }),
      invalidatesTags: ['Tenants'],
    }),
    updateTenant: builder.mutation<
      ApiSuccess<Tenant>,
      { id: string; body: { name?: string; status?: 'active' | 'inactive' } }
    >({
      query: ({ id, body }) => ({ url: `/tenants/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => ['Tenants', { type: 'Tenants', id }],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
} = tenantApi;
