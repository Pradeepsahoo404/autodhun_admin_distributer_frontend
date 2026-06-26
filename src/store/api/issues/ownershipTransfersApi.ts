import { baseApi } from '../baseApi';
import { buildIssuesEntryEndpoints } from './issuesEntryEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;
const TAG = 'OwnershipTransfers' as const;

export const ownershipTransfersApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const e = buildIssuesEntryEndpoints(builder, '/ownership-transfers', TAG);
    return {
      getOwnershipTransfers: e.list,
      createOwnershipTransfer: e.create,
      updateOwnershipTransfer: e.update,
      updateOwnershipTransferStatus: e.updateStatus,
      updateOwnershipTransferOwnership: e.updateOwnership,
      deleteOwnershipTransfer: e.delete,
      exportOwnershipTransfers: e.exportCsv,
    };
  },
  ...injectOptions,
});

export const {
  useGetOwnershipTransfersQuery,
  useCreateOwnershipTransferMutation,
  useUpdateOwnershipTransferMutation,
  useUpdateOwnershipTransferStatusMutation,
  useUpdateOwnershipTransferOwnershipMutation,
  useDeleteOwnershipTransferMutation,
  useExportOwnershipTransfersMutation,
} = ownershipTransfersApi;
