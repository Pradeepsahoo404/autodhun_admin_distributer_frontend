'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Users,
  Shield,
  Music2,
  Tv,
  Ticket,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
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
import { DASHBOARD_PAGE, ROUTES } from '@/constants';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { useGetMasterDashboardQuery, useGetTenantsQuery } from '@/store/api';
import { cn } from '@/lib/utils';

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent = 'lime',
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'lime' | 'purple';
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#222222] bg-[#111111] p-4',
        accent === 'lime'
          ? 'bg-[radial-gradient(ellipse_at_top_right,rgba(163,255,18,0.08),transparent_55%)]'
          : 'bg-[radial-gradient(ellipse_at_top_right,rgba(139,127,240,0.12),transparent_55%)]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{value}</p>
        </div>
        <div
          className={cn(
            'rounded-lg p-2',
            accent === 'lime' ? 'bg-brand-lime/10 text-brand-lime' : 'bg-violet-500/10 text-violet-300',
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export default function MasterHomePage() {
  const router = useRouter();
  const { isMasterAdmin } = useAuthAccount();
  const [tenantFilter, setTenantFilter] = useState('all');

  useEffect(() => {
    if (!isMasterAdmin) {
      router.replace('/unauthorized');
    }
  }, [isMasterAdmin, router]);

  const { data: tenantsData } = useGetTenantsQuery(
    { page: 1, limit: 100 },
    { skip: !isMasterAdmin },
  );

  const dashboardArgs = useMemo(
    () => (tenantFilter !== 'all' ? { tenantId: tenantFilter } : undefined),
    [tenantFilter],
  );

  const { data, isLoading, isError } = useGetMasterDashboardQuery(dashboardArgs, {
    skip: !isMasterAdmin,
    refetchOnMountOrArgChange: true,
  });

  const summary = data?.data?.summary;
  const rows = data?.data?.tenants ?? [];
  const tenantOptions = tenantsData?.data ?? [];

  if (!isMasterAdmin) return null;

  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardPageHeader
        title="Master Dashboard"
        description="Platform overview across all tenants."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TableSelectField
              value={tenantFilter}
              onChange={setTenantFilter}
              options={[
                { value: 'all', label: 'All tenants' },
                ...tenantOptions.map((t) => ({ value: t._id, label: t.name })),
              ]}
              aria-label="Filter by tenant"
              className="min-w-[180px]"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.MASTER_DASHBOARD + '/tenants')}
              className="border-[#2a2a2a] bg-transparent text-neutral-200 hover:border-brand-lime/40 hover:text-brand-lime"
            >
              <Building2 className="mr-1.5 h-4 w-4" />
              Manage tenants
            </Button>
            <Button
              type="button"
              onClick={() => router.push(ROUTES.MASTER_DASHBOARD + '/tenants/create')}
              className="bg-brand-lime text-brand-black hover:bg-brand-lime/90"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New tenant
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[88px] animate-pulse rounded-2xl border border-[#222222] bg-[#111111]"
            />
          ))}
        </div>
      ) : isError || !summary ? (
        <p className="rounded-2xl border border-[#222222] bg-[#111111] p-8 text-center text-sm text-neutral-500">
          Could not load master dashboard.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Tenants" value={summary.tenants} icon={Building2} />
            <SummaryCard label="Active" value={summary.activeTenants} icon={CheckCircle2} />
            <SummaryCard
              label="Inactive"
              value={summary.inactiveTenants}
              icon={XCircle}
              accent="purple"
            />
            <SummaryCard label="Super Admins" value={summary.superAdmins} icon={Shield} accent="purple" />
            <SummaryCard label="Admins" value={summary.admins} icon={Users} />
            <SummaryCard label="Releases" value={summary.releases} icon={Music2} accent="purple" />
            <SummaryCard label="Channels" value={summary.channels} icon={Tv} />
            <SummaryCard label="Open tickets" value={summary.openTickets} icon={Ticket} accent="purple" />
          </div>

          <Card className={legalModuleCardClass}>
            <CardHeader className={legalModuleCardHeaderClass}>
              <CardTitle className="text-base text-white">Tenant breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={dashboardTableWrapperClass()}>
                <table className={dashboardTableClass}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th className="px-4 py-3 text-left">Tenant</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">SAs</th>
                      <th className="px-4 py-3 text-right">Admins</th>
                      <th className="px-4 py-3 text-right">Releases</th>
                      <th className="px-4 py-3 text-right">Channels</th>
                      <th className="px-4 py-3 text-right">Tickets</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-500">
                          No tenants yet. Create one to get started.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row) => (
                        <tr key={row.tenantId} className={dashboardTableRowClass}>
                          <td className="px-4 py-3">
                            <div className={dashboardTableCellPrimary}>{row.name}</div>
                            <span className={slugBadgeClass}>{row.slug}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                'text-xs capitalize',
                                row.status === 'active' ? 'text-brand-lime' : 'text-neutral-500',
                              )}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className={cn('px-4 py-3 text-right', dashboardTableCellMuted)}>
                            {row.superAdmins}
                          </td>
                          <td className={cn('px-4 py-3 text-right', dashboardTableCellMuted)}>
                            {row.admins}
                          </td>
                          <td className={cn('px-4 py-3 text-right', dashboardTableCellMuted)}>
                            {row.releases}
                          </td>
                          <td className={cn('px-4 py-3 text-right', dashboardTableCellMuted)}>
                            {row.channels}
                          </td>
                          <td className={cn('px-4 py-3 text-right', dashboardTableCellMuted)}>
                            {row.openTickets}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
