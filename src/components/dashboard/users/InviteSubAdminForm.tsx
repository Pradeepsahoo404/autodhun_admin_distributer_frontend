'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileInputField, ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import {
  useGetPermissionMatrixQuery,
  useGetRolesQuery,
  useInviteSubAdminMutation,
} from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE, ROLES, ROUTES } from '@/constants';
import { inviteAdminSchema, type InviteAdminFormData } from '@/features/users/userSchemas';
import {
  SubAdminPermissionsMatrix,
  buildDefaultSubAdminMatrix,
  matrixToPermissionPayload,
  type SubAdminPermissionsMatrixState,
} from '@/components/dashboard/users/SubAdminPermissionsMatrix';
import {
  legalModuleCardClass,
  legalModuleCardHeaderClass,
} from '@/components/common/dashboardTableStyles';
import { cn } from '@/lib/utils';

export function InviteSubAdminForm() {
  const router = useRouter();
  const [inviteSubAdmin, { isLoading }] = useInviteSubAdminMutation();
  const { data: rolesData } = useGetRolesQuery({ all: 'true' });
  const subAdminRoleId = useMemo(
    () => rolesData?.data?.find((role) => role.slug === ROLES.SUB_ADMIN)?._id ?? '',
    [rolesData],
  );
  const { data: matrixData, isFetching: matrixLoading } = useGetPermissionMatrixQuery(
    { roleId: subAdminRoleId },
    { skip: !subAdminRoleId },
  );

  const moduleRows = useMemo(
    () =>
      (matrixData?.data ?? [])
        .filter((row) => row.isRoot)
        .map((row) => ({
          moduleId: row.moduleId,
          name: row.name,
          slug: row.slug,
          group: row.group,
          order: row.order,
        })),
    [matrixData],
  );

  const [matrix, setMatrix] = useState<SubAdminPermissionsMatrixState>({});
  const [permissionsError, setPermissionsError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteAdminFormData>({
    resolver: zodResolver(inviteAdminSchema),
    defaultValues: { firstName: '', lastName: '', email: '', personalMessage: '' },
  });

  useEffect(() => {
    if (moduleRows.length === 0) return;
    setMatrix(buildDefaultSubAdminMatrix(moduleRows));
  }, [moduleRows]);

  const goBack = () => router.push(ROUTES.SUB_ADMINS);

  const onSubmit = async (data: InviteAdminFormData) => {
    const permissions = matrixToPermissionPayload(matrix);
    if (permissions.length === 0 || !permissions.some((row) => row.canView)) {
      setPermissionsError('At least one module must have View access');
      return;
    }
    setPermissionsError(undefined);

    try {
      const response = await inviteSubAdmin({
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        personalMessage: data.personalMessage || undefined,
        permissions,
      }).unwrap();
      toast.success(response.message || 'Sub Admin invited successfully');
      goBack();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Invite Sub Admin"
        description="An email with login credentials will be sent. Assign the modules this Sub Admin can access."
        action={
          <Button variant="ghost" onClick={goBack} className="text-neutral-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sub Admins
          </Button>
        }
      />

      <form id="invite-sub-admin-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className={legalModuleCardClass}>
          <CardHeader className={legalModuleCardHeaderClass}>
            <CardTitle className="text-white">Account details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileInputField
                id="invite-sub-firstName"
                label="First name"
                placeholder="John"
                required
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <ProfileInputField
                id="invite-sub-lastName"
                label="Last name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <ProfileInputField
              id="invite-sub-email"
              label="Email"
              type="email"
              placeholder="subadmin@company.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <ProfileTextareaField
              id="invite-sub-message"
              label="Additional note (optional)"
              placeholder="Add a short note for the invitee (optional)..."
              error={errors.personalMessage?.message}
              {...register('personalMessage')}
            />
          </CardContent>
        </Card>

        <Card className={legalModuleCardClass}>
          <CardHeader className={legalModuleCardHeaderClass}>
            <CardTitle className="text-white">Module permissions</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            {matrixLoading ? (
              <p className="text-sm text-neutral-500">Loading modules...</p>
            ) : (
              <SubAdminPermissionsMatrix
                rows={moduleRows}
                matrix={matrix}
                onChange={setMatrix}
                fullHeight
                error={permissionsError}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={goBack} className="text-neutral-300">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || matrixLoading}
            className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send invite
          </Button>
        </div>
      </form>
    </div>
  );
}
