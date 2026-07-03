'use client';

import { useRef, useState } from 'react';
import { FileAudio, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { UploadedAudio } from '@/features/create-release/types';
import { RELEASE_UPLOAD_ZONE_HEIGHT } from '@/features/create-release/constants';

interface AudioFileUploadProps {
  files: UploadedAudio[];
  onChange: (files: UploadedAudio[]) => void;
  error?: string;
}

const AUDIO_ACCEPT = 'audio/*,.wav,.mp3,.flac,.aac,.m4a';
const EMPTY_SLOT: UploadedAudio = { file: null, fileName: '' };

function isValidAudioFile(file: File): boolean {
  return file.type.startsWith('audio/') || /\.(wav|mp3|flac|aac|m4a)$/i.test(file.name);
}

function normalizeFiles(files: UploadedAudio[]): UploadedAudio[] {
  const valid = files.filter((f) => f.file || f.fileName.trim()).slice(0, 1);
  return valid.length > 0 ? valid : [EMPTY_SLOT];
}

export function AudioFileUpload({ files, onChange, error }: AudioFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const uploaded = files.filter((f) => f.file || f.fileName.trim());
  const hasFiles = uploaded.length > 0;

  const openPicker = (mode: 'add' | 'replace', index?: number) => {
    if (mode === 'replace' && index !== undefined) {
      setReplaceIndex(index);
    } else {
      setReplaceIndex(null);
    }
    inputRef.current?.click();
  };

  const applyFiles = (incoming: File[], mode: 'add' | 'replace', index?: number) => {
    const valid = incoming.filter(isValidAudioFile);
    if (valid.length === 0) {
      toast.error('Please upload valid audio files (MP3, WAV, FLAC, AAC)');
      return;
    }

    if (mode === 'replace' && index !== undefined) {
      const next = [...uploaded];
      next[index] = { file: valid[0], fileName: valid[0].name };
      onChange(normalizeFiles(next));
      return;
    }

    onChange(normalizeFiles([{ file: valid[0], fileName: valid[0].name }]));
  };

  const handleInputChange = (fileList: FileList | null) => {
    const list = Array.from(fileList ?? []);
    if (list.length === 0) return;

    if (replaceIndex !== null) {
      applyFiles(list, 'replace', replaceIndex);
      setReplaceIndex(null);
    } else {
      applyFiles(list, 'add');
    }
  };

  const removeFile = (index: number) => {
    const next = uploaded.filter((_, i) => i !== index);
    onChange(normalizeFiles(next));
  };

  return (
    <div className="w-full space-y-4">
      {!hasFiles ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => openPicker('add')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPicker('add');
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
            applyFiles(Array.from(e.dataTransfer.files), 'add');
          }}
          style={{ height: RELEASE_UPLOAD_ZONE_HEIGHT }}
          className={cn(
            'group flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all',
            isDragging
              ? 'border-brand-lime bg-brand-lime/5 shadow-[0_0_0_4px_rgba(163,255,18,0.08)]'
              : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-brand-lime/40 hover:bg-[#0d0d0d]',
            error && 'border-red-500/50',
          )}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#161616] ring-1 ring-[#222]">
            <Upload className="h-6 w-6 text-neutral-500" />
          </div>
          <p className="text-[15px] font-semibold text-white">Upload Audio File</p>
          <p className="mt-1 text-[12px] text-neutral-500">Click here or drag and drop an audio file</p>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {uploaded.map((entry, index) => (
              <li
                key={`${entry.fileName}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-[#222] bg-[#0d0d0d] px-4 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lime/10 ring-1 ring-brand-lime/20">
                  <FileAudio className="h-5 w-5 text-brand-lime" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Track {index + 1}
                  </p>
                  <p className="truncate text-[14px] font-medium text-white">
                    {entry.fileName || entry.file?.name}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openPicker('replace', index)}
                    className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-neutral-400 transition-colors hover:bg-[#1a1a1a] hover:text-white"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Remove track ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={AUDIO_ACCEPT}
        multiple={false}
        className="sr-only"
        onChange={(e) => {
          handleInputChange(e.target.files);
          e.target.value = '';
        }}
      />

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
