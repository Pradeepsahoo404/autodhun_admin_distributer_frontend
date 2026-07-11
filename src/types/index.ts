export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface UserProfile {
  postalAddress?: string;
  state?: string;
  countryRegion?: string;
  phoneNumber?: string;
  labelName?: string;
}

export interface UserBankDetails {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  swiftCode?: string;
  micrCode?: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  termsAccepted?: boolean;
  status: string;
  provider: string;
  profileCompleted?: boolean;
  avatarUrl?: string;
  profile: UserProfile;
  bankDetails: UserBankDetails;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface PendingOtpResult {
  email: string;
  purpose: string;
  resendAfter: number;
  message: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export type LoginResult = PendingOtpResult | AuthSession;

export interface ModulePermission {
  moduleId: string;
  name: string;
  slug: string;
  route: string;
  icon: string;
  order: number;
  isPro: boolean;
  group: string;
  parentSlug?: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface DashboardCard {
  key: string;
  title: string;
  description: string;
  badge?: string;
  variant: 'feature' | 'popular' | 'new-feature' | 'earnings' | 'link' | 'sync';
  cta?: { label: string; action: string; moduleSlug: string };
  secondaryCta?: { label: string };
}

export interface DashboardQuickAction {
  key: string;
  label: string;
  icon: string;
}

export type LegalModuleStatus = 'in_progress' | 'active' | 'inactive';

export interface RightsManagerModuleStats {
  slug: string;
  name: string;
  route: string;
  icon: string;
  total: number;
  active: number;
  inactive: number;
  inProgress: number;
  last7Days: number;
  last30Days: number;
}

export interface RightsManagerAnalyticsSummary {
  total: number;
  active: number;
  inactive: number;
  inProgress: number;
  last7Days: number;
  last30Days: number;
}

export interface RightsManagerAnalytics {
  isSuperAdmin: boolean;
  scopeLabel: string;
  summary: RightsManagerAnalyticsSummary;
  modules: RightsManagerModuleStats[];
  dailyTrend7: number[];
  dailyTrend30: number[];
}

export interface IssuesModuleStats {
  slug: string;
  name: string;
  route: string;
  icon: string;
  total: number;
  active: number;
  inactive: number;
  ownershipPending: number;
  last7Days: number;
  last30Days: number;
}

export interface IssuesAnalyticsSummary {
  total: number;
  active: number;
  inactive: number;
  ownershipPending: number;
  last7Days: number;
  last30Days: number;
}

export interface IssuesAnalytics {
  isSuperAdmin: boolean;
  scopeLabel: string;
  summary: IssuesAnalyticsSummary;
  modules: IssuesModuleStats[];
  dailyTrend7: number[];
  dailyTrend30: number[];
}

export interface ReleaseStatusCount {
  status: string;
  label: string;
  count: number;
}

export interface ReleaseAnalytics {
  variant: 'admin' | 'content-delivery';
  scopeLabel: string;
  total: number;
  counts: ReleaseStatusCount[];
}

export interface ReleaseAnalyticsBundle {
  admin: ReleaseAnalytics | null;
  contentDelivery: ReleaseAnalytics | null;
}

export interface DashboardData {
  earnings: number;
  currency: string;
  cards: DashboardCard[];
  quickActions: DashboardQuickAction[];
  modules: ModulePermission[];
  permissions: Record<string, { canView: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean }>;
  rightsManagerAnalytics: RightsManagerAnalytics | null;
  issuesAnalytics: IssuesAnalytics | null;
  releaseAnalytics: ReleaseAnalyticsBundle;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MusicReleaseTrack {
  title: string;
  artist: string;
  lyrics: string;
  isrcOption: 'own' | 'generate';
  isrc: string;
  composer: string;
  producer: string;
  director: string;
  language: string;
  genre: string;
  subGenre: string;
  price: string;
}

export interface MusicReleaseAudioFile {
  fileName: string;
  url: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface MusicRelease {
  _id: string;
  title: string;
  version: string;
  artist: string;
  releaseType: 'single' | 'ep' | 'album';
  releasingDate: string;
  label: string;
  instrumental: 'yes' | 'no';
  explicit: 'yes' | 'no';
  aiGenerated: 'yes' | 'no';
  upc: string;
  pLine: string;
  cLine: string;
  coverArtUrl: string;
  audioFiles: MusicReleaseAudioFile[];
  tracks: MusicReleaseTrack[];
  crbtEntries: { title: string; startTime: string }[];
  scheduledReleaseDate: string;
  scheduleNotes: string;
  releasePlatform: string;
  status: 'in_review' | 'takedown' | 'correction' | 'qc_approval' | 'live';
  correctionReasons?: string[];
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: { _id: string; name: string; slug: string };
  status: string;
  emailVerified: boolean;
  termsAccepted?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  provider?: string;
  avatarUrl?: string;
  profile?: UserProfile;
  bankDetails?: UserBankDetails;
}

export interface AdminCreationStats {
  total: number;
  last7Days: number;
  last30Days: number;
  last90Days: number;
  last365Days: number;
}

export interface Role {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  isSystem: boolean;
}

export interface Module {
  _id: string;
  name: string;
  slug: string;
  route: string;
  icon: string;
  order: number;
  isActive: boolean;
  isPro: boolean;
  group: string;
  parentSlug?: string;
}

export interface Permission {
  _id: string;
  roleId: string;
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface EffectivePermission {
  moduleId: string;
  name: string;
  slug: string;
  parentSlug?: string;
  group: string;
  order: number;
  isRoot: boolean;
  inheritedFrom?: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface YoutubeClaimRelease {
  _id: string;
  senderLabelName: string;
  receiverLabelName: string;
  youtubeLink: string;
  isrcCode: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  _id: string;
  channelName: string;
  channelLink: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ChannelLinking {
  _id: string;
  channelLink: string;
  channelName: string;
  totalRevenue90Days: number;
  totalViews90Days: number;
  status: 'in_process' | 'approved' | 'rejected';
  autoRejectAt?: string | null;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface FacebookClaimRelease {
  _id: string;
  senderLabelName: string;
  receiverLabelName: string;
  facebookPageLink: string;
  isrcCode: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ContentId {
  _id: string;
  labelName: string;
  isrcCode: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Oac {
  _id: string;
  artistChannelName: string;
  artistChannelLink: string;
  artistChannelTopicLink: string;
  isrcCode: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ProfileLinking {
  _id: string;
  labelName: string;
  isrcCode: string;
  facebookPageLink: string;
  instagramHandleName: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Allowlist {
  _id: string;
  labelName: string;
  channelLink: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ManualClaiming {
  _id: string;
  labelName: string;
  originalSongLink: string;
  isrcCode: string;
  songLink: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Takedown {
  _id: string;
  labelName: string;
  isrcCode: string;
  songLink: string;
  status: LegalModuleStatus;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export type ReferenceOverlapAssetType = 'Track' | 'Album' | 'Music Video' | 'Composition' | 'Other';
export type ReferenceOverlapOwnership = '' | 'yes' | 'no';
export type ReferenceOverlapStatus = 'active' | 'inactive';

export interface ReferenceOverlap {
  _id: string;
  otherParty: string;
  assetName: string;
  assetType: ReferenceOverlapAssetType;
  isrcCode: string;
  overlappingAssetName: string;
  labelName: string;
  status: ReferenceOverlapStatus;
  ownership: ReferenceOverlapOwnership;
  assignedTo?: { _id: string; name: string; email: string };
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

/** Shared shape for Issues modules with Super Admin assign / Admin ownership flow. */
export type IssuesAssignedEntry = ReferenceOverlap;

export type NotificationType =
  | 'rights_entry_created'
  | 'rights_status_updated'
  | 'issues_entry_assigned'
  | 'issues_ownership_updated'
  | 'release_created'
  | 'release_updated'
  | 'release_status_updated'
  | 'label_transferred'
  | 'channel_entry_created'
  | 'channel_status_updated';

export interface Notification {
  _id: string;
  type: NotificationType;
  moduleSlug: string;
  moduleName: string;
  entryId: string;
  route: string;
  title: string;
  message: string;
  entrySummary: Record<string, string>;
  actor?: { _id: string; name: string; email: string };
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
