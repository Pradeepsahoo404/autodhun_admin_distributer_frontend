'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileInputField, ProfileField } from '@/components/dashboard/profile/ProfileField';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import {
  useGetSubAdminPermissionsQuery,
  useGetUserByIdQuery,
  useUpdateSubAdminPermissionsMutation,
  useUpdateUserMutation,
} from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE, ROUTES } from '@/constants';
import { optionalNameField, requiredNameField } from '@/lib/validation/fields';
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

const editSubAdminSchema = z.object({
  firstName: requiredNameField('First name'),
  lastName: optionalNameField('Last name'),
});

type EditSubAdminFormData = z.infer<typeof editSubAdminSchema>;

interface EditSubAdminFormProps {
  userId: string;
}

export function EditSubAdminForm({ userId }: EditSubAdminFormProps) {
  const router = useRouter();
  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(userId, { skip: !userId });
  const { data: permsData, isFetching: permsLoading } = useGetSubAdminPermissionsQuery(userId, {
    skip: !userId,
  });
  const [updateUser, { isLoading: savingUser }] = useUpdateUserMutation();
  const [updatePermissions, { isLoading: savingPerms }] = useUpdateSubAdminPermissionsMutation();

  const user = userData?.data;

  const moduleRows = useMemo(
    () =>
      (permsData?.data ?? [])
        .filter((row) => row.isRoot)
        .map((row) => ({
          moduleId: row.moduleId,
          name: row.name,
          slug: row.slug,
          group: row.group,
          order: row.order,
        })),
    [permsData],
  );

  const [matrix, setMatrix] = useState<SubAdminPermissionsMatrixState>({});
  const [permissionsError, setPermissionsError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSubAdminFormData>({
    resolver: zodResolver(editSubAdminSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    });
  }, [user, reset]);

  useEffect(() => {
    if (moduleRows.length === 0) return;
    const existing: SubAdminPermissionsMatrixState = {};
    for (const row of permsData?.data ?? []) {
      if (!row.isRoot) continue;
      existing[row.moduleId] = {
        canView: row.canView,
        canCreate: row.canCreate,
        canUpdate: row.canUpdate,
        canDelete: row.canDelete,
      };
    }
    setMatrix(buildDefaultSubAdminMatrix(moduleRows, existing));
  }, [moduleRows, permsData]);

  const goBack = () => router.push(ROUTES.SUB_ADMINS);
  const saving = savingUser || savingPerms;
  const loading = userLoading || permsLoading;

  const onSubmit = async (data: EditSubAdminFormData) => {
    const permissions = matrixToPermissionPayload(matrix);
    if (permissions.length === 0 || !permissions.some((row) => row.canView)) {
      setPermissionsError('At least one module must have View access');
      return;
    }
    setPermissionsError(undefined);

    try {
      await updateUser({
        id: userId,
        body: {
          firstName: data.firstName,
          lastName: data.lastName || '',
        },
      }).unwrap();
      await updatePermissions({ id: userId, body: { permissions } }).unwrap();
      toast.success('Sub Admin updated successfully');
      goBack();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Edit Sub Admin"
        description={
          user?.email
            ? `Update account details and module access for ${user.email}.`
            : 'Update account details and module access.'
        }
        action={
          <Button variant="ghost" onClick={goBack} className="text-neutral-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sub Admins
          </Button>
        }
      />

      {loading && !user ? (
        <p className="text-sm text-neutral-500">Loading Sub Admin...</p>
      ) : (
        <form id="edit-sub-admin-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className={legalModuleCardClass}>
            <CardHeader className={legalModuleCardHeaderClass}>
              <CardTitle className="text-white">Account details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileInputField
                  id="edit-sub-firstName"
                  label="First name"
                  placeholder="John"
                  required
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <ProfileInputField
                  id="edit-sub-lastName"
                  label="Last name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
              <ProfileField label="Email" value={user?.email ?? ''} />
            </CardContent>
          </Card>

          <Card className={legalModuleCardClass}>
            <CardHeader className={legalModuleCardHeaderClass}>
              <CardTitle className="text-white">Module permissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {permsLoading ? (
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
              disabled={saving || loading}
              className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
