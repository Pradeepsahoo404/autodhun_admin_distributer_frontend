'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Download, FileSpreadsheet, Loader2, UploadCloud, X } from 'lucide-react';
import { AppModal, modalCancelButtonClass, modalPrimaryButtonClass } from '@/components/common/AppModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getApiErrorMessage } from '@/services/apiClient';
import {
  useBulkImportReleasesMutation,
  useDownloadBulkImportTemplateMutation,
} from '@/store/api';
import type { BulkImportResult } from '@/store/api';

interface BulkImportDialogProps {
  open: boolean;
  onClose: () => void;
}

const ACCEPTED = '.xlsx,.xls,.csv';

export function BulkImportDialog({ open, onClose }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [downloadTemplate, { isLoading: isDownloading }] = useDownloadBulkImportTemplateMutation();
  const [bulkImport, { isLoading: isImporting }] = useBulkImportReleasesMutation();

  useEffect(() => {
    if (open) {
      setFile(null);
      setResult(null);
      setDragActive(false);
    }
  }, [open]);

  const handleDownload = async () => {
    try {
      const blob = await downloadTemplate().unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bulk-release-template.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('Template downloaded');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const pickFile = (next: File | null) => {
    setResult(null);
    if (!next) {
      setFile(null);
      return;
    }
    if (!/\.(xlsx|xls|csv)$/i.test(next.name)) {
      toast.error('Please select a .xlsx, .xls or .csv file');
      return;
    }
    setFile(next);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    pickFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleImport = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await bulkImport(formData).unwrap();
      const data = response.data;
      setResult(data);

      if (data.created > 0 && data.errors.length === 0) {
        toast.success(`${data.created} release(s) imported`);
        onClose();
      } else if (data.created > 0) {
        toast.success(`${data.created} release(s) imported — ${data.errors.length} skipped`);
      } else {
        toast.error(`Import failed — ${data.errors.length} issue(s) found`);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const hasErrors = (result?.errors.length ?? 0) > 0;
  const importedOk = (result?.created ?? 0) > 0;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Import Releases"
      description="Upload a filled spreadsheet to create multiple releases at once. Audio and cover art are added later."
      size="xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => void handleDownload()}
            disabled={isDownloading}
            className="rounded-xl border border-[#2a2a2a] text-neutral-200 hover:text-white"
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download template
          </Button>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className={modalCancelButtonClass}>
              {importedOk ? 'Close' : 'Cancel'}
            </Button>
            <Button
              type="button"
              onClick={() => void handleImport()}
              disabled={!file || isImporting}
              className={modalPrimaryButtonClass}
            >
              {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Import
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <ol className="space-y-1.5 rounded-xl border border-[#242424] bg-[#0e0e0e] p-4 text-[13px] text-neutral-400">
          <li>1. Download the template and read the <span className="text-neutral-200">Instructions</span> sheet.</li>
          <li>2. Fill one row per release. Columns marked with <span className="text-brand-lime">*</span> are required.</li>
          <li>3. Delete the example row, then upload the file below.</li>
        </ol>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
            dragActive ? 'border-brand-lime bg-brand-lime/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]',
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#141414]">
            <UploadCloud className="h-5 w-5 text-brand-lime" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-white">
              {file ? 'Choose a different file' : 'Click to upload or drag & drop'}
            </p>
            <p className="mt-1 text-[12px] text-neutral-500">XLSX, XLS or CSV — up to 5MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {file ? (
          <div className="flex items-center justify-between rounded-xl border border-[#242424] bg-[#0e0e0e] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 shrink-0 text-brand-lime" />
              <span className="truncate text-[13px] text-neutral-200">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => pickFile(null)}
              className="shrink-0 rounded-lg p-1.5 text-neutral-500 hover:bg-[#1a1a1a] hover:text-white"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {result ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 text-[13px]">
              <span className="rounded-lg border border-[#242424] bg-[#0e0e0e] px-3 py-1.5 text-neutral-300">
                Rows read: <span className="font-semibold text-white">{result.totalRows}</span>
              </span>
              <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
                Created: <span className="font-semibold">{result.created}</span>
              </span>
              {hasErrors ? (
                <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-red-300">
                  Issues: <span className="font-semibold">{result.errors.length}</span>
                </span>
              ) : null}
            </div>

            {hasErrors ? (
              <div className="overflow-hidden rounded-xl border border-[#242424]">
                <div className="border-b border-[#242424] bg-[#141414] px-4 py-2.5 text-[12px] font-medium text-neutral-400">
                  Fix these issues, then re-upload. Nothing was imported.
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead className="sticky top-0 bg-[#101010] text-[11px] uppercase tracking-wide text-neutral-500">
                      <tr>
                        <th className="px-4 py-2">Row</th>
                        <th className="px-4 py-2">Column</th>
                        <th className="px-4 py-2">Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((err, idx) => (
                        <tr key={`${err.row}-${err.field}-${idx}`} className="border-t border-[#1c1c1c]">
                          <td className="px-4 py-2 text-neutral-300">{err.row}</td>
                          <td className="px-4 py-2 text-neutral-300">{err.field}</td>
                          <td className="px-4 py-2 text-neutral-400">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : importedOk ? (
              <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
                All releases were imported with status In Review. Add audio and cover art from each release
                afterwards.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </AppModal>
  );
}
