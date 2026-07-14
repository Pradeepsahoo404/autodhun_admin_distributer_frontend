'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import {
  legalModuleCardClass,
  legalModuleCardHeaderClass,
} from '@/components/common/dashboardTableStyles';
import { DASHBOARD_CARD, DASHBOARD_PAGE } from '@/constants';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { useCreateTenantMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  createTenantFormSchema,
  type CreateTenantFormData,
} from '@/features/tenants/schemas';

export default function CreateTenantPage() {
  const router = useRouter();
  const { isMasterAdmin } = useAuthAccount();
  const [createTenant, { isLoading }] = useCreateTenantMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isMasterAdmin) router.replace('/unauthorized');
  }, [isMasterAdmin, router]);

  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      const response = await createTenant({
        name: data.name,
        slug: data.slug?.trim() || undefined,
        superAdmin: {
          firstName: data.firstName,
          lastName: data.lastName || '',
          email: data.email,
          password: data.password?.trim() || undefined,
        },
      }).unwrap();

      const temp = response.data?.temporaryPassword;
      toast.success(
        temp
          ? `Tenant created. Temporary password: ${temp}`
          : response.message || 'Tenant created',
        { duration: temp ? 12000 : 4000 },
      );
      router.push('/dashboard/master/tenants');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (!isMasterAdmin) return null;

  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardPageHeader
        title="New Tenant"
        description="Create an organization and its Super Admin in one step."
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/master/tenants')}
            className="border-[#2a2a2a] bg-transparent text-neutral-300 hover:border-brand-lime/40 hover:text-brand-lime"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
        <Card className={legalModuleCardClass}>
          <CardHeader className={legalModuleCardHeaderClass}>
            <CardTitle className="text-base text-white">Organization</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4 ${DASHBOARD_CARD}`}>
            <ProfileInputField
              id="tenant-name"
              label="Tenant name"
              placeholder="Acme Music"
              required
              error={errors.name?.message}
              {...register('name')}
            />
            <ProfileInputField
              id="tenant-slug"
              label="Slug (optional)"
              placeholder="acme-music"
              error={errors.slug?.message}
              {...register('slug')}
            />
          </CardContent>
        </Card>

        <Card className={legalModuleCardClass}>
          <CardHeader className={legalModuleCardHeaderClass}>
            <CardTitle className="text-base text-white">Super Admin</CardTitle>
            <p className="mt-1 text-sm text-neutral-500">
              Tenant owner with full module access inside this organization. Leave password empty to
              auto-generate and email credentials.
            </p>
          </CardHeader>
          <CardContent className={`space-y-4 ${DASHBOARD_CARD}`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileInputField
                id="sa-firstName"
                label="First name"
                placeholder="Jane"
                required
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <ProfileInputField
                id="sa-lastName"
                label="Last name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <ProfileInputField
              id="sa-email"
              label="Email"
              type="email"
              placeholder="owner@acme.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <ProfileInputField
              id="sa-password"
              label="Password (optional)"
              type="password"
              placeholder="Leave blank to auto-generate"
              error={errors.password?.message}
              {...register('password')}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/master/tenants')}
            className="border-[#2a2a2a] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-brand-lime text-brand-black hover:bg-brand-lime/90"
          >
            {isLoading ? 'Creating…' : 'Create tenant'}
          </Button>
        </div>
      </form>
    </div>
  );
}
