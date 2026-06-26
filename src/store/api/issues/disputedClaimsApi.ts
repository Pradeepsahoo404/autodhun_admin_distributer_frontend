import { baseApi } from '../baseApi';
import { buildIssuesEntryEndpoints } from './issuesEntryEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;
const TAG = 'DisputedClaims' as const;

export const disputedClaimsApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const e = buildIssuesEntryEndpoints(builder, '/disputed-claims', TAG);
    return {
      getDisputedClaims: e.list,
      createDisputedClaim: e.create,
      updateDisputedClaim: e.update,
      updateDisputedClaimStatus: e.updateStatus,
      updateDisputedClaimOwnership: e.updateOwnership,
      deleteDisputedClaim: e.delete,
      exportDisputedClaims: e.exportCsv,
    };
  },
  ...injectOptions,
});

export const {
  useGetDisputedClaimsQuery,
  useCreateDisputedClaimMutation,
  useUpdateDisputedClaimMutation,
  useUpdateDisputedClaimStatusMutation,
  useUpdateDisputedClaimOwnershipMutation,
  useDeleteDisputedClaimMutation,
  useExportDisputedClaimsMutation,
} = disputedClaimsApi;
