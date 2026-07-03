'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MusicPlayingBars } from '@/components/dashboard/create-release/MusicPlayingBars';

interface ReleaseDetailAudioPlayerProps {
  audioUrl?: string;
  trackTitle: string;
  size?: 'md' | 'lg';
  variant?: 'default' | 'overlay';
  className?: string;
  onPlayingChange?: (playing: boolean) => void;
}

export function ReleaseDetailAudioPlayer({
  audioUrl,
  trackTitle,
  size = 'lg',
  variant = 'default',
  className,
  onPlayingChange,
}: ReleaseDetailAudioPlayerProps) {
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
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  useEffect(() => {
    return () => stopPlayback();
  }, [stopPlayback]);

  useEffect(() => {
    stopPlayback();
  }, [audioUrl, stopPlayback]);

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

    void audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const buttonSize = size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  if (variant === 'overlay') {
    return (
      <button
        type="button"
        onClick={togglePlay}
        disabled={!canPlay}
        aria-label={isPlaying ? `Pause ${trackTitle}` : `Play ${trackTitle}`}
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-xl transition-all',
          canPlay
            ? 'bg-black/25 hover:bg-black/40'
            : 'cursor-not-allowed bg-black/50',
          isPlaying && 'bg-black/45',
          className,
        )}
      >
        <span
          className={cn(
            'flex items-center justify-center rounded-full shadow-lg transition-all',
            size === 'lg' ? 'h-16 w-16' : 'h-12 w-12',
            canPlay
              ? isPlaying
                ? 'bg-brand-lime text-black shadow-brand-lime/30'
                : 'bg-white/95 text-black ring-2 ring-white/50 hover:scale-105'
              : 'bg-[#222] text-neutral-600',
          )}
        >
          {isPlaying ? (
            <Pause className={cn(size === 'lg' ? 'h-6 w-6' : 'h-5 w-5', 'fill-current')} />
          ) : (
            <Play className={cn(size === 'lg' ? 'h-6 w-6' : 'h-5 w-5', 'ml-0.5 fill-current')} />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={togglePlay}
      disabled={!canPlay}
      aria-label={isPlaying ? `Pause ${trackTitle}` : `Play ${trackTitle}`}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full transition-all',
        buttonSize,
        canPlay
          ? isPlaying
            ? 'bg-brand-lime text-black shadow-lg shadow-brand-lime/25'
            : 'bg-[#1a1a1a] text-white ring-1 ring-[#333] hover:bg-brand-lime hover:text-black hover:ring-brand-lime/50'
          : 'cursor-not-allowed bg-[#141414] text-neutral-600 ring-1 ring-[#222]',
        className,
      )}
    >
      {isPlaying ? (
        <Pause className={cn(iconSize, 'fill-current')} />
      ) : (
        <Play className={cn(iconSize, 'ml-0.5 fill-current')} />
      )}
    </button>
  );
}

export function ReleaseDetailPlayingIndicator({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-brand-lime', className)}>
      <MusicPlayingBars className="h-5 w-8" />
      <span className="text-[11px] font-semibold uppercase tracking-wider">Now playing</span>
    </span>
  );
}
