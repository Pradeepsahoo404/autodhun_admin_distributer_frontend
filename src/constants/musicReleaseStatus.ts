export const MUSIC_RELEASE_STATUS = {
  IN_REVIEW: 'in_review',
  CORRECTION: 'correction',
  QC_APPROVAL: 'qc_approval',
  LIVE: 'live',
} as const;

export type MusicReleaseStatus = (typeof MUSIC_RELEASE_STATUS)[keyof typeof MUSIC_RELEASE_STATUS];

export const MUSIC_RELEASE_LIST_CONTEXT = {
  ASSETS: 'assets',
  ASSETS_OVERVIEW: 'assets-overview',
  CORRECTION: 'correction',
  CONTENT_DELIVERY: 'content-delivery',
} as const;

export type MusicReleaseListContext =
  (typeof MUSIC_RELEASE_LIST_CONTEXT)[keyof typeof MUSIC_RELEASE_LIST_CONTEXT];

export const MUSIC_RELEASE_STATUS_LABELS: Record<MusicReleaseStatus, string> = {
  in_review: 'In Review',
  correction: 'Correction',
  qc_approval: 'QC Approval',
  live: 'Live',
};

export const MUSIC_RELEASE_STATUS_OPTIONS = Object.entries(MUSIC_RELEASE_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const SUPER_ADMIN_ONLY_STATUSES: MusicReleaseStatus[] = [
  MUSIC_RELEASE_STATUS.QC_APPROVAL,
  MUSIC_RELEASE_STATUS.LIVE,
];

export const MUSIC_RELEASE_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...MUSIC_RELEASE_STATUS_OPTIONS,
] as const;

/** Content Delivery — in-review pipeline only (excludes QC Approval & Live). */
export const CONTENT_DELIVERY_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: MUSIC_RELEASE_STATUS.IN_REVIEW, label: MUSIC_RELEASE_STATUS_LABELS.in_review },
  { value: MUSIC_RELEASE_STATUS.CORRECTION, label: MUSIC_RELEASE_STATUS_LABELS.correction },
] as const;

/** Assets > Overview — approved and live catalog for Super Admin. */
export const ASSETS_OVERVIEW_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: MUSIC_RELEASE_STATUS.QC_APPROVAL, label: MUSIC_RELEASE_STATUS_LABELS.qc_approval },
  { value: MUSIC_RELEASE_STATUS.LIVE, label: MUSIC_RELEASE_STATUS_LABELS.live },
] as const;

/** Status filter for admin Assets list (excludes Correction — separate page). */
export const ASSETS_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: MUSIC_RELEASE_STATUS.IN_REVIEW, label: MUSIC_RELEASE_STATUS_LABELS.in_review },
  { value: MUSIC_RELEASE_STATUS.QC_APPROVAL, label: MUSIC_RELEASE_STATUS_LABELS.qc_approval },
  { value: MUSIC_RELEASE_STATUS.LIVE, label: MUSIC_RELEASE_STATUS_LABELS.live },
] as const;

/** Super Admin status dropdown on Content Delivery rows. */
export const CONTENT_DELIVERY_STATUS_SELECT_OPTIONS = [
  { value: MUSIC_RELEASE_STATUS.IN_REVIEW, label: MUSIC_RELEASE_STATUS_LABELS.in_review },
  { value: MUSIC_RELEASE_STATUS.CORRECTION, label: MUSIC_RELEASE_STATUS_LABELS.correction },
  { value: MUSIC_RELEASE_STATUS.QC_APPROVAL, label: MUSIC_RELEASE_STATUS_LABELS.qc_approval },
  { value: MUSIC_RELEASE_STATUS.LIVE, label: MUSIC_RELEASE_STATUS_LABELS.live },
] as const;

/** Super Admin status dropdown on Assets Overview rows (QC Approval → Live). */
export const ASSETS_OVERVIEW_STATUS_SELECT_OPTIONS = [
  { value: MUSIC_RELEASE_STATUS.QC_APPROVAL, label: MUSIC_RELEASE_STATUS_LABELS.qc_approval },
  { value: MUSIC_RELEASE_STATUS.LIVE, label: MUSIC_RELEASE_STATUS_LABELS.live },
] as const;
