import { baseApi } from '../baseApi';
import type { ManualClaiming } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const manualClaimingApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<ManualClaiming>(builder, {
      tag: 'ManualClaiming',
      basePath: '/manual-claiming',
    });
    return {
      getManualClaimingEntries: mod.list,
      createManualClaimingEntry: mod.create,
      updateManualClaimingEntry: mod.update,
      updateManualClaimingEntryStatus: mod.updateStatus,
      deleteManualClaimingEntry: mod.remove,
      exportManualClaimingEntries: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetManualClaimingEntriesQuery,
  useCreateManualClaimingEntryMutation,
  useUpdateManualClaimingEntryMutation,
  useUpdateManualClaimingEntryStatusMutation,
  useDeleteManualClaimingEntryMutation,
  useExportManualClaimingEntriesMutation,
} = manualClaimingApi;
