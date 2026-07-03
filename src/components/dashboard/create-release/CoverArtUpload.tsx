'use client';

import { useCallback, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { COVER_ART_DIMENSION, COVER_ART_MAX_SIZE_MB, RELEASE_UPLOAD_ZONE_HEIGHT } from '@/features/create-release/constants';

interface CoverArtUploadProps {
  preview: string | null;
  onChange: (file: File | null, preview: string | null) => void;
  error?: string;
}

export function CoverArtUpload({ preview, onChange, error }: CoverArtUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSet = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      if (file.size > COVER_ART_MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`Image must be less than ${COVER_ART_MAX_SIZE_MB} MB`);
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        if (img.width !== COVER_ART_DIMENSION || img.height !== COVER_ART_DIMENSION) {
          toast.error(`Cover art must be ${COVER_ART_DIMENSION}×${COVER_ART_DIMENSION} pixels`);
          URL.revokeObjectURL(url);
          return;
        }
        onChange(file, url);
      };
      img.onerror = () => {
        toast.error('Could not read image file');
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [onChange],
  );

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) validateAndSet(file);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{ height: RELEASE_UPLOAD_ZONE_HEIGHT }}
        className={cn(
          'group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all',
          isDragging
            ? 'border-brand-lime bg-brand-lime/5 shadow-[0_0_0_4px_rgba(163,255,18,0.08)]'
            : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-brand-lime/40 hover:bg-[#0d0d0d]',
          error && 'border-red-500/50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Cover art preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[13px] font-medium text-white">Click to replace</span>
            </div>
            <button
              type="button"
              onClick={clear}
              className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white transition-colors hover:bg-black"
              aria-label="Remove cover art"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#161616] ring-1 ring-[#222]">
              <ImagePlus className="h-6 w-6 text-neutral-500" />
            </div>
            <p className="text-[15px] font-semibold text-white">Upload Image</p>
            <p className="mt-1.5 max-w-[220px] text-center text-[12px] leading-relaxed text-neutral-500">
              Click here or drag and drop an image
            </p>
          </>
        )}
      </div>
      <p className="text-center text-[12px] text-neutral-600">
        Poster size {COVER_ART_DIMENSION}×{COVER_ART_DIMENSION} · Max {COVER_ART_MAX_SIZE_MB} MB
      </p>
      {error ? <p className="text-center text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
