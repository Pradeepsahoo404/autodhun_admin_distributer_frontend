'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** When false, clicking the backdrop does not close the modal. Default: false */
  closeOnBackdropClick?: boolean;
  /** Show the top-right close button. Default: true */
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass: Record<NonNullable<AppModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function AppModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  closeOnBackdropClick = false,
  showCloseButton = true,
  size = 'md',
}: AppModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-[3px]"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border border-[#252525] bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.6)]',
          sizeClass[size],
          className,
        )}
      >
        <div className="flex items-start justify-between border-b border-[#252525] bg-gradient-to-r from-[#161616] via-[#121212] to-[#111111] px-6 py-5">
          <div className="min-w-0 pr-4">
            <h2 id="app-modal-title" className="text-[18px] font-semibold tracking-tight text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[13px] text-neutral-500">{description}</p>
            ) : null}
          </div>

          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-transparent p-1.5 text-neutral-500 transition-colors hover:border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="border-t border-[#252525] bg-[#0d0d0d]/60 px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export const modalFormClass = 'space-y-4';

export const modalCancelButtonClass =
  'rounded-xl px-4 text-neutral-400 hover:bg-[#1a1a1a] hover:text-white';

export const modalPrimaryButtonClass =
  'min-w-[108px] rounded-xl bg-brand-lime px-5 font-semibold text-black hover:bg-brand-lime-dark disabled:opacity-60';

export const modalDangerButtonClass =
  'min-w-[108px] rounded-xl bg-red-500 px-5 font-semibold text-white hover:bg-red-600 disabled:opacity-60';
