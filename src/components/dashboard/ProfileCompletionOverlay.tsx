'use client';

import { useRouter } from 'next/navigation';
import { Landmark, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

interface ProfileCompletionOverlayProps {
  onClose: () => void;
}

export function ProfileCompletionOverlay({ onClose }: ProfileCompletionOverlayProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/80 p-4 backdrop-blur-[3px]">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-[#222] hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center justify-center border-b border-[#2a2a2a] bg-[#111111] px-6 py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-brand-lime/20 bg-brand-lime/10">
            <Landmark className="h-10 w-10 text-brand-lime" aria-hidden />
          </div>
        </div>

        <div className="px-6 py-6">
          <h2 className="text-center text-[22px] font-semibold text-white">Complete your bank details</h2>
          <p className="mt-3 text-center text-[14px] leading-relaxed text-neutral-400">
            Before you get full access to the admin panel, please add your bank details for payouts and settlements.
          </p>

          <div className="mt-5 flex gap-3 rounded-xl border border-brand-lime/20 bg-brand-lime/5 px-4 py-3.5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-lime" aria-hidden />
            <p className="text-[13px] leading-relaxed text-brand-lime">
              Your banking information is encrypted and stored securely.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => router.push(ROUTES.PROFILE_BANK_DETAILS)}
            className="mt-6 h-11 w-full rounded-xl bg-brand-lime text-[15px] font-semibold text-black hover:bg-brand-lime-dark"
          >
            Update bank details
          </Button>
        </div>
      </div>
    </div>
  );
}
