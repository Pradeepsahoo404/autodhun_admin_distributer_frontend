'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileTextareaField } from '@/components/dashboard/profile/ProfileField';
import { useCreateSupportTicketMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { usePermission } from '@/hooks/usePermission';
import { useAppSelector } from '@/hooks/useAppStore';
import { DASHBOARD_CARD, DASHBOARD_PAGE, DASHBOARD_PAGE_TITLE, isElevatedRole } from '@/constants';
import {
  supportTicketFormSchema,
  type SupportTicketFormData,
} from '@/features/help-support/schemas';
import {
  SupportTicketCategoryFields,
  defaultSupportTicketFormValues,
} from '@/components/dashboard/help-support/SupportTicketCategoryFields';
import { cn } from '@/lib/utils';

export function CreateSupportTicketForm() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const isElevated = isElevatedRole(user?.role);
  const { canCreate } = usePermission('help-support');
  const [createTicket, { isLoading }] = useCreateSupportTicketMutation();

  useEffect(() => {
    if (isElevated || !canCreate) {
      router.replace('/dashboard/help-support');
    }
  }, [isElevated, canCreate, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketFormSchema),
    defaultValues: defaultSupportTicketFormValues,
  });

  if (isElevated || !canCreate) {
    return null;
  }

  const onSubmit = async (data: SupportTicketFormData) => {
    try {
      const result = await createTicket(data).unwrap();
      toast.success(`Support request #${result.data.ticketNumber} submitted`);
      router.push('/dashboard/help-support');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-6')}>
      <button
        type="button"
        onClick={() => router.push('/dashboard/help-support')}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Support Center
      </button>

      <div>
        <h1 className={DASHBOARD_PAGE_TITLE}>New Support Request</h1>
        <p className="mt-2 text-[14px] text-neutral-500">
          Select your issue category and type, then describe the problem in detail.
        </p>
      </div>

      <Card className={DASHBOARD_CARD}>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <section className="border-b border-[#1a1a1a]">
              <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]/50 px-5 py-4 sm:px-8">
                <h2 className="text-[15px] font-semibold text-white">Basic Details</h2>
              </div>
              <div className="px-5 py-6 sm:px-8">
                <SupportTicketCategoryFields
                  watch={watch}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  errors={errors}
                  idPrefix="create-"
                />
              </div>
            </section>

            <section>
              <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]/50 px-5 py-4 sm:px-8">
                <h2 className="text-[15px] font-semibold text-white">Form Details</h2>
              </div>
              <div className="px-5 py-6 sm:px-8">
                <ProfileTextareaField
                  id="description"
                  label="Description"
                  required
                  rows={8}
                  placeholder="Please describe your issue in detail..."
                  className="[&_textarea]:min-h-[180px]"
                  error={errors.description?.message}
                  {...register('description', { onChange: () => clearErrors('description') })}
                />
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[#1a1a1a] px-5 py-6 sm:flex-row sm:justify-end sm:px-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/help-support')}
                className="rounded-xl border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-brand-lime text-black hover:bg-brand-lime-dark"
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
