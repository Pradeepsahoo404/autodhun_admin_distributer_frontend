import { baseApi } from '../baseApi';
import type { Takedown } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const takedownApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<Takedown>(builder, {
      tag: 'Takedown',
      basePath: '/takedown',
    });
    return {
      getTakedownEntries: mod.list,
      createTakedownEntry: mod.create,
      updateTakedownEntry: mod.update,
      updateTakedownEntryStatus: mod.updateStatus,
      deleteTakedownEntry: mod.remove,
      exportTakedownEntries: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetTakedownEntriesQuery,
  useCreateTakedownEntryMutation,
  useUpdateTakedownEntryMutation,
  useUpdateTakedownEntryStatusMutation,
  useDeleteTakedownEntryMutation,
  useExportTakedownEntriesMutation,
} = takedownApi;
