export type ReleaseType = 'single' | 'ep' | 'album';
export type YesNo = 'yes' | 'no';
export type IsrcOption = 'own' | 'generate';
export type PriceTier = 'budget' | 'back' | 'mid' | 'front' | 'premium';
export type ReleasePlatform =
  | 'all-excluding-youtube'
  | 'all-including-youtube'
  | 'only-youtube'
  | 'only-meta-audio';

export interface UploadedAudio {
  file: File | null;
  fileName: string;
}

export interface TrackDetails {
  title: string;
  artist: string;
  lyrics: string;
  isrcOption: IsrcOption;
  isrc: string;
  composer: string;
  producer: string;
  director: string;
  language: string;
  genre: string;
  subGenre: string;
  price: PriceTier;
}

export interface CrbtEntry {
  title: string;
  startTime: string;
}

export interface CreateReleaseFormData {
  title: string;
  version: string;
  artist: string;
  releaseType: ReleaseType;
  releasingDate: string;
  label: string;
  instrumental: YesNo;
  explicit: YesNo;
  aiGenerated: YesNo;
  upc: string;
  pLine: string;
  cLine: string;
  coverArt: File | null;
  coverArtPreview: string | null;
  audioFiles: UploadedAudio[];
  tracks: TrackDetails[];
  crbtEntries: CrbtEntry[];
  scheduledReleaseDate: string;
  scheduleNotes: string;
  releasePlatform: ReleasePlatform;
  termsAccepted: boolean;
}

export const defaultTrackDetails = (): TrackDetails => ({
  title: '',
  artist: '',
  lyrics: '',
  isrcOption: 'generate',
  isrc: '',
  composer: '',
  producer: '',
  director: '',
  language: '',
  genre: '',
  subGenre: '',
  price: 'mid',
});

export const defaultCreateReleaseFormData = (): CreateReleaseFormData => ({
  title: '',
  version: '',
  artist: '',
  releaseType: 'single',
  releasingDate: '',
  label: '',
  instrumental: 'no',
  explicit: 'no',
  aiGenerated: 'no',
  upc: '',
  pLine: '',
  cLine: '',
  coverArt: null,
  coverArtPreview: null,
  audioFiles: [{ file: null, fileName: '' }],
  tracks: [defaultTrackDetails()],
  crbtEntries: [{ title: '', startTime: '' }],
  scheduledReleaseDate: '',
  scheduleNotes: '',
  releasePlatform: 'all-excluding-youtube',
  termsAccepted: false,
});
