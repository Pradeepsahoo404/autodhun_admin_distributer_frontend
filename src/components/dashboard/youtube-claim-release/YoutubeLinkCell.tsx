'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { getYoutubeVideoId } from '@/lib/youtubeUtils';
import { YoutubeVideoPreviewModal } from './YoutubeVideoPreviewModal';

interface YoutubeLinkCellProps {
  href: string;
}

export function YoutubeLinkCell({ href }: YoutubeLinkCellProps) {
  const [open, setOpen] = useState(false);
  const videoId = getYoutubeVideoId(href);

  if (!videoId) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-brand-lime hover:underline"
      >
        View
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-brand-lime transition-colors hover:text-brand-lime-dark hover:underline"
      >
        View
        <Play className="h-3 w-3" />
      </button>
      <YoutubeVideoPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        videoId={videoId}
        sourceUrl={href}
      />
    </>
  );
}
