import { baseApi } from '../baseApi';
import type { YoutubeClaimRelease } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const youtubeClaimReleaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<YoutubeClaimRelease>(builder, {
      tag: 'YoutubeClaimReleases',
      basePath: '/youtube-claim-releases',
    });
    return {
      getYoutubeClaimReleases: mod.list,
      createYoutubeClaimRelease: mod.create,
      updateYoutubeClaimRelease: mod.update,
      updateYoutubeClaimReleaseStatus: mod.updateStatus,
      deleteYoutubeClaimRelease: mod.remove,
      exportYoutubeClaimReleases: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetYoutubeClaimReleasesQuery,
  useCreateYoutubeClaimReleaseMutation,
  useUpdateYoutubeClaimReleaseMutation,
  useUpdateYoutubeClaimReleaseStatusMutation,
  useDeleteYoutubeClaimReleaseMutation,
  useExportYoutubeClaimReleasesMutation,
} = youtubeClaimReleaseApi;
