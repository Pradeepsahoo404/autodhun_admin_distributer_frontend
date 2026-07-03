const ARTISTS_KEY = 'autodhun_release_artists';
const LABELS_KEY = 'autodhun_release_labels';

const SEED_ARTISTS = [
  'Arijit Singh',
  'Neha Kakkar',
  'Badshah',
  'Shreya Ghoshal',
  'Armaan Malik',
  'Diljit Dosanjh',
];

const SEED_LABELS = [
  'T-Series',
  'Sony Music India',
  'Zee Music Company',
  'Saregama',
  'Tips Music',
  'YRF Music',
];

function readStore(key: string, seed: string[]): string[] {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem(key);
    const stored = raw ? (JSON.parse(raw) as string[]) : [];
    return [...new Set([...seed, ...stored])].sort((a, b) => a.localeCompare(b));
  } catch {
    return seed;
  }
}

function writeStore(key: string, values: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify([...new Set(values)].sort((a, b) => a.localeCompare(b))));
  } catch {
    // ignore quota errors
  }
}

export function getArtistOptions(): string[] {
  return readStore(ARTISTS_KEY, SEED_ARTISTS);
}

export function getLabelOptions(): string[] {
  return readStore(LABELS_KEY, SEED_LABELS);
}

export function persistArtist(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  writeStore(ARTISTS_KEY, [...getArtistOptions(), trimmed]);
}

export function persistLabel(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  writeStore(LABELS_KEY, [...getLabelOptions(), trimmed]);
}
