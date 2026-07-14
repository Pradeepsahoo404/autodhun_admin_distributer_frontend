function extensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)(?:$|\?)/);
    return match?.[1]?.toLowerCase() ?? '';
  } catch {
    return '';
  }
}

function withFilenameExtension(fileName: string, url: string, fallbackExt: string): string {
  if (/\.[a-zA-Z0-9]+$/.test(fileName)) return fileName;
  const ext = extensionFromUrl(url) || fallbackExt;
  return ext ? `${fileName}.${ext}` : fileName;
}

/** Forces browser download for same-origin and CORS-enabled media (e.g. Cloudinary). */
export async function downloadMediaFile(url: string, fileName: string): Promise<void> {
  if (!url) throw new Error('File URL is missing');

  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export function buildCoverDownloadName(title: string, coverUrl: string): string {
  const safeTitle = title.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '-') || 'cover';
  return withFilenameExtension(`${safeTitle}-cover`, coverUrl, 'jpg');
}

export function buildAudioDownloadName(fileName: string | undefined, audioUrl: string, title: string): string {
  const base =
    fileName?.trim() ||
    `${(title.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '-') || 'track')}.wav`;
  return withFilenameExtension(base, audioUrl, 'wav');
}
