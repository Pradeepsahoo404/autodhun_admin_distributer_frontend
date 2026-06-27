/** Side-effect imports register all RTK Query endpoints with baseApi. */
import './authApi';
import './dashboardApi';
import './usersApi';
import './rolesApi';
import './modulesApi';
import './permissionsApi';
import './rightsManager/youtubeClaimReleaseApi';
import './rightsManager/facebookClaimReleaseApi';
import './rightsManager/contentIdApi';
import './rightsManager/oacApi';
import './rightsManager/profileLinkingApi';
import './rightsManager/allowlistApi';
import './rightsManager/manualClaimingApi';
import './rightsManager/takedownApi';
import './notificationsApi';
import './issues/referenceOverlapsApi';
import './issues/invalidReferencesApi';
import './issues/ownershipTransfersApi';
import './issues/potentialClaimsApi';
import './issues/disputedClaimsApi';
import './issues/appealedClaimsApi';
import './cronjobSettingsApi';

export { authApi } from './authApi';
export {
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
  useLazyGetTermsStatusQuery,
  useAcceptTermsMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdateBankDetailsMutation,
} from './authApi';

export { useGetDashboardQuery } from './dashboardApi';

export {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetAdminCreationStatsQuery,
  useCreateUserMutation,
  useInviteAdminMutation,
  useResendInviteMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from './usersApi';

export {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from './rolesApi';

export {
  useGetModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} from './modulesApi';

export {
  useGetSidebarQuery,
  useGetPermissionsQuery,
  useGetPermissionMatrixQuery,
  useSetPermissionMutation,
  useBulkSetPermissionsMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from './permissionsApi';

export {
  useGetYoutubeClaimReleasesQuery,
  useCreateYoutubeClaimReleaseMutation,
  useUpdateYoutubeClaimReleaseMutation,
  useUpdateYoutubeClaimReleaseStatusMutation,
  useDeleteYoutubeClaimReleaseMutation,
  useExportYoutubeClaimReleasesMutation,
} from './rightsManager/youtubeClaimReleaseApi';

export {
  useGetFacebookClaimReleasesQuery,
  useCreateFacebookClaimReleaseMutation,
  useUpdateFacebookClaimReleaseMutation,
  useUpdateFacebookClaimReleaseStatusMutation,
  useDeleteFacebookClaimReleaseMutation,
  useExportFacebookClaimReleasesMutation,
} from './rightsManager/facebookClaimReleaseApi';

export {
  useGetContentIdsQuery,
  useCreateContentIdMutation,
  useUpdateContentIdMutation,
  useUpdateContentIdStatusMutation,
  useDeleteContentIdMutation,
  useExportContentIdsMutation,
} from './rightsManager/contentIdApi';

export {
  useGetOacEntriesQuery,
  useCreateOacEntryMutation,
  useUpdateOacEntryMutation,
  useUpdateOacEntryStatusMutation,
  useDeleteOacEntryMutation,
  useExportOacEntriesMutation,
} from './rightsManager/oacApi';

export {
  useGetProfileLinkingEntriesQuery,
  useCreateProfileLinkingEntryMutation,
  useUpdateProfileLinkingEntryMutation,
  useUpdateProfileLinkingEntryStatusMutation,
  useDeleteProfileLinkingEntryMutation,
  useExportProfileLinkingEntriesMutation,
} from './rightsManager/profileLinkingApi';

export {
  useGetAllowlistEntriesQuery,
  useCreateAllowlistEntryMutation,
  useUpdateAllowlistEntryMutation,
  useUpdateAllowlistEntryStatusMutation,
  useDeleteAllowlistEntryMutation,
  useExportAllowlistEntriesMutation,
} from './rightsManager/allowlistApi';

export {
  useGetManualClaimingEntriesQuery,
  useCreateManualClaimingEntryMutation,
  useUpdateManualClaimingEntryMutation,
  useUpdateManualClaimingEntryStatusMutation,
  useDeleteManualClaimingEntryMutation,
  useExportManualClaimingEntriesMutation,
} from './rightsManager/manualClaimingApi';

export {
  useGetTakedownEntriesQuery,
  useCreateTakedownEntryMutation,
  useUpdateTakedownEntryMutation,
  useUpdateTakedownEntryStatusMutation,
  useDeleteTakedownEntryMutation,
  useExportTakedownEntriesMutation,
} from './rightsManager/takedownApi';

export {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from './notificationsApi';

export {
  useGetReferenceOverlapsQuery,
  useCreateReferenceOverlapMutation,
  useUpdateReferenceOverlapMutation,
  useUpdateReferenceOverlapStatusMutation,
  useUpdateReferenceOverlapOwnershipMutation,
  useDeleteReferenceOverlapMutation,
  useExportReferenceOverlapsMutation,
} from './issues/referenceOverlapsApi';

export {
  useGetInvalidReferencesQuery,
  useCreateInvalidReferenceMutation,
  useUpdateInvalidReferenceMutation,
  useUpdateInvalidReferenceStatusMutation,
  useUpdateInvalidReferenceOwnershipMutation,
  useDeleteInvalidReferenceMutation,
  useExportInvalidReferencesMutation,
} from './issues/invalidReferencesApi';

export {
  useGetOwnershipTransfersQuery,
  useCreateOwnershipTransferMutation,
  useUpdateOwnershipTransferMutation,
  useUpdateOwnershipTransferStatusMutation,
  useUpdateOwnershipTransferOwnershipMutation,
  useDeleteOwnershipTransferMutation,
  useExportOwnershipTransfersMutation,
} from './issues/ownershipTransfersApi';

export {
  useGetPotentialClaimsQuery,
  useCreatePotentialClaimMutation,
  useUpdatePotentialClaimMutation,
  useUpdatePotentialClaimStatusMutation,
  useUpdatePotentialClaimOwnershipMutation,
  useDeletePotentialClaimMutation,
  useExportPotentialClaimsMutation,
} from './issues/potentialClaimsApi';

export {
  useGetDisputedClaimsQuery,
  useCreateDisputedClaimMutation,
  useUpdateDisputedClaimMutation,
  useUpdateDisputedClaimStatusMutation,
  useUpdateDisputedClaimOwnershipMutation,
  useDeleteDisputedClaimMutation,
  useExportDisputedClaimsMutation,
} from './issues/disputedClaimsApi';

export {
  useGetAppealedClaimsQuery,
  useCreateAppealedClaimMutation,
  useUpdateAppealedClaimMutation,
  useUpdateAppealedClaimStatusMutation,
  useUpdateAppealedClaimOwnershipMutation,
  useDeleteAppealedClaimMutation,
  useExportAppealedClaimsMutation,
} from './issues/appealedClaimsApi';

export {
  useGetCronjobSettingsQuery,
  useUpdateCronjobSettingsMutation,
  useRunCronjobNowMutation,
} from './cronjobSettingsApi';
