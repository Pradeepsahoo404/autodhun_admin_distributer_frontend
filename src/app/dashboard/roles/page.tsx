'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from '@/store/api';
import { usePermission } from '@/hooks/usePermission';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { TableRowActions } from '@/components/common/TableRowActions';
import {
  customBadgeClass,
  dashboardTableBodyClass,
  dashboardTableCellActions,
  dashboardTableHeadCellActions,
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
  systemBadgeClass,
} from '@/components/common/dashboardTableStyles';
import { CreateRoleDialog } from '@/components/dashboard/roles/CreateRoleDialog';
import { EditRoleDialog } from '@/components/dashboard/roles/EditRoleDialog';
import { DeleteRoleDialog } from '@/components/dashboard/roles/DeleteRoleDialog';
import { cn } from '@/lib/utils';
import type { PaginatedMeta, Role } from '@/types';

const DEFAULT_PAGE_LIMIT = 10;

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;

export default function RolesPage() {
  const { canCreate, canUpdate, canDelete } = usePermission('roles');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    }),
    [page, limit, search, statusFilter],
  );

  const { data, isLoading, isFetching } = useGetRolesQuery(queryParams);
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRoleApi, { isLoading: deleting }] = useDeleteRoleMutation();

  const roles = data?.data ?? [];
  const meta = data?.meta as PaginatedMeta | undefined;

  const handleStatusToggle = async (role: Role, checked: boolean) => {
    const nextStatus = checked ? 'active' : 'inactive';
    setStatusUpdatingId(role._id);
    try {
      await updateRole({ id: role._id, body: { status: nextStatus } }).unwrap();
      toast.success(`Role ${checked ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRole) return;
    try {
      await deleteRoleApi(deleteRole._id).unwrap();
      toast.success('Role deleted');
      setDeleteRole(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Roles"
        description="Manage user roles"
        action={
          canCreate ? (
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          ) : undefined
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-white">All roles</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <TableSearchField
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search by name or slug..."
              />
              <TableSelectField
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value as 'all' | 'active' | 'inactive');
                  setPage(1);
                }}
                options={[...STATUS_FILTER_OPTIONS]}
                aria-label="Filter by status"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {isLoading ? (
            <p className="py-10 text-center text-neutral-500">Loading roles...</p>
          ) : roles.length === 0 ? (
            <p className="py-10 text-center text-neutral-500">No roles found.</p>
          ) : (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[760px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th className={dashboardTableHeadCellActions}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {roles.map((role) => {
                      const isActive = (role.status ?? 'active') === 'active';

                      return (
                        <tr key={role._id} className={dashboardTableRowClass}>
                          <td className={dashboardTableCellPrimary}>{role.name}</td>
                          <td className="px-4 py-4">
                            <span className={slugBadgeClass}>{role.slug}</span>
                          </td>
                          <td className={dashboardTableCellMuted}>{role.description || '—'}</td>
                          <td className="px-4 py-4">
                            {role.isSystem ? (
                              <span className={systemBadgeClass}>System</span>
                            ) : (
                              <span className={customBadgeClass}>Custom</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {canUpdate ? (
                              <div className="flex h-6 w-11 items-center justify-center">
                                {statusUpdatingId === role._id ? (
                                  <Loader2
                                    className="h-4 w-4 animate-spin text-brand-lime"
                                    aria-label={`Updating status for ${role.name}`}
                                  />
                                ) : (
                                  <Switch
                                    checked={isActive}
                                    disabled={statusUpdatingId !== null}
                                    onCheckedChange={(checked) => void handleStatusToggle(role, checked)}
                                    aria-label={`Toggle status for ${role.name}`}
                                  />
                                )}
                              </div>
                            ) : (
                              <span className="text-neutral-500">—</span>
                            )}
                          </td>
                          <td className={dashboardTableCellActions}>
                            <TableRowActions
                              canEdit={canUpdate}
                              canDelete={canDelete && !role.isSystem}
                              onEdit={() => setEditRole(role)}
                              onDelete={() => setDeleteRole(role)}
                            />
                          </td>
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
          />
          {isFetching && !isLoading ? (
            <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p>
          ) : null}
        </CardContent>
      </Card>

      <CreateRoleDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditRoleDialog open={Boolean(editRole)} role={editRole} onClose={() => setEditRole(null)} />
      <DeleteRoleDialog
        open={Boolean(deleteRole)}
        role={deleteRole}
        loading={deleting}
        onClose={() => setDeleteRole(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
