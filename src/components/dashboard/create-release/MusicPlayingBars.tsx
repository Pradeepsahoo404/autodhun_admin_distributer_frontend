import { cn } from '@/lib/utils';

interface MusicPlayingBarsProps {
  className?: string;
}

/** Animated equalizer bars — shown while a track is playing. */
export function MusicPlayingBars({ className }: MusicPlayingBarsProps) {
  const delays = ['0s', '0.15s', '0.3s', '0.1s'];

  return (
    <span
      className={cn('flex h-4 w-6 items-end justify-center gap-[3px]', className)}
      aria-hidden
    >
      {delays.map((delay, i) => (
        <span
          key={`bar-${i}`}
          className="music-playing-bar w-[3px] rounded-full bg-brand-lime"
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}
