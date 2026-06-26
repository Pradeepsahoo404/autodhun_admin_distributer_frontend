import { baseApi } from '../baseApi';
import type { ProfileLinking } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const profileLinkingApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<ProfileLinking>(builder, {
      tag: 'ProfileLinking',
      basePath: '/profile-linking',
    });
    return {
      getProfileLinkingEntries: mod.list,
      createProfileLinkingEntry: mod.create,
      updateProfileLinkingEntry: mod.update,
      updateProfileLinkingEntryStatus: mod.updateStatus,
      deleteProfileLinkingEntry: mod.remove,
      exportProfileLinkingEntries: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetProfileLinkingEntriesQuery,
  useCreateProfileLinkingEntryMutation,
  useUpdateProfileLinkingEntryMutation,
  useUpdateProfileLinkingEntryStatusMutation,
  useDeleteProfileLinkingEntryMutation,
  useExportProfileLinkingEntriesMutation,
} = profileLinkingApi;
