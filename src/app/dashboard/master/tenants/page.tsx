'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField } from '@/components/common/TableSelectField';
import {
  dashboardTableBodyClass,
  dashboardTableCellMuted,
  dashboardTableCellPrimary,
  dashboardTableClass,
  dashboardTableHeadClass,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  legalModuleCardClass,
  legalModuleCardHeaderClass,
  slugBadgeClass,
} from '@/components/common/dashboardTableStyles';
import { DASHBOARD_PAGE } from '@/constants';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { useGetTenantsQuery, useUpdateTenantMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import type { PaginatedMeta, Tenant } from '@/types';

const DEFAULT_PAGE_LIMIT = 10;

export default function MasterTenantsPage() {
  const router = useRouter();
  const { isMasterAdmin } = useAuthAccount();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);

  const [updateTenant, { isLoading: updating }] = useUpdateTenantMutation();

  useEffect(() => {
    if (!isMasterAdmin) router.replace('/unauthorized');
  }, [isMasterAdmin, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryArgs = useMemo(() => {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;
    if (status !== 'all') params.status = status;
    return params;
  }, [page, limit, search, status]);

  const { data, isLoading, isError } = useGetTenantsQuery(queryArgs, { skip: !isMasterAdmin });
  const tenants = data?.data ?? [];
  const meta = data?.meta;

  const toggleStatus = async (tenant: Tenant) => {
    const next = tenant.status === 'active' ? 'inactive' : 'active';
    try {
      await updateTenant({ id: tenant._id, body: { status: next } }).unwrap();
      toast.success(next === 'active' ? 'Tenant activated' : 'Tenant deactivated');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (!isMasterAdmin) return null;

  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardPageHeader
        title="Tenants"
        description="Provision organizations and Super Admins. Deactivating blocks all tenant users."
        action={
          <Button
            type="button"
            onClick={() => router.push('/dashboard/master/tenants/create')}
            className="bg-brand-lime text-brand-black hover:bg-brand-lime/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New tenant
          </Button>
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <CardTitle className="text-base text-white">All tenants</CardTitle>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <TableSearchField
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search name or slug…"
              className="sm:max-w-xs"
            />
            <TableSelectField
              value={status}
              onChange={(v) => {
                setStatus(v as 'all' | 'active' | 'inactive');
                setPage(1);
              }}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="sm:w-44"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className={dashboardTableWrapperClass()}>
            <table className={dashboardTableClass}>
              <thead className={dashboardTableHeadClass}>
                <tr className={dashboardTableHeadRowClass}>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Active</th>
                </tr>
              </thead>
              <tbody className={dashboardTableBodyClass}>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-500">
                      Loading…
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-red-400">
                      Failed to load tenants
                    </td>
                  </tr>
                ) : tenants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-500">
                      No tenants yet. Create your first organization.
                    </td>
                  </tr>
                ) : (
                  tenants.map((tenant) => (
                    <tr key={tenant._id} className={dashboardTableRowClass}>
                      <td className={`px-4 py-3 ${dashboardTableCellPrimary}`}>{tenant.name}</td>
                      <td className="px-4 py-3">
                        <span className={slugBadgeClass}>{tenant.slug}</span>
                      </td>
                      <td className={`px-4 py-3 ${dashboardTableCellMuted}`}>
                        {tenant.createdAt
                          ? new Date(tenant.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Switch
                          checked={tenant.status === 'active'}
                          disabled={updating || tenant.slug === 'legacy'}
                          onCheckedChange={() => void toggleStatus(tenant)}
                          aria-label={`Toggle ${tenant.name}`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {meta ? (
            <DataPagination
              meta={meta as PaginatedMeta}
              onPageChange={setPage}
              onLimitChange={(next) => {
                setLimit(next);
                setPage(1);
              }}
              className="mt-4"
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
