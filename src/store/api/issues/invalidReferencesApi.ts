import { baseApi } from '../baseApi';
import { buildIssuesEntryEndpoints } from './issuesEntryEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;
const TAG = 'InvalidReferences' as const;

export const invalidReferencesApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const e = buildIssuesEntryEndpoints(builder, '/invalid-references', TAG);
    return {
      getInvalidReferences: e.list,
      createInvalidReference: e.create,
      updateInvalidReference: e.update,
      updateInvalidReferenceStatus: e.updateStatus,
      updateInvalidReferenceOwnership: e.updateOwnership,
      deleteInvalidReference: e.delete,
      exportInvalidReferences: e.exportCsv,
    };
  },
  ...injectOptions,
});

export const {
  useGetInvalidReferencesQuery,
  useCreateInvalidReferenceMutation,
  useUpdateInvalidReferenceMutation,
  useUpdateInvalidReferenceStatusMutation,
  useUpdateInvalidReferenceOwnershipMutation,
  useDeleteInvalidReferenceMutation,
  useExportInvalidReferencesMutation,
} = invalidReferencesApi;
