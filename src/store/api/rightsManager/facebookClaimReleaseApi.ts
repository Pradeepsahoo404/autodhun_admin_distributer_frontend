import { baseApi } from '../baseApi';
import type { FacebookClaimRelease } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const facebookClaimReleaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<FacebookClaimRelease>(builder, {
      tag: 'FacebookClaimReleases',
      basePath: '/facebook-claim-releases',
    });
    return {
      getFacebookClaimReleases: mod.list,
      createFacebookClaimRelease: mod.create,
      updateFacebookClaimRelease: mod.update,
      updateFacebookClaimReleaseStatus: mod.updateStatus,
      deleteFacebookClaimRelease: mod.remove,
      exportFacebookClaimReleases: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetFacebookClaimReleasesQuery,
  useCreateFacebookClaimReleaseMutation,
  useUpdateFacebookClaimReleaseMutation,
  useUpdateFacebookClaimReleaseStatusMutation,
  useDeleteFacebookClaimReleaseMutation,
  useExportFacebookClaimReleasesMutation,
} = facebookClaimReleaseApi;
