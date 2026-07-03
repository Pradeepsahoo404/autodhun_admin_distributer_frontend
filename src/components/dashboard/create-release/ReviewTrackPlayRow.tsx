'use client';

import { Pause, Play } from 'lucide-react';
import { MusicPlayingBars } from '@/components/dashboard/create-release/MusicPlayingBars';
import { cn } from '@/lib/utils';

interface ReviewTrackPlayRowProps {
  index: number;
  title: string;
  artist?: string;
  fileName?: string;
  genre?: string;
  priceLabel?: string;
  isrc?: string;
  language?: string;
  isLast?: boolean;
  canPlay: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function ReviewTrackPlayRow({
  index,
  title,
  artist,
  fileName,
  genre,
  priceLabel,
  isrc,
  language,
  isLast,
  canPlay,
  isPlaying,
  onTogglePlay,
}: ReviewTrackPlayRowProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.03] sm:px-5',
        !isLast && 'border-b border-[#141414]',
        isPlaying && 'bg-brand-lime/[0.04]',
      )}
    >
      <span className="flex w-6 shrink-0 items-center justify-center">
        {isPlaying ? (
          <MusicPlayingBars />
        ) : (
          <span className="text-center text-[13px] font-medium tabular-nums text-neutral-600 group-hover:text-brand-lime">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </span>

      <button
        type="button"
        onClick={onTogglePlay}
        disabled={!canPlay}
        aria-label={isPlaying ? `Pause track ${index + 1}` : `Play track ${index + 1}`}
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all',
          canPlay
            ? isPlaying
              ? 'bg-brand-lime text-black shadow-lg shadow-brand-lime/20'
              : 'bg-[#1a1a1a] text-white ring-1 ring-[#333] hover:bg-brand-lime hover:text-black hover:ring-brand-lime/50'
            : 'cursor-not-allowed bg-[#141414] text-neutral-600 ring-1 ring-[#222]',
        )}
      >
        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-[14px] font-semibold', isPlaying ? 'text-brand-lime' : 'text-white')}>
          {title || 'Untitled Track'}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-neutral-500">
          {[artist, genre, language].filter(Boolean).join(' · ') || fileName || 'No metadata'}
        </p>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        {priceLabel ? <span className="text-[12px] font-medium text-neutral-400">{priceLabel}</span> : null}
        {isrc ? <p className="mt-0.5 max-w-[140px] truncate text-[10px] text-neutral-600">{isrc}</p> : null}
      </div>
    </div>
  );
}
