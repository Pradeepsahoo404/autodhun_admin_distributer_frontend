import { baseApi } from '../baseApi';
import type { ContentId } from '@/types';
import { legalModuleEndpoints } from './legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const contentIdApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<ContentId>(builder, {
      tag: 'ContentIds',
      basePath: '/content-id',
    });
    return {
      getContentIds: mod.list,
      createContentId: mod.create,
      updateContentId: mod.update,
      updateContentIdStatus: mod.updateStatus,
      deleteContentId: mod.remove,
      exportContentIds: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetContentIdsQuery,
  useCreateContentIdMutation,
  useUpdateContentIdMutation,
  useUpdateContentIdStatusMutation,
  useDeleteContentIdMutation,
  useExportContentIdsMutation,
} = contentIdApi;
