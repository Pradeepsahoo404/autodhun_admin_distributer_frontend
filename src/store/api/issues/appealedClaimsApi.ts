import { baseApi } from '../baseApi';
import { buildIssuesEntryEndpoints } from './issuesEntryEndpoints';

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;
const TAG = 'AppealedClaims' as const;

export const appealedClaimsApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    const e = buildIssuesEntryEndpoints(builder, '/appealed-claims', TAG);
    return {
      getAppealedClaims: e.list,
      createAppealedClaim: e.create,
      updateAppealedClaim: e.update,
      updateAppealedClaimStatus: e.updateStatus,
      updateAppealedClaimOwnership: e.updateOwnership,
      deleteAppealedClaim: e.delete,
      exportAppealedClaims: e.exportCsv,
    };
  },
  ...injectOptions,
});

export const {
  useGetAppealedClaimsQuery,
  useCreateAppealedClaimMutation,
  useUpdateAppealedClaimMutation,
  useUpdateAppealedClaimStatusMutation,
  useUpdateAppealedClaimOwnershipMutation,
  useDeleteAppealedClaimMutation,
  useExportAppealedClaimsMutation,
} = appealedClaimsApi;
