'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseWizardNavProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}

export function ReleaseWizardNav({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  submitLabel = 'Submit',
  submittingLabel = 'Submitting...',
}: ReleaseWizardNavProps) {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-end gap-3">
      {!isFirst ? (
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-5 text-[14px] font-medium text-white transition-colors hover:border-[#333] hover:bg-[#161616]"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
      ) : null}

      {isLast ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={cn(
            'inline-flex h-11 min-w-[140px] items-center justify-center gap-1.5 rounded-xl bg-brand-lime px-6 text-[14px] font-semibold text-black transition-colors hover:bg-brand-lime-dark',
            isSubmitting && 'cursor-not-allowed opacity-60',
          )}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-11 min-w-[140px] items-center justify-center gap-1.5 rounded-xl bg-brand-lime px-6 text-[14px] font-semibold text-black transition-colors hover:bg-brand-lime-dark"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
