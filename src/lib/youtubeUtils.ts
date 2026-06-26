/** Extracts a YouTube video ID from common watch, share, embed, and shorts URLs. */
export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const watchId = parsed.searchParams.get('v');
      if (watchId) return watchId;

      for (const prefix of ['/embed/', '/shorts/', '/v/', '/live/']) {
        if (parsed.pathname.startsWith(prefix)) {
          const id = parsed.pathname.slice(prefix.length).split('/')[0];
          if (id) return id;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}
