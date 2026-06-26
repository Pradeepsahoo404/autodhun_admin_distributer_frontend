'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useGetRolesQuery,
  useGetPermissionMatrixQuery,
  useBulkSetPermissionsMutation,
  useGetSidebarQuery,
} from '@/store/api';
import { usePermission } from '@/hooks/usePermission';
import { getApiErrorMessage } from '@/services/apiClient';
import { ROLES, DASHBOARD_PAGE } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField } from '@/components/common/TableSelectField';
import {
  dashboardTableBodyClass,
  dashboardTableCellCenter,
  dashboardTableCellPrimary,
  dashboardTableClass,
  dashboardTableHeadClassCenter,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  groupBadgeClass,
  legalModuleCardClass,
  legalModuleCardHeaderClass,
} from '@/components/common/dashboardTableStyles';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setSidebarModules } from '@/store/slices/permissionSlice';
import type { PaginatedMeta } from '@/types';

type ActionKey = 'canView' | 'canCreate' | 'canUpdate' | 'canDelete';
const ACTIONS: { key: ActionKey; label: string }[] = [
  { key: 'canView', label: 'View' },
  { key: 'canCreate', label: 'Create' },
  { key: 'canUpdate', label: 'Update' },
  { key: 'canDelete', label: 'Delete' },
];

type Matrix = Record<string, Record<ActionKey, boolean>>;

const DEFAULT_PAGE_LIMIT = 10;

export default function PermissionsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { canUpdate } = usePermission('permissions');
  const { data: rolesData } = useGetRolesQuery({ all: 'true' });
  const { refetch: refetchSidebar } = useGetSidebarQuery();

  const roles = useMemo(() => rolesData?.data ?? [], [rolesData]);
  const roleOptions = useMemo(
    () => roles.map((role) => ({ value: role._id, label: role.name })),
    [roles],
  );

  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);

  useEffect(() => {
    if (!selectedRoleId && roles.length > 0) {
      const editable = roles.find((r) => r.slug !== ROLES.SUPER_ADMIN) ?? roles[0];
      setSelectedRoleId(editable._id);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const selectedRole = roles.find((r) => r._id === selectedRoleId);
  const isSuperAdminRole = selectedRole?.slug === ROLES.SUPER_ADMIN;

  const { data: matrixData, isFetching } = useGetPermissionMatrixQuery(
    { roleId: selectedRoleId },
    { skip: !selectedRoleId },
  );
  const [bulkSet, { isLoading: saving }] = useBulkSetPermissionsMutation();

  const rows = useMemo(
    () => (matrixData?.data ?? []).slice().sort((a, b) => a.order - b.order),
    [matrixData],
  );

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(term) ||
        row.slug.toLowerCase().includes(term) ||
        row.group.toLowerCase().includes(term),
    );
  }, [rows, search]);

  const meta = useMemo<PaginatedMeta>(
    () => ({
      total: filteredRows.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filteredRows.length / limit)),
    }),
    [filteredRows.length, page, limit],
  );

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRows.slice(start, start + limit);
  }, [filteredRows, page, limit]);

  const [matrix, setMatrix] = useState<Matrix>({});

  useEffect(() => {
    if (rows.length === 0) return;
    const next: Matrix = {};
    for (const row of rows) {
      next[row.moduleId] = {
        canView: row.canView,
        canCreate: row.canCreate,
        canUpdate: row.canUpdate,
        canDelete: row.canDelete,
      };
    }
    setMatrix(next);
  }, [rows]);

  const toggle = (moduleId: string, action: ActionKey) => {
    if (!canUpdate || isSuperAdminRole) return;

    setMatrix((prev) => {
      const row = { ...prev[moduleId], [action]: !prev[moduleId][action] };
      if (action === 'canView' && !row.canView) {
        row.canCreate = false;
        row.canUpdate = false;
        row.canDelete = false;
      }
      if (action !== 'canView' && row[action]) row.canView = true;
      return { ...prev, [moduleId]: row };
    });
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    setPage(1);
  };

  const handleSave = async () => {
    try {
      const permissions = rows.map((mod) => ({ moduleId: mod.moduleId, ...matrix[mod.moduleId] }));
      await bulkSet({ roleId: selectedRoleId, permissions }).unwrap();
      toast.success('Permissions saved — sidebar and access update for this role');

      if (user && selectedRole && user.role === selectedRole.slug) {
        const sidebar = await refetchSidebar();
        if (sidebar.data?.data) {
          dispatch(setSidebarModules(sidebar.data.data));
        }
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Permissions"
        description="Set access on main modules only. Sub-modules inherit from their parent automatically."
        action={
          canUpdate && !isSuperAdminRole ? (
            <Button
              onClick={() => void handleSave()}
              disabled={saving || rows.length === 0}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save permissions
            </Button>
          ) : undefined
        }
      />

      {isSuperAdminRole ? (
        <div className="rounded-xl border border-brand-lime/20 bg-brand-lime/5 px-4 py-3 text-sm text-brand-lime">
          Super Admin has implicit full access to every module and cannot be restricted.
        </div>
      ) : null}

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <CardTitle className="text-white">Permission matrix</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <TableSelectField
                value={selectedRoleId}
                onChange={handleRoleChange}
                options={roleOptions}
                aria-label="Select role"
                className="min-w-[180px]"
              />
              <TableSearchField
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search modules..."
                className="min-w-[220px]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {isFetching ? (
            <p className="py-10 text-center text-neutral-500">Loading permissions...</p>
          ) : filteredRows.length === 0 ? (
            <p className="py-10 text-center text-neutral-500">No modules found.</p>
          ) : (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[640px]')}>
                  <thead className={dashboardTableHeadClassCenter}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Module</th>
                      {ACTIONS.map((a) => (
                        <th key={a.key}>{a.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {paginatedRows.map((mod) => {
                      const disabled = !canUpdate || isSuperAdminRole;

                      return (
                        <tr key={mod.moduleId} className={dashboardTableRowClass}>
                          <td className={dashboardTableCellPrimary}>
                            {mod.name}
                            {mod.group === 'management' ? (
                              <span className={groupBadgeClass}>admin</span>
                            ) : null}
                          </td>
                          {ACTIONS.map((a) => {
                            const checked = matrix[mod.moduleId]?.[a.key] ?? false;
                            return (
                              <td key={a.key} className={dashboardTableCellCenter}>
                                <button
                                  type="button"
                                  onClick={() => toggle(mod.moduleId, a.key)}
                                  disabled={disabled}
                                  className={cn(
                                    'inline-flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition-colors',
                                    checked
                                      ? 'border-brand-lime/40 bg-brand-lime/15 text-brand-lime shadow-[0_0_10px_rgba(163,255,0,0.12)]'
                                      : 'border-[#2a2a2a] bg-[#0d0d0d] text-neutral-700',
                                    disabled
                                      ? 'cursor-not-allowed opacity-70'
                                      : 'cursor-pointer hover:border-brand-lime/30 hover:bg-[#141414]',
                                  )}
                                  aria-label={`${mod.name} ${a.label}`}
                                >
                                  {checked ? '✓' : ''}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <DataPagination
            meta={meta}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            className="mt-5"
          />
        </CardContent>
      </Card>
    </div>
  );
}
