'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ProfileInputField } from '@/components/dashboard/profile/ProfileField';
import { ProfileSectionCard } from '@/components/dashboard/profile/ProfileSectionCard';
import { ProfileSaveButton } from '@/components/dashboard/profile/ProfileSaveButton';
import {
  useGetCronjobSettingsQuery,
  useRunCronjobNowMutation,
  useUpdateCronjobSettingsMutation,
} from '@/store/api/cronjobSettingsApi';
import {
  cronjobSettingsSchema,
  type CronjobSettingsFormData,
} from '@/features/profile/cronjobSettingsSchemas';
import { getApiErrorMessage } from '@/services/apiClient';
import { cn } from '@/lib/utils';

function formatDateTime(value: string | null): string {
  if (!value) return 'Never';
  return new Date(value).toLocaleString();
}

export function CronjobSettingsForm() {
  const { data, isLoading } = useGetCronjobSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateCronjobSettingsMutation();
  const [runNow, { isLoading: running }] = useRunCronjobNowMutation();

  const settings = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CronjobSettingsFormData>({
    resolver: zodResolver(cronjobSettingsSchema),
    defaultValues: { retentionDays: 30, enabled: true },
  });

  const enabled = watch('enabled');

  useEffect(() => {
    if (settings) {
      reset({ retentionDays: settings.retentionDays, enabled: settings.enabled });
    }
  }, [settings, reset]);

  const onSubmit = async (formData: CronjobSettingsFormData) => {
    try {
      const response = await updateSettings(formData).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleRunNow = async () => {
    try {
      const response = await runNow().unwrap();
      const deleted = response.data.run?.totalDeleted ?? 0;
      toast.success(`Auto-delete completed — ${deleted} record(s) removed`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <ProfileSectionCard title="Cronjob Setting" description="Configure automatic cleanup for legal and issue records.">
        <div className="mt-8 flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-brand-lime" />
        </div>
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard
      title="Cronjob Setting"
      description="Automatically delete legal and issue records older than the retention period. Records are removed in batches based on created date."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileInputField
            label="Auto-delete after (days)"
            type="number"
            min={1}
            max={3650}
            placeholder="30"
            error={errors.retentionDays?.message}
            {...register('retentionDays')}
          />

          <div className="space-y-2">
            <span className="text-[13px] font-medium text-neutral-400">Auto-delete enabled</span>
            <label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-600 bg-transparent accent-brand-lime"
                {...register('enabled')}
              />
              <span className="text-[14px] text-white">{enabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-4">
          <p className="text-[13px] font-medium text-neutral-300">Last cron run</p>
          <div className="mt-3 grid gap-3 text-[13px] sm:grid-cols-2">
            <div>
              <span className="text-neutral-500">Ran at: </span>
              <span className="text-neutral-300">{formatDateTime(settings?.lastRunAt ?? null)}</span>
            </div>
            <div>
              <span className="text-neutral-500">Records deleted: </span>
              <span className="text-neutral-300">{settings?.lastRunDeletedCount ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#1a1a1a] pt-6">
          <button
            type="button"
            onClick={() => void handleRunNow()}
            disabled={running || saving}
            className={cn(
              'inline-flex h-11 items-center justify-center rounded-xl border border-[#2a2a2a] px-5 text-[14px] font-medium text-neutral-300 transition-colors',
              'hover:border-brand-lime/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run now'}
          </button>
          <ProfileSaveButton loading={saving} label="Save settings" />
        </div>
      </form>
    </ProfileSectionCard>
  );
}
