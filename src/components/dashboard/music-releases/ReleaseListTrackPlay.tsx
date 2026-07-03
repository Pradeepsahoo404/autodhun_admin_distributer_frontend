'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseListTrackPlayProps {
  audioUrl?: string;
  trackTitle?: string;
  className?: string;
}

export function ReleaseListTrackPlay({ audioUrl, trackTitle, className }: ReleaseListTrackPlayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canPlay = Boolean(audioUrl);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => stopPlayback();
  }, [stopPlayback]);

  const togglePlay = () => {
    if (!audioUrl) return;

    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    } else if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    void audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
      setIsPlaying(false);
    });
  };

  return (
    <button
      type="button"
      onClick={togglePlay}
      disabled={!canPlay}
      aria-label={
        trackTitle
          ? isPlaying
            ? `Pause ${trackTitle}`
            : `Play ${trackTitle}`
          : isPlaying
            ? 'Pause track'
            : 'Play track'
      }
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all',
        canPlay
          ? isPlaying
            ? 'bg-brand-lime text-black shadow-lg shadow-brand-lime/20'
            : 'bg-[#1a1a1a] text-white ring-1 ring-[#333] hover:bg-brand-lime hover:text-black hover:ring-brand-lime/50'
          : 'cursor-not-allowed bg-[#141414] text-neutral-600 ring-1 ring-[#222]',
        className,
      )}
    >
      {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />}
    </button>
  );
}
