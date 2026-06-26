import { baseApi } from '../baseApi';
import type { Oac } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const oacApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<Oac>(builder, {
      tag: 'Oac',
      basePath: '/oac',
    });
    return {
      getOacEntries: mod.list,
      createOacEntry: mod.create,
      updateOacEntry: mod.update,
      updateOacEntryStatus: mod.updateStatus,
      deleteOacEntry: mod.remove,
      exportOacEntries: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetOacEntriesQuery,
  useCreateOacEntryMutation,
  useUpdateOacEntryMutation,
  useUpdateOacEntryStatusMutation,
  useDeleteOacEntryMutation,
  useExportOacEntriesMutation,
} = oacApi;
