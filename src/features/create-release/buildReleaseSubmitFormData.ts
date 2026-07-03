import type { CreateReleaseFormData } from './types';

/** Builds multipart FormData for POST /music-releases or PUT /music-releases/:id */
export function buildReleaseSubmitFormData(data: CreateReleaseFormData): FormData {
  const formData = new FormData();

  const payload = {
    title: data.title,
    version: data.version,
    artist: data.artist,
    releaseType: data.releaseType,
    releasingDate: data.releasingDate,
    label: data.label,
    instrumental: data.instrumental,
    explicit: data.explicit,
    aiGenerated: data.aiGenerated,
    upc: data.upc,
    pLine: data.pLine,
    cLine: data.cLine,
    tracks: data.tracks,
    crbtEntries: data.crbtEntries,
    scheduledReleaseDate: data.scheduledReleaseDate,
    scheduleNotes: data.scheduleNotes,
    releasePlatform: data.releasePlatform,
    termsAccepted: data.termsAccepted,
  };

  formData.append('data', JSON.stringify(payload));

  if (data.coverArt) {
    formData.append('coverArt', data.coverArt);
  }

  data.audioFiles
    .filter((entry) => entry.file)
    .forEach((entry) => {
      formData.append('audioFiles', entry.file!);
    });

  return formData;
}
