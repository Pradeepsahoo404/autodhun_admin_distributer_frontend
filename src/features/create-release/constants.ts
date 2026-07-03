export const RELEASE_WIZARD_STEPS = [
  { id: 1, label: 'Set Up Your Release', shortLabel: 'Release Info' },
  { id: 2, label: 'Upload Tracks', shortLabel: 'Upload' },
  { id: 3, label: 'Track Details', shortLabel: 'Details' },
  { id: 4, label: 'CRBT', shortLabel: 'CRBT' },
  { id: 5, label: 'Schedule Your Release', shortLabel: 'Schedule' },
  { id: 6, label: 'Final Review', shortLabel: 'Review' },
] as const;

export const RELEASE_TYPE_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'ep', label: 'EP' },
  { value: 'album', label: 'Album' },
] as const;

export const ISRC_OPTIONS = [
  { value: 'own', label: 'I will use my own ISRC' },
  { value: 'generate', label: 'Generate an ISRC for this release' },
] as const;

export const PRICE_TIER_OPTIONS = [
  { value: 'budget', label: 'Budget' },
  { value: 'back', label: 'Back' },
  { value: 'mid', label: 'Mid' },
  { value: 'front', label: 'Front' },
  { value: 'premium', label: 'Premium' },
] as const;

export const RELEASE_PLATFORM_OPTIONS = [
  { value: 'all-excluding-youtube', label: 'All Platform excluding Youtube' },
  { value: 'all-including-youtube', label: 'All Platforms including Youtube' },
  { value: 'only-youtube', label: 'Only Youtube' },
  { value: 'only-meta-audio', label: 'Only Meta Audio' },
] as const;

export const COVER_ART_MAX_SIZE_MB = 10;
export const COVER_ART_DIMENSION = 3000;

/** Shared upload drop-zone height (audio + cover art). */
export const RELEASE_UPLOAD_ZONE_HEIGHT = 180;
