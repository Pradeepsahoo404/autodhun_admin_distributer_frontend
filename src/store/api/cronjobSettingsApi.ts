import { baseApi } from './baseApi';
import type { ApiSuccess } from '@/types';

export interface CronjobModuleTarget {
  module: string;
  label: string;
  group: 'legal' | 'issues';
}

export interface CronjobModuleDeleteResult {
  module: string;
  label: string;
  deletedCount: number;
}

export interface CronjobSettings {
  retentionDays: number;
  enabled: boolean;
  lastRunAt: string | null;
  lastRunDeletedCount: number;
  lastRunResults: CronjobModuleDeleteResult[];
  targets: CronjobModuleTarget[];
  updatedAt: string | null;
}

export interface CronjobRunResult {
  run: {
    retentionDays: number;
    cutoffDate: string;
    totalDeleted: number;
    results: CronjobModuleDeleteResult[];
  } | null;
  settings: CronjobSettings;
}

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const cronjobSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCronjobSettings: builder.query<ApiSuccess<CronjobSettings>, void>({
      query: () => '/cronjob-settings',
      providesTags: ['CronjobSettings'],
    }),
    updateCronjobSettings: builder.mutation<
      ApiSuccess<CronjobSettings>,
      { retentionDays: number; enabled: boolean }
    >({
      query: (body) => ({ url: '/cronjob-settings', method: 'PUT', body }),
      invalidatesTags: ['CronjobSettings'],
    }),
    runCronjobNow: builder.mutation<ApiSuccess<CronjobRunResult>, void>({
      query: () => ({ url: '/cronjob-settings/run', method: 'POST' }),
      invalidatesTags: ['CronjobSettings'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetCronjobSettingsQuery,
  useUpdateCronjobSettingsMutation,
  useRunCronjobNowMutation,
} = cronjobSettingsApi;
