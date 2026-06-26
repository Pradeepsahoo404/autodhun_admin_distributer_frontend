'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Mail, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useResendInviteMutation,
  useUpdateUserMutation,
} from '@/store/api';
import { usePermission } from '@/hooks/usePermission';
import { useAppSelector } from '@/hooks/useAppStore';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE, ROLES } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { TableSearchField } from '@/components/common/TableSearchField';
import { TableSelectField } from '@/components/common/TableSelectField';
import { TableRowActions } from '@/components/common/TableRowActions';
import {
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
  tableIconButtonClass,
} from '@/components/common/dashboardTableStyles';
import { InviteAdminDialog } from '@/components/dashboard/users/InviteAdminDialog';
import { EditUserDialog } from '@/components/dashboard/users/EditUserDialog';
import { DeleteUserDialog } from '@/components/dashboard/users/DeleteUserDialog';
import { cn } from '@/lib/utils';
import type { PaginatedMeta, User } from '@/types';

const DEFAULT_PAGE_LIMIT = 10;

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;

function isInvitePending(user: User): boolean {
  return user.termsAccepted === false;
}

export default function UsersPage() {
  const { user: currentUser } = useAppSelector((s) => s.auth);
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;
  const { canCreate, canUpdate, canDelete } = usePermission('users');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [resendingInviteId, setResendingInviteId] = useState<string | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

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

  const { data, isLoading, isFetching } = useGetUsersQuery(queryParams);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUserApi, { isLoading: deleting }] = useDeleteUserMutation();
  const [resendInvite] = useResendInviteMutation();

  const users = data?.data ?? [];
  const meta = data?.meta as PaginatedMeta | undefined;

  const handleStatusToggle = async (user: User, checked: boolean) => {
    const nextStatus = checked ? 'active' : 'inactive';
    setStatusUpdatingId(user._id);
    try {
      await updateUser({ id: user._id, body: { status: nextStatus } }).unwrap();
      toast.success(`User ${checked ? 'activated' : 'deactivated'}`);
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

  const handleResendInvite = async (user: User) => {
    setResendingInviteId(user._id);
    try {
      const response = await resendInvite({ id: user._id }).unwrap();
      toast.success(response.message || 'Invite resent with new credentials');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setResendingInviteId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    try {
      await deleteUserApi(deleteUser._id).unwrap();
      toast.success('User deleted');
      setDeleteUser(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Users"
        description="Manage system users"
        action={
          isSuperAdmin && canCreate ? (
            <Button
              onClick={() => setInviteOpen(true)}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Invite Admin
            </Button>
          ) : undefined
        }
      />

      <Card className={legalModuleCardClass}>
        <CardHeader className={legalModuleCardHeaderClass}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-white">Admins</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <TableSearchField
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search by name or email..."
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
            <p className="py-10 text-center text-neutral-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="py-10 text-center text-neutral-500">No users found.</p>
          ) : (
            <div className={dashboardTableWrapperClass()}>
              <div className="overflow-x-auto">
                <table className={cn(dashboardTableClass, 'min-w-[760px]')}>
                  <thead className={dashboardTableHeadClass}>
                    <tr className={dashboardTableHeadRowClass}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className={dashboardTableHeadCellActions}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={dashboardTableBodyClass}>
                    {users.map((user) => {
                      const isSelf = user._id === currentUser?.id;
                      const isActive = user.status === 'active';
                      const showResendInvite = isSuperAdmin && canCreate && isInvitePending(user);

                      return (
                        <tr key={user._id} className={dashboardTableRowClass}>
                          <td className={dashboardTableCellPrimary}>{user.name}</td>
                          <td className={dashboardTableCellMuted}>{user.email}</td>
                          <td className="px-4 py-4 capitalize">
                            <span className={slugBadgeClass}>{user.role?.name}</span>
                          </td>
                          <td className="px-4 py-4">
                            {canUpdate ? (
                              <div className="flex h-6 w-11 items-center justify-center">
                                {statusUpdatingId === user._id ? (
                                  <Loader2
                                    className="h-4 w-4 animate-spin text-brand-lime"
                                    aria-label={`Updating status for ${user.name}`}
                                  />
                                ) : (
                                  <Switch
                                    checked={isActive}
                                    disabled={statusUpdatingId !== null}
                                    onCheckedChange={(checked) => void handleStatusToggle(user, checked)}
                                    aria-label={`Toggle status for ${user.name}`}
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
                              canDelete={canDelete && !isSelf}
                              onEdit={() => setEditUser(user)}
                              onDelete={() => setDeleteUser(user)}
                              leadingActions={
                                showResendInvite ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    title="Resend invite"
                                    disabled={resendingInviteId !== null}
                                    className={cn(tableIconButtonClass, 'hover:text-brand-lime')}
                                    onClick={() => void handleResendInvite(user)}
                                  >
                                    {resendingInviteId === user._id ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-lime" />
                                    ) : (
                                      <Mail className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                ) : null
                              }
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
            className="mt-5"
          />
          {isFetching && !isLoading ? <p className="mt-2 text-center text-xs text-neutral-600">Updating...</p> : null}
        </CardContent>
      </Card>

      <InviteAdminDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <EditUserDialog open={Boolean(editUser)} user={editUser} onClose={() => setEditUser(null)} />
      <DeleteUserDialog
        open={Boolean(deleteUser)}
        user={deleteUser}
        loading={deleting}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
