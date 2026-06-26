import { baseApi } from '../baseApi';
import { buildIssuesEntryEndpoints } from './issuesEntryEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;
const TAG = 'PotentialClaims' as const;

export const potentialClaimsApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const e = buildIssuesEntryEndpoints(builder, '/potential-claims', TAG);
    return {
      getPotentialClaims: e.list,
      createPotentialClaim: e.create,
      updatePotentialClaim: e.update,
      updatePotentialClaimStatus: e.updateStatus,
      updatePotentialClaimOwnership: e.updateOwnership,
      deletePotentialClaim: e.delete,
      exportPotentialClaims: e.exportCsv,
    };
  },
  ...injectOptions,
});

export const {
  useGetPotentialClaimsQuery,
  useCreatePotentialClaimMutation,
  useUpdatePotentialClaimMutation,
  useUpdatePotentialClaimStatusMutation,
  useUpdatePotentialClaimOwnershipMutation,
  useDeletePotentialClaimMutation,
  useExportPotentialClaimsMutation,
} = potentialClaimsApi;
