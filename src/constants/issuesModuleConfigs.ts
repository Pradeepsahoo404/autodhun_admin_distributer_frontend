import {
  useCreateInvalidReferenceMutation,
  useDeleteInvalidReferenceMutation,
  useExportInvalidReferencesMutation,
  useGetInvalidReferencesQuery,
  useUpdateInvalidReferenceMutation,
  useUpdateInvalidReferenceOwnershipMutation,
  useUpdateInvalidReferenceStatusMutation,
} from '@/store/api/issues/invalidReferencesApi';
import {
  useCreateOwnershipTransferMutation,
  useDeleteOwnershipTransferMutation,
  useExportOwnershipTransfersMutation,
  useGetOwnershipTransfersQuery,
  useUpdateOwnershipTransferMutation,
  useUpdateOwnershipTransferOwnershipMutation,
  useUpdateOwnershipTransferStatusMutation,
} from '@/store/api/issues/ownershipTransfersApi';
import {
  useCreatePotentialClaimMutation,
  useDeletePotentialClaimMutation,
  useExportPotentialClaimsMutation,
  useGetPotentialClaimsQuery,
  useUpdatePotentialClaimMutation,
  useUpdatePotentialClaimOwnershipMutation,
  useUpdatePotentialClaimStatusMutation,
} from '@/store/api/issues/potentialClaimsApi';
import {
  useCreateDisputedClaimMutation,
  useDeleteDisputedClaimMutation,
  useExportDisputedClaimsMutation,
  useGetDisputedClaimsQuery,
  useUpdateDisputedClaimMutation,
  useUpdateDisputedClaimOwnershipMutation,
  useUpdateDisputedClaimStatusMutation,
} from '@/store/api/issues/disputedClaimsApi';
import {
  useCreateAppealedClaimMutation,
  useDeleteAppealedClaimMutation,
  useExportAppealedClaimsMutation,
  useGetAppealedClaimsQuery,
  useUpdateAppealedClaimMutation,
  useUpdateAppealedClaimOwnershipMutation,
  useUpdateAppealedClaimStatusMutation,
} from '@/store/api/issues/appealedClaimsApi';

export interface IssuesModulePageConfig {
  title: string;
  superAdminDescription: string;
  adminDescription: string;
  addButtonLabel: string;
  listTitleSuperAdmin: string;
  listTitleAdmin: string;
  emptySuperAdmin: string;
  emptyAdmin: string;
  loadingMessage: string;
  createDialogTitle: string;
  createSuccessMessage: string;
  createFormId: string;
  editDialogTitle: string;
  editSuccessMessage: string;
  editFormId: string;
  deleteDialogTitle: string;
  deleteDialogMessage: string;
  deleteSuccessMessage: string;
  exportFilePrefix: string;
  useGetQuery: (
    params: Record<string, string | number>,
    options?: { skip?: boolean },
  ) => {
    data?: {
      data?: import('@/types').IssuesAssignedEntry[];
      meta?: import('@/types').PaginatedMeta;
    };
    isLoading: boolean;
    isFetching: boolean;
  };
  useCreateMutation: () => readonly [
    (body: Record<string, unknown>) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ];
  useUpdateMutation: () => readonly [
    (args: { id: string; body: Record<string, unknown> }) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ];
  useUpdateStatusMutation: () => readonly [
    (args: { id: string; body: { status: 'active' | 'inactive' } }) => {
      unwrap: () => Promise<unknown>;
    },
    { isLoading: boolean },
  ];
  useUpdateOwnershipMutation: () => readonly [
    (args: { id: string; body: { ownership: 'yes' | 'no' } }) => {
      unwrap: () => Promise<unknown>;
    },
    { isLoading: boolean },
  ];
  useDeleteMutation: () => readonly [
    (id: string) => { unwrap: () => Promise<unknown> },
    { isLoading: boolean },
  ];
  useExportMutation: () => readonly [
    (params: { dateFrom?: string; dateTo?: string }) => { unwrap: () => Promise<Blob> },
    { isLoading: boolean },
  ];
}

export const INVALID_REFERENCES_PAGE_CONFIG: IssuesModulePageConfig = {
  title: 'Invalid References',
  superAdminDescription: 'Create and assign invalid references to admins for ownership review',
  adminDescription: 'Review assigned invalid references and confirm ownership',
  addButtonLabel: 'Add Invalid Reference',
  listTitleSuperAdmin: 'All invalid references',
  listTitleAdmin: 'Assigned to me',
  emptySuperAdmin: 'No invalid references found.',
  emptyAdmin: 'No invalid references assigned to you yet.',
  loadingMessage: 'Loading invalid references...',
  createDialogTitle: 'Add Invalid Reference',
  createSuccessMessage: 'Invalid reference created and assigned',
  createFormId: 'create-invalid-reference-form',
  editDialogTitle: 'Edit Invalid Reference',
  editSuccessMessage: 'Invalid reference updated',
  editFormId: 'edit-invalid-reference-form',
  deleteDialogTitle: 'Delete invalid reference',
  deleteDialogMessage:
    'This action cannot be undone. The invalid reference record will be permanently removed.',
  deleteSuccessMessage: 'Invalid reference deleted',
  exportFilePrefix: 'invalid-references',
  useGetQuery: useGetInvalidReferencesQuery,
  useCreateMutation: useCreateInvalidReferenceMutation,
  useUpdateMutation: useUpdateInvalidReferenceMutation,
  useUpdateStatusMutation: useUpdateInvalidReferenceStatusMutation,
  useUpdateOwnershipMutation: useUpdateInvalidReferenceOwnershipMutation,
  useDeleteMutation: useDeleteInvalidReferenceMutation,
  useExportMutation: useExportInvalidReferencesMutation,
};

export const OWNERSHIP_TRANSFERS_PAGE_CONFIG: IssuesModulePageConfig = {
  title: 'Ownership Transfers',
  superAdminDescription: 'Create and assign ownership transfers to admins for ownership review',
  adminDescription: 'Review assigned ownership transfers and confirm ownership',
  addButtonLabel: 'Add Ownership Transfer',
  listTitleSuperAdmin: 'All ownership transfers',
  listTitleAdmin: 'Assigned to me',
  emptySuperAdmin: 'No ownership transfers found.',
  emptyAdmin: 'No ownership transfers assigned to you yet.',
  loadingMessage: 'Loading ownership transfers...',
  createDialogTitle: 'Add Ownership Transfer',
  createSuccessMessage: 'Ownership transfer created and assigned',
  createFormId: 'create-ownership-transfer-form',
  editDialogTitle: 'Edit Ownership Transfer',
  editSuccessMessage: 'Ownership transfer updated',
  editFormId: 'edit-ownership-transfer-form',
  deleteDialogTitle: 'Delete ownership transfer',
  deleteDialogMessage:
    'This action cannot be undone. The ownership transfer record will be permanently removed.',
  deleteSuccessMessage: 'Ownership transfer deleted',
  exportFilePrefix: 'ownership-transfers',
  useGetQuery: useGetOwnershipTransfersQuery,
  useCreateMutation: useCreateOwnershipTransferMutation,
  useUpdateMutation: useUpdateOwnershipTransferMutation,
  useUpdateStatusMutation: useUpdateOwnershipTransferStatusMutation,
  useUpdateOwnershipMutation: useUpdateOwnershipTransferOwnershipMutation,
  useDeleteMutation: useDeleteOwnershipTransferMutation,
  useExportMutation: useExportOwnershipTransfersMutation,
};

export const POTENTIAL_CLAIMS_PAGE_CONFIG: IssuesModulePageConfig = {
  title: 'Potential Claims',
  superAdminDescription: 'Create and assign potential claims to admins for ownership review',
  adminDescription: 'Review assigned potential claims and confirm ownership',
  addButtonLabel: 'Add Potential Claim',
  listTitleSuperAdmin: 'All potential claims',
  listTitleAdmin: 'Assigned to me',
  emptySuperAdmin: 'No potential claims found.',
  emptyAdmin: 'No potential claims assigned to you yet.',
  loadingMessage: 'Loading potential claims...',
  createDialogTitle: 'Add Potential Claim',
  createSuccessMessage: 'Potential claim created and assigned',
  createFormId: 'create-potential-claim-form',
  editDialogTitle: 'Edit Potential Claim',
  editSuccessMessage: 'Potential claim updated',
  editFormId: 'edit-potential-claim-form',
  deleteDialogTitle: 'Delete potential claim',
  deleteDialogMessage:
    'This action cannot be undone. The potential claim record will be permanently removed.',
  deleteSuccessMessage: 'Potential claim deleted',
  exportFilePrefix: 'potential-claims',
  useGetQuery: useGetPotentialClaimsQuery,
  useCreateMutation: useCreatePotentialClaimMutation,
  useUpdateMutation: useUpdatePotentialClaimMutation,
  useUpdateStatusMutation: useUpdatePotentialClaimStatusMutation,
  useUpdateOwnershipMutation: useUpdatePotentialClaimOwnershipMutation,
  useDeleteMutation: useDeletePotentialClaimMutation,
  useExportMutation: useExportPotentialClaimsMutation,
};

export const DISPUTED_CLAIMS_PAGE_CONFIG: IssuesModulePageConfig = {
  title: 'Disputed Claims',
  superAdminDescription: 'Create and assign disputed claims to admins for ownership review',
  adminDescription: 'Review assigned disputed claims and confirm ownership',
  addButtonLabel: 'Add Disputed Claim',
  listTitleSuperAdmin: 'All disputed claims',
  listTitleAdmin: 'Assigned to me',
  emptySuperAdmin: 'No disputed claims found.',
  emptyAdmin: 'No disputed claims assigned to you yet.',
  loadingMessage: 'Loading disputed claims...',
  createDialogTitle: 'Add Disputed Claim',
  createSuccessMessage: 'Disputed claim created and assigned',
  createFormId: 'create-disputed-claim-form',
  editDialogTitle: 'Edit Disputed Claim',
  editSuccessMessage: 'Disputed claim updated',
  editFormId: 'edit-disputed-claim-form',
  deleteDialogTitle: 'Delete disputed claim',
  deleteDialogMessage:
    'This action cannot be undone. The disputed claim record will be permanently removed.',
  deleteSuccessMessage: 'Disputed claim deleted',
  exportFilePrefix: 'disputed-claims',
  useGetQuery: useGetDisputedClaimsQuery,
  useCreateMutation: useCreateDisputedClaimMutation,
  useUpdateMutation: useUpdateDisputedClaimMutation,
  useUpdateStatusMutation: useUpdateDisputedClaimStatusMutation,
  useUpdateOwnershipMutation: useUpdateDisputedClaimOwnershipMutation,
  useDeleteMutation: useDeleteDisputedClaimMutation,
  useExportMutation: useExportDisputedClaimsMutation,
};

export const APPEALED_CLAIMS_PAGE_CONFIG: IssuesModulePageConfig = {
  title: 'Appealed Claims',
  superAdminDescription: 'Create and assign appealed claims to admins for ownership review',
  adminDescription: 'Review assigned appealed claims and confirm ownership',
  addButtonLabel: 'Add Appealed Claim',
  listTitleSuperAdmin: 'All appealed claims',
  listTitleAdmin: 'Assigned to me',
  emptySuperAdmin: 'No appealed claims found.',
  emptyAdmin: 'No appealed claims assigned to you yet.',
  loadingMessage: 'Loading appealed claims...',
  createDialogTitle: 'Add Appealed Claim',
  createSuccessMessage: 'Appealed claim created and assigned',
  createFormId: 'create-appealed-claim-form',
  editDialogTitle: 'Edit Appealed Claim',
  editSuccessMessage: 'Appealed claim updated',
  editFormId: 'edit-appealed-claim-form',
  deleteDialogTitle: 'Delete appealed claim',
  deleteDialogMessage:
    'This action cannot be undone. The appealed claim record will be permanently removed.',
  deleteSuccessMessage: 'Appealed claim deleted',
  exportFilePrefix: 'appealed-claims',
  useGetQuery: useGetAppealedClaimsQuery,
  useCreateMutation: useCreateAppealedClaimMutation,
  useUpdateMutation: useUpdateAppealedClaimMutation,
  useUpdateStatusMutation: useUpdateAppealedClaimStatusMutation,
  useUpdateOwnershipMutation: useUpdateAppealedClaimOwnershipMutation,
  useDeleteMutation: useDeleteAppealedClaimMutation,
  useExportMutation: useExportAppealedClaimsMutation,
};
