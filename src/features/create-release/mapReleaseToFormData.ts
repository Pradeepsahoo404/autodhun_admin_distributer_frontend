import type { MusicRelease } from '@/types';
import type { CreateReleaseFormData } from './types';

const API_ORIGIN =
  (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export function resolveReleaseMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

export function mapReleaseToFormData(release: MusicRelease): CreateReleaseFormData {
  return {
    title: release.title,
    version: release.version ?? '',
    artist: release.artist,
    releaseType: release.releaseType,
    releasingDate: release.releasingDate,
    label: release.label,
    instrumental: release.instrumental,
    explicit: release.explicit,
    aiGenerated: release.aiGenerated,
    upc: release.upc ?? '',
    pLine: release.pLine ?? '',
    cLine: release.cLine ?? '',
    coverArt: null,
    coverArtPreview: resolveReleaseMediaUrl(release.coverArtUrl),
    audioFiles: release.audioFiles.map((file) => ({
      file: null,
      fileName: file.fileName,
    })),
    tracks: release.tracks.map((track) => ({
      title: track.title,
      artist: track.artist,
      lyrics: track.lyrics ?? '',
      isrcOption: track.isrcOption,
      isrc: track.isrc ?? '',
      composer: track.composer ?? '',
      producer: track.producer ?? '',
      director: track.director ?? '',
      language: track.language ?? '',
      genre: track.genre ?? '',
      subGenre: track.subGenre ?? '',
      price: track.price as CreateReleaseFormData['tracks'][0]['price'],
    })),
    crbtEntries: release.crbtEntries.map((entry) => ({
      title: entry.title,
      startTime: entry.startTime,
    })),
    scheduledReleaseDate: release.scheduledReleaseDate,
    scheduleNotes: release.scheduleNotes ?? '',
    releasePlatform: release.releasePlatform as CreateReleaseFormData['releasePlatform'],
    termsAccepted: true,
  };
}
