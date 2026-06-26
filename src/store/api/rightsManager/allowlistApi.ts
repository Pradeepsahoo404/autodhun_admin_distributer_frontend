import { baseApi } from '../baseApi';
import type { Allowlist } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const allowlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<Allowlist>(builder, {
      tag: 'Allowlist',
      basePath: '/allowlist',
    });
    return {
      getAllowlistEntries: mod.list,
      createAllowlistEntry: mod.create,
      updateAllowlistEntry: mod.update,
      updateAllowlistEntryStatus: mod.updateStatus,
      deleteAllowlistEntry: mod.remove,
      exportAllowlistEntries: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetAllowlistEntriesQuery,
  useCreateAllowlistEntryMutation,
  useUpdateAllowlistEntryMutation,
  useUpdateAllowlistEntryStatusMutation,
  useDeleteAllowlistEntryMutation,
  useExportAllowlistEntriesMutation,
} = allowlistApi;
