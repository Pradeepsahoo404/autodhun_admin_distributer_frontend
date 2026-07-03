'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { DASHBOARD_CARD } from '@/constants/dashboardLayout';

interface ReleaseSubmitSuccessProps {
  releaseTitle?: string;
  mode?: 'create' | 'edit';
}

function ReleaseSuccessIllustration() {
  return (
    <div className="relative mx-auto h-[200px] w-[200px] sm:h-[220px] sm:w-[220px]" aria-hidden>
      {/* Upload rays */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-end gap-3">
        <span className="h-8 w-1 rounded-full bg-brand-lime/20" />
        <span className="h-12 w-1.5 rounded-full bg-brand-lime/40" />
        <span className="h-8 w-1 rounded-full bg-brand-lime/20" />
      </div>

      {/* Back document */}
      <div className="absolute left-6 top-8 h-[118px] w-[92px] rotate-[-8deg] rounded-2xl border border-[#2a2a2a] bg-[#141414] shadow-lg" />

      {/* Front document */}
      <div className="absolute left-12 top-4 h-[128px] w-[100px] rounded-2xl border border-[#333] bg-gradient-to-br from-[#1a1a1a] to-[#111] shadow-xl shadow-black/40">
        <div className="absolute right-0 top-0 h-6 w-6 rounded-bl-xl rounded-tr-2xl bg-[#0d0d0d]" />
        <div className="space-y-2.5 px-4 pt-6">
          <div className="h-2 w-12 rounded-full bg-brand-lime/30" />
          <div className="h-2 w-16 rounded-full bg-[#333]" />
          <div className="h-2 w-10 rounded-full bg-[#2a2a2a]" />
        </div>
      </div>

      {/* Success check */}
      <div className="absolute bottom-10 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-lime shadow-lg shadow-brand-lime/30 ring-4 ring-[#0a0a0a]">
        <Check className="h-7 w-7 stroke-[3] text-black" />
      </div>
    </div>
  );
}

export function ReleaseSubmitSuccess({ releaseTitle, mode = 'create' }: ReleaseSubmitSuccessProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  return (
    <Card className={`${DASHBOARD_CARD} w-full overflow-hidden`}>
      <CardContent className="release-success-enter px-6 py-12 text-center sm:px-10 sm:py-16">
        <ReleaseSuccessIllustration />

        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-lime">Done</p>
        <h2 className="mt-2 text-[26px] font-bold text-white sm:text-[32px]">
          {isEdit ? 'Successfully Updated!' : 'Successfully Submitted!'}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-neutral-400">
          {releaseTitle ? (
            <>
              <span className="font-medium text-neutral-200">{releaseTitle}</span>{' '}
              {isEdit ? (
                <>has been updated and is now <span className="text-brand-lime">In Review</span>.</>
              ) : (
                <>has been submitted and is now <span className="text-brand-lime">In Review</span>.</>
              )}
            </>
          ) : isEdit ? (
            <>
              Your release has been updated and is now <span className="text-brand-lime">In Review</span>.
            </>
          ) : (
            <>
              Your release has been submitted and is now <span className="text-brand-lime">In Review</span>.
            </>
          )}
        </p>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-neutral-600">
          {isEdit
            ? 'Resubmitted releases return to In Review for superadmin review.'
            : 'You will be notified once it moves to the next stage.'}
        </p>

        <button
          type="button"
          onClick={() => router.push('/dashboard/assets')}
          className="mt-8 inline-flex h-11 min-w-[180px] items-center justify-center rounded-xl bg-brand-lime px-8 text-[14px] font-semibold text-black transition-colors hover:bg-brand-lime-dark"
        >
          Go to Assets
        </button>
      </CardContent>
    </Card>
  );
}
