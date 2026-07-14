'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  ReleaseDetailAudioPlayer,
  ReleaseDetailPlayingIndicator,
} from '@/components/dashboard/music-releases/ReleaseDetailAudioPlayer';
import { ReleaseDetailRow } from '@/components/dashboard/music-releases/ReleaseDetailRow';
import { ReleaseStatusBadge } from '@/components/dashboard/music-releases/ReleaseStatusBadge';
import { AdminBadge } from '@/components/common/AdminBadge';
import { Button } from '@/components/ui/button';
import { resolveReleaseMediaUrl } from '@/features/create-release/mapReleaseToFormData';
import {
  displayDetailValue,
  formatApiDateDetail,
  formatGenreDetail,
  formatImportDateDetail,
  formatIsrcDetail,
  formatPriceTierDetail,
  formatReleasePlatformDetail,
  formatReleaseTypeLabel,
  formatYesNoDetail,
} from '@/features/create-release/releaseDetailUtils';
import {
  buildAudioDownloadName,
  buildCoverDownloadName,
  downloadMediaFile,
} from '@/lib/downloadMedia';
import { cn } from '@/lib/utils';
import type { MusicRelease } from '@/types';

interface ReleaseDetailContentProps {
  release: MusicRelease;
  showSubmittedBy?: boolean;
}

function ReleaseDetailAmbientBackdrop({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
      <div className="absolute -left-16 top-0 h-56 w-56 animate-pulse rounded-full bg-brand-lime/10 blur-3xl" />
      <div
        className="absolute -right-16 bottom-0 h-56 w-56 animate-pulse rounded-full bg-brand-purple/15 blur-3xl"
        style={{ animationDelay: '0.6s' }}
      />
      <div className="absolute inset-x-0 bottom-0 flex h-40 items-end justify-center gap-1.5 px-6 pb-2 opacity-[0.14]">
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            className="music-playing-bar w-1 rounded-full bg-brand-lime"
            style={{ animationDelay: `${(index % 7) * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ReleaseDetailContent({ release, showSubmittedBy = false }: ReleaseDetailContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadingCover, setDownloadingCover] = useState(false);
  const [downloadingAudio, setDownloadingAudio] = useState(false);

  const primaryTrack = release.tracks[0];
  const primaryAudio = release.audioFiles[0];
  const coverUrl = release.coverArtUrl ? resolveReleaseMediaUrl(release.coverArtUrl) : undefined;
  const audioUrl = primaryAudio ? resolveReleaseMediaUrl(primaryAudio.url) : undefined;
  const trackTitle = primaryTrack?.title || release.title;

  const handleDownloadCover = async () => {
    if (!coverUrl) return;
    setDownloadingCover(true);
    try {
      await downloadMediaFile(coverUrl, buildCoverDownloadName(release.title, coverUrl));
      toast.success('Banner image downloaded');
    } catch {
      toast.error('Failed to download banner image');
    } finally {
      setDownloadingCover(false);
    }
  };

  const handleDownloadAudio = async () => {
    if (!audioUrl) return;
    setDownloadingAudio(true);
    try {
      await downloadMediaFile(
        audioUrl,
        buildAudioDownloadName(primaryAudio?.fileName, audioUrl, trackTitle),
      );
      toast.success('Song downloaded');
    } catch {
      toast.error('Failed to download song');
    } finally {
      setDownloadingAudio(false);
    }
  };

  const leftFields = [
    { label: 'Title', value: displayDetailValue(release.title) },
    { label: 'Version', value: displayDetailValue(release.version) },
    { label: 'Label', value: displayDetailValue(release.label) },
    { label: 'Genre', value: formatGenreDetail(primaryTrack) },
    { label: 'Release Type', value: formatReleaseTypeLabel(release.releaseType) },
    { label: 'UPC', value: displayDetailValue(release.upc) },
    { label: 'ISRC', value: formatIsrcDetail(primaryTrack) },
  ];

  const rightFields = [
    { label: 'Release Date', value: formatApiDateDetail(release.releasingDate) },
    { label: 'Pre-Order Date', value: formatApiDateDetail(release.scheduledReleaseDate) },
    { label: 'Price Tier', value: formatPriceTierDetail(primaryTrack?.price) },
    { label: 'Release Platform', value: formatReleasePlatformDetail(release.releasePlatform) },
    { label: 'C Line', value: displayDetailValue(release.cLine) },
    { label: 'P Line', value: displayDetailValue(release.pLine) },
    { label: 'Import Date', value: formatImportDateDetail(release.createdAt) },
    { label: 'Last Updated', value: formatImportDateDetail(release.updatedAt) },
  ];

  const hasTrackCredits =
    primaryTrack &&
    (primaryTrack.composer ||
      primaryTrack.producer ||
      primaryTrack.director ||
      primaryTrack.language ||
      primaryTrack.lyrics?.trim());

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#222] bg-[#080808]">
      <ReleaseDetailAmbientBackdrop active={isPlaying} />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            {coverUrl ? (
              <div className="relative h-52 w-52 overflow-hidden rounded-xl ring-1 ring-[#2a2a2a] sm:h-60 sm:w-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt=""
                  className={cn(
                    'h-full w-full object-cover transition-transform duration-500',
                    isPlaying && 'scale-105',
                  )}
                />
                <ReleaseDetailAudioPlayer
                  audioUrl={audioUrl}
                  trackTitle={trackTitle}
                  size="lg"
                  variant="overlay"
                  onPlayingChange={setIsPlaying}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  title="Download banner image"
                  disabled={downloadingCover}
                  onClick={() => void handleDownloadCover()}
                  className="absolute bottom-2 right-2 z-20 h-9 w-9 rounded-full border border-white/20 bg-black/70 p-0 text-white hover:bg-black/85 hover:text-brand-lime"
                >
                  {downloadingCover ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-xl bg-[#1a1a1a] text-[13px] text-neutral-600 ring-1 ring-[#2a2a2a] sm:h-60 sm:w-60">
                No cover
                <ReleaseDetailAudioPlayer
                  audioUrl={audioUrl}
                  trackTitle={trackTitle}
                  size="lg"
                  variant="overlay"
                  onPlayingChange={setIsPlaying}
                />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <h3 className="text-[26px] font-bold leading-tight text-white sm:text-[30px]">{release.title}</h3>
            <p className="mt-1 text-[15px] text-neutral-400">{release.artist}</p>

            <div className="mt-3 flex w-full flex-col items-start gap-2 text-left">
              {isPlaying ? <ReleaseDetailPlayingIndicator /> : null}
              <p className="truncate text-[13px] font-medium text-white">{trackTitle}</p>
              <div className="flex max-w-full flex-wrap items-center gap-2">
                {primaryAudio?.fileName ? (
                  <p className="truncate text-[11px] text-neutral-600">{primaryAudio.fileName}</p>
                ) : null}
                {audioUrl ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    title="Download song"
                    disabled={downloadingAudio}
                    onClick={() => void handleDownloadAudio()}
                    className="h-8 rounded-lg border-[#2a2a2a] bg-transparent px-2.5 text-[12px] text-neutral-300 hover:border-brand-lime/40 hover:bg-[#141414] hover:text-brand-lime"
                  >
                    {downloadingAudio ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Download song
                  </Button>
                ) : null}
                {coverUrl ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    title="Download banner image"
                    disabled={downloadingCover}
                    onClick={() => void handleDownloadCover()}
                    className="h-8 rounded-lg border-[#2a2a2a] bg-transparent px-2.5 text-[12px] text-neutral-300 hover:border-brand-lime/40 hover:bg-[#141414] hover:text-brand-lime"
                  >
                    {downloadingCover ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Download banner
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-start gap-3">
              <ReleaseStatusBadge status={release.status} />
              <ReleaseDetailRow label="Instrumental" value={formatYesNoDetail(release.instrumental)} inline />
              <ReleaseDetailRow label="Explicit" value={formatYesNoDetail(release.explicit)} inline />
              <ReleaseDetailRow label="AI Generated" value={formatYesNoDetail(release.aiGenerated)} inline />
            </div>

            {showSubmittedBy ? (
              <div className="mt-4 flex items-center justify-start gap-3">
                <span className="text-[13px] text-neutral-500">Submitted By</span>
                <AdminBadge name={release.createdBy?.name} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-x-10 border-t border-[#1f1f1f] pt-6 lg:grid-cols-2">
          <div>
            {leftFields.map((field) => (
              <ReleaseDetailRow key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
          <div>
            {rightFields.map((field) => (
              <ReleaseDetailRow key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </div>

        {hasTrackCredits ? (
          <div className="mt-6 border-t border-[#1f1f1f] pt-6">
            <div className="grid gap-x-10 lg:grid-cols-2">
              <div>
                <ReleaseDetailRow label="Track Title" value={displayDetailValue(primaryTrack!.title)} />
                <ReleaseDetailRow label="Track Artist" value={displayDetailValue(primaryTrack!.artist)} />
                <ReleaseDetailRow label="Composer" value={displayDetailValue(primaryTrack!.composer)} />
                <ReleaseDetailRow label="Producer" value={displayDetailValue(primaryTrack!.producer)} />
              </div>
              <div>
                <ReleaseDetailRow label="Director" value={displayDetailValue(primaryTrack!.director)} />
                <ReleaseDetailRow label="Language" value={displayDetailValue(primaryTrack!.language)} />
              </div>
            </div>
            {primaryTrack!.lyrics?.trim() ? (
              <div className="mt-4">
                <p className="text-[12px] text-neutral-500">Lyrics</p>
                <p className="mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed text-neutral-300">
                  {primaryTrack!.lyrics.trim()}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {release.scheduleNotes?.trim() ? (
          <div className="mt-6 border-t border-[#1f1f1f] pt-6">
            <p className="text-[12px] text-neutral-500">Schedule Notes</p>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-300">{release.scheduleNotes.trim()}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
