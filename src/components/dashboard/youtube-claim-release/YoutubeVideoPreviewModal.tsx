'use client';

import { ExternalLink } from 'lucide-react';
import { AppModal } from '@/components/common/AppModal';
import { Button } from '@/components/ui/button';
import { getYoutubeEmbedUrl } from '@/lib/youtubeUtils';

interface YoutubeVideoPreviewModalProps {
  open: boolean;
  onClose: () => void;
  videoId: string;
  sourceUrl: string;
}

export function YoutubeVideoPreviewModal({
  open,
  onClose,
  videoId,
  sourceUrl,
}: YoutubeVideoPreviewModalProps) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="YouTube preview"
      size="lg"
      className="max-w-3xl"
      footer={
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            asChild
            className="h-10 rounded-xl border-[#2a2a2a] bg-transparent text-neutral-300 hover:bg-[#1a1a1a] hover:text-white"
          >
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open on YouTube
            </a>
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-black">
        <div className="relative aspect-video w-full">
          <iframe
            key={videoId}
            src={getYoutubeEmbedUrl(videoId)}
            title="YouTube video preview"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </AppModal>
  );
}
