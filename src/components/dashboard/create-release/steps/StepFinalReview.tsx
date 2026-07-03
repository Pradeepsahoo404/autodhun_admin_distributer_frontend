'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Calendar,
  Clock,
  Disc3,
  Globe,
  Mic2,
  Music2,
  Radio,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { TableSelectField } from '@/components/common/TableSelectField';
import { ReviewTrackPlayRow } from '@/components/dashboard/create-release/ReviewTrackPlayRow';
import {
  ReviewBadge,
  ReviewCard,
  ReviewField,
  ReviewGrid,
} from '@/components/dashboard/create-release/ReleaseReviewComponents';
import {
  ISRC_OPTIONS,
  PRICE_TIER_OPTIONS,
  RELEASE_PLATFORM_OPTIONS,
  RELEASE_TYPE_OPTIONS,
} from '@/features/create-release/constants';
import { formatDisplayDate, parseApiDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import type { CreateReleaseFormData } from '@/features/create-release/types';

function formatTime12(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return value || '—';
  const h24 = Number(match[1]);
  const m = match[2];
  const period = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${m} ${period}`;
}

export function StepFinalReview() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReleaseFormData>();

  const data = watch();
  const releaseTypeLabel = RELEASE_TYPE_OPTIONS.find((o) => o.value === data.releaseType)?.label;
  const releasingDate = data.releasingDate ? formatDisplayDate(parseApiDate(data.releasingDate)!) : '';
  const scheduledDate = data.scheduledReleaseDate
    ? formatDisplayDate(parseApiDate(data.scheduledReleaseDate)!)
    : '';
  const audioFiles = data.audioFiles.filter((f) => f.file);
  const audioCount = audioFiles.length;
  const displayTitle = data.title || 'Untitled Release';
  const displayArtist = data.artist || 'Unknown Artist';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const stopPlayback = useCallback(() => {
    audioRef.current?.pause();
    setPlayingIndex(null);
  }, []);

  const toggleTrackPlay = useCallback(
    (index: number, file: File | null) => {
      if (!file) return;

      if (playingIndex === index) {
        stopPlayback();
        return;
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setPlayingIndex(null);
      }

      audioRef.current.src = url;
      void audioRef.current.play();
      setPlayingIndex(index);
    },
    [playingIndex, stopPlayback],
  );

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 p-5 sm:p-8">
      {/* Release hero — streaming-style header */}
      <section className="relative overflow-hidden rounded-2xl border border-[#1f1f1f]">
        {data.coverArtPreview ? (
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-3xl"
            style={{ backgroundImage: `url(${data.coverArtPreview})` }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/5 via-transparent to-transparent" aria-hidden />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/40" aria-hidden />

        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:gap-8 sm:p-8">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            {data.coverArtPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.coverArtPreview}
                alt="Cover art"
                className="h-44 w-44 rounded-xl object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:h-52 sm:w-52"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-xl border border-dashed border-[#333] bg-[#111] shadow-2xl sm:h-52 sm:w-52">
                <Disc3 className="h-14 w-14 text-neutral-700" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:pb-1 sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-lime">
              {releaseTypeLabel || 'Release'}
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-tight text-white sm:text-[36px]">
              {displayTitle}
              {data.version ? (
                <span className="ml-2 text-[20px] font-medium text-neutral-500 sm:text-[24px]">
                  ({data.version})
                </span>
              ) : null}
            </h2>
            <p className="mt-2 text-[16px] font-medium text-neutral-300 sm:text-[18px]">{displayArtist}</p>
            {data.label ? (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-[13px] text-neutral-500 sm:justify-start">
                <Tag className="h-3.5 w-3.5" />
                {data.label}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {releasingDate ? <ReviewBadge variant="outline">{releasingDate}</ReviewBadge> : null}
              {audioCount > 0 ? (
                <ReviewBadge variant="outline">
                  {audioCount} {audioCount === 1 ? 'Track' : 'Tracks'}
                </ReviewBadge>
              ) : null}
              {data.explicit === 'yes' ? <ReviewBadge variant="warning">Explicit</ReviewBadge> : null}
              {data.instrumental === 'yes' ? <ReviewBadge variant="lime">Instrumental</ReviewBadge> : null}
              {data.aiGenerated === 'yes' ? <ReviewBadge variant="outline">AI Generated</ReviewBadge> : null}
            </div>
          </div>
        </div>
      </section>

      {/* Tracklist */}
      {audioCount > 0 ? (
        <ReviewCard
          title="Tracklist"
          description={`${audioCount} track${audioCount !== 1 ? 's' : ''} on this release`}
          icon={<Music2 className="h-4 w-4" />}
          flushBody
        >
          <div className="rounded-b-2xl bg-[#080808]">
            {audioFiles.map((file, i) => {
              const track = data.tracks[i];
              const priceLabel = track
                ? PRICE_TIER_OPTIONS.find((o) => o.value === track.price)?.label
                : undefined;
              const isrc =
                track?.isrcOption === 'own'
                  ? track.isrc
                  : ISRC_OPTIONS.find((o) => o.value === track?.isrcOption)?.label;
              return (
                <ReviewTrackPlayRow
                  key={`track-row-${i}`}
                  index={i}
                  title={track?.title || file.fileName}
                  artist={track?.artist || data.artist}
                  fileName={file.fileName}
                  genre={track?.genre}
                  language={track?.language}
                  priceLabel={priceLabel}
                  isrc={isrc}
                  isLast={i === audioCount - 1}
                  canPlay={Boolean(file.file)}
                  isPlaying={playingIndex === i}
                  onTogglePlay={() => toggleTrackPlay(i, file.file)}
                />
              );
            })}
          </div>
        </ReviewCard>
      ) : null}

      {/* Track metadata cards */}
      {data.tracks.some((t) => t.title || t.artist || t.genre) ? (
        <ReviewCard title="Track Metadata" icon={<Mic2 className="h-4 w-4" />}>
          <div className="space-y-4">
            {data.tracks.map((track, i) => {
              if (!track.title && !track.artist && !track.genre) return null;
              const priceLabel = PRICE_TIER_OPTIONS.find((o) => o.value === track.price)?.label;
              const isrcLabel =
                track.isrcOption === 'own'
                  ? track.isrc
                  : ISRC_OPTIONS.find((o) => o.value === track.isrcOption)?.label;
              return (
                <div
                  key={`track-meta-${i}`}
                  className="rounded-xl border border-[#1a1a1a] bg-[#111]/50 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-lime/10 text-[11px] font-bold text-brand-lime">
                      {i + 1}
                    </span>
                    <p className="text-[14px] font-semibold text-white">{track.title || `Track ${i + 1}`}</p>
                  </div>
                  <ReviewGrid cols={3}>
                    <ReviewField label="Artist" value={track.artist} />
                    <ReviewField label="ISRC" value={isrcLabel} />
                    <ReviewField label="Price Tier" value={priceLabel} />
                    <ReviewField label="Composer" value={track.composer} />
                    <ReviewField label="Producer" value={track.producer} />
                    <ReviewField label="Director" value={track.director} />
                    <ReviewField label="Language" value={track.language} />
                    <ReviewField label="Genre" value={track.genre} />
                    <ReviewField label="Sub Genre" value={track.subGenre} />
                  </ReviewGrid>
                  {track.lyrics ? (
                    <div className="mt-4 rounded-lg bg-[#0a0a0a] p-3">
                      <ReviewField label="Lyrics" value={track.lyrics} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </ReviewCard>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <ReviewCard title="Release Details" icon={<Disc3 className="h-4 w-4" />}>
          <ReviewGrid cols={2}>
            <ReviewField label="Release Type" value={releaseTypeLabel} />
            <ReviewField label="Releasing Date" value={releasingDate} />
            <ReviewField label="UPC" value={data.upc} />
            <ReviewField label="P Line" value={data.pLine} />
            <ReviewField label="C Line" value={data.cLine} />
          </ReviewGrid>
        </ReviewCard>

        <ReviewCard title="Distribution Schedule" icon={<Calendar className="h-4 w-4" />}>
          <ReviewGrid cols={2}>
            <ReviewField label="Releasing Date (Step 1)" value={releasingDate} />
            <ReviewField label="Scheduled Go-Live" value={scheduledDate} />
          </ReviewGrid>
          {data.scheduleNotes ? (
            <div className="mt-4 rounded-lg border border-[#1a1a1a] bg-[#111]/50 p-3">
              <ReviewField label="Schedule Notes" value={data.scheduleNotes} />
            </div>
          ) : null}
        </ReviewCard>
      </div>

      {data.crbtEntries.some((e) => e.title || e.startTime) ? (
        <ReviewCard title="CRBT" description="Caller ringback tone configuration" icon={<Radio className="h-4 w-4" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.crbtEntries.map((entry, i) => (
              <div
                key={`review-crbt-${i}`}
                className="flex items-center gap-4 rounded-xl border border-[#1a1a1a] bg-gradient-to-br from-[#111] to-[#0d0d0d] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-lime/10 ring-1 ring-brand-lime/20">
                  <Radio className="h-5 w-5 text-brand-lime" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-white">
                    {entry.title || `CRBT ${i + 1}`}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] text-neutral-500">
                    <Clock className="h-3 w-3" />
                    Starts at {formatTime12(entry.startTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ReviewCard>
      ) : null}

      <ReviewCard title="Release Platform" icon={<Globe className="h-4 w-4" />}>
        <p className="mb-3 text-[13px] text-neutral-500">Choose where this release will be distributed.</p>
        <TableSelectField
          value={data.releasePlatform}
          onChange={(v) =>
            setValue('releasePlatform', v as CreateReleaseFormData['releasePlatform'], { shouldDirty: true })
          }
          options={RELEASE_PLATFORM_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          className="w-full"
          aria-label="Release platform"
        />
      </ReviewCard>

      <div
        className={cn(
          'rounded-2xl border p-5 transition-colors sm:p-6',
          data.termsAccepted ? 'border-brand-lime/30 bg-brand-lime/5' : 'border-[#1f1f1f] bg-[#0d0d0d]',
        )}
      >
        <div className="mb-3 flex items-center gap-2 text-brand-lime">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[13px] font-semibold uppercase tracking-wide">Ready to Submit</span>
        </div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-[#333] bg-[#111] accent-brand-lime"
            checked={data.termsAccepted}
            onChange={(e) => setValue('termsAccepted', e.target.checked, { shouldDirty: true })}
          />
          <span className="text-[14px] leading-relaxed text-neutral-300">
            I confirm all release information is correct and agree to the{' '}
            <button type="button" className="font-medium text-brand-lime underline-offset-2 hover:underline">
              terms and conditions
            </button>
          </span>
        </label>
        {errors.termsAccepted ? (
          <p className="mt-2 text-xs text-red-400">{errors.termsAccepted.message}</p>
        ) : null}
      </div>
    </div>
  );
}
