'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RELEASE_WIZARD_STEPS } from '@/features/create-release/constants';

interface ReleaseWizardStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

function rightConnectorWidth(stepId: number, currentStep: number): string {
  if (currentStep > stepId) return '100%';
  if (currentStep === stepId) return '50%';
  return '0%';
}

export function ReleaseWizardStepper({ currentStep, onStepClick }: ReleaseWizardStepperProps) {
  const lastIndex = RELEASE_WIZARD_STEPS.length - 1;

  return (
    <nav className="w-full px-1 sm:px-2" aria-label="Release creation steps">
      <ol className="grid grid-cols-6 gap-0">
        {RELEASE_WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const canNavigate = isCompleted && onStepClick;

          return (
            <li key={step.id} className="flex min-w-0 flex-col items-center">
              <div className="relative flex h-11 w-full items-center justify-center sm:h-[44px]">
                {index > 0 ? (
                  <div className="absolute left-0 right-1/2 top-1/2 h-[3px] -translate-y-1/2">
                    <div
                      className={cn(
                        'h-full rounded-l-full transition-colors duration-500',
                        currentStep >= step.id ? 'bg-brand-lime' : 'bg-[#2a2a2a]',
                      )}
                    />
                  </div>
                ) : null}

                {index < lastIndex ? (
                  <div className="absolute left-1/2 right-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-r-full bg-[#2a2a2a]">
                    <div
                      className="h-full rounded-r-full bg-brand-lime transition-all duration-500 ease-out"
                      style={{ width: rightConnectorWidth(step.id, currentStep) }}
                    />
                  </div>
                ) : null}

                <button
                  type="button"
                  disabled={!canNavigate}
                  onClick={() => canNavigate && onStepClick(step.id)}
                  className={cn(
                    'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300 ease-out sm:h-11 sm:w-11 sm:text-[14px]',
                    isCompleted && 'bg-brand-lime text-black',
                    isActive && !isCompleted && 'border-2 border-neutral-300 bg-[#0d0d0d] text-white release-step-active',
                    !isActive && !isCompleted && 'border-2 border-[#333] bg-[#0a0a0a] text-neutral-500',
                    canNavigate && 'cursor-pointer hover:scale-105',
                    !canNavigate && 'cursor-default',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="h-5 w-5" strokeWidth={2.5} /> : step.id}
                </button>
              </div>

              <span
                className={cn(
                  'mt-2 w-full truncate px-0.5 text-center text-[10px] font-medium leading-tight sm:text-[11px]',
                  isActive ? 'text-white' : isCompleted ? 'text-neutral-300' : 'text-neutral-600',
                )}
              >
                {step.shortLabel}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
