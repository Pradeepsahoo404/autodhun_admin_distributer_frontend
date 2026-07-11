import { baseApi } from './baseApi';
import type { Channel } from '@/types';
import { legalModuleEndpoints } from './rightsManager/legalModuleEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const channelApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const mod = legalModuleEndpoints<Channel>(builder, {
      tag: 'Channels',
      basePath: '/channels',
    });
    return {
      getChannels: mod.list,
      createChannel: mod.create,
      updateChannel: mod.update,
      updateChannelStatus: mod.updateStatus,
      deleteChannel: mod.remove,
      exportChannels: mod.export,
    };
  },
  ...injectOptions,
});

export const {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useUpdateChannelStatusMutation,
  useDeleteChannelMutation,
  useExportChannelsMutation,
} = channelApi;
