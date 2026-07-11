'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateMusicReleaseMutation, useLazyCheckReleaseIsrcQuery, useUpdateMusicReleaseMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';
import { buildReleaseSubmitFormData } from '@/features/create-release/buildReleaseSubmitFormData';
import { Card, CardContent } from '@/components/ui/card';
import { ReleaseWizardStepper } from '@/components/dashboard/create-release/ReleaseWizardStepper';
import { ReleaseWizardNav } from '@/components/dashboard/create-release/ReleaseWizardNav';
import { StepReleaseInformation } from '@/components/dashboard/create-release/steps/StepReleaseInformation';
import { StepUploadTracks } from '@/components/dashboard/create-release/steps/StepUploadTracks';
import { StepTrackDetails } from '@/components/dashboard/create-release/steps/StepTrackDetails';
import { StepCrbt } from '@/components/dashboard/create-release/steps/StepCrbt';
import { StepScheduleRelease } from '@/components/dashboard/create-release/steps/StepScheduleRelease';
import { StepFinalReview } from '@/components/dashboard/create-release/steps/StepFinalReview';
import { ReleaseWizardProvider } from '@/components/dashboard/create-release/ReleaseWizardContext';
import { ReleaseSubmitSuccess } from '@/components/dashboard/create-release/ReleaseSubmitSuccess';
import { RELEASE_WIZARD_STEPS } from '@/features/create-release/constants';
import {
  crbtSchema,
  finalReviewSchema,
  releaseInformationEditSchema,
  releaseInformationSchema,
  scheduleReleaseSchema,
  STEP_ERROR_PATHS,
  trackDetailsSchema,
  uploadTracksEditSchema,
  uploadTracksSchema,
} from '@/features/create-release/schemas';
import { defaultCreateReleaseFormData, defaultTrackDetails, type CreateReleaseFormData } from '@/features/create-release/types';
import { DASHBOARD_CARD, DASHBOARD_PAGE, DASHBOARD_PAGE_TITLE } from '@/constants';

const STEP_SUBTITLES: Record<number, string> = {
  1: 'Upload artwork, enter the title, choose the release type, and add your project artists.',
  2: 'Upload your audio files for this release.',
  3: 'Enter metadata and details for each uploaded track.',
  4: 'Configure CRBT settings for your release.',
  5: 'Schedule when your release should go live.',
  6: 'Review all information before submitting your release.',
};

const STEP_COMPONENTS = [
  StepReleaseInformation,
  StepUploadTracks,
  StepTrackDetails,
  StepCrbt,
  StepScheduleRelease,
  StepFinalReview,
] as const;

function scrollMainToTop() {
  const main = document.querySelector('main');
  if (main) {
    main.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStepSchemas(isEdit: boolean) {
  return [
    isEdit ? releaseInformationEditSchema : releaseInformationSchema,
    isEdit ? uploadTracksEditSchema : uploadTracksSchema,
    trackDetailsSchema,
    crbtSchema,
    scheduleReleaseSchema,
    finalReviewSchema,
  ] as const;
}

interface CreateReleaseWizardProps {
  mode?: 'create' | 'edit';
  releaseId?: string;
  initialData?: CreateReleaseFormData;
}

export function CreateReleaseWizard({
  mode = 'create',
  releaseId,
  initialData,
}: CreateReleaseWizardProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const methods = useForm<CreateReleaseFormData>({
    defaultValues: initialData ?? defaultCreateReleaseFormData(),
    mode: 'onChange',
  });

  const { getValues, setError, clearErrors } = methods;
  const [createMusicRelease] = useCreateMusicReleaseMutation();
  const [updateMusicRelease] = useUpdateMusicReleaseMutation();
  const [checkReleaseIsrc] = useLazyCheckReleaseIsrcQuery();
  const stepSchemas = getStepSchemas(isEdit);
  const StepComponent = STEP_COMPONENTS[currentStep - 1];
  const stepMeta = RELEASE_WIZARD_STEPS[currentStep - 1];

  const validateStep = (step: number): boolean => {
    const schema = stepSchemas[step - 1];
    const values = getValues();
    const payload = getStepPayload(step, values, isEdit);
    const result = schema.safeParse(payload);

    (STEP_ERROR_PATHS[step] ?? []).forEach((path) => clearErrors(path as never));

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.') as never;
        setError(path, { message: issue.message });
      });
      toast.error('Please fix the highlighted fields before continuing');
      return false;
    }

    return true;
  };

  const syncTracksWithAudio = () => {
    const values = getValues();
    const uploadedCount = Math.max(
      values.audioFiles.filter((f) => f.file || f.fileName.trim()).length,
      1,
    );

    const newTracks = values.tracks.slice(0, uploadedCount);
    while (newTracks.length < uploadedCount) {
      newTracks.push({
        ...defaultTrackDetails(),
        title: values.title,
        artist: values.artist,
      });
    }

    methods.setValue(
      'tracks',
      newTracks.map((track) => ({
        ...track,
        title: track.title.trim() || values.title,
        artist: track.artist.trim() || values.artist,
      })),
    );
  };

  const goToStep = (step: number) => {
    if (step >= currentStep) return;
    setCurrentStep(step);
    scrollMainToTop();
  };

  const validateOwnIsrcAvailability = async (): Promise<boolean> => {
    const tracks = getValues().tracks;
    const seenInForm = new Set<string>();
    let hasError = false;

    for (let index = 0; index < tracks.length; index += 1) {
      const track = tracks[index];
      if (track.isrcOption !== 'own') continue;

      const code = track.isrc?.trim();
      if (!code) continue;

      const normalized = code.toUpperCase();
      if (seenInForm.has(normalized)) {
        setError(`tracks.${index}.isrc`, { message: 'This ISRC is already used on another track' });
        hasError = true;
        continue;
      }
      seenInForm.add(normalized);

      try {
        const result = await checkReleaseIsrc({
          code,
          excludeReleaseId: releaseId,
        }).unwrap();

        if (!result.data.available) {
          setError(`tracks.${index}.isrc`, { message: 'This ISRC is already taken' });
          hasError = true;
        }
      } catch {
        toast.error('Could not verify ISRC availability');
        return false;
      }
    }

    if (hasError) {
      toast.error('Please fix the highlighted fields before continuing');
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 3) {
      const isrcOk = await validateOwnIsrcAvailability();
      if (!isrcOk) return;
    }
    if (currentStep === 2) syncTracksWithAudio();
    setCurrentStep((s) => Math.min(s + 1, RELEASE_WIZARD_STEPS.length));
    scrollMainToTop();
  };

  const handlePrevious = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    scrollMainToTop();
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    if (!(await validateOwnIsrcAvailability())) return;

    setIsSubmitting(true);
    try {
      const formData = buildReleaseSubmitFormData(getValues());
      if (isEdit && releaseId) {
        await updateMusicRelease({ id: releaseId, body: formData }).unwrap();
      } else {
        await createMusicRelease(formData).unwrap();
      }
      setSubmitSuccess(true);
      scrollMainToTop();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submittedTitle = getValues().title;
  const pageTitle = isEdit ? 'Edit Release' : 'Create New Release';

  return (
    <ReleaseWizardProvider isEdit={isEdit} releaseId={releaseId}>
    <FormProvider {...methods}>
      <div className={`${DASHBOARD_PAGE} w-full`}>
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#222] bg-[#111] text-neutral-400 transition-colors hover:border-[#333] hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className={DASHBOARD_PAGE_TITLE}>{pageTitle}</h1>
            <p className="mt-1 text-[14px] text-neutral-500">
              {submitSuccess
                ? isEdit
                  ? 'Update complete'
                  : 'Submission complete'
                : `Step ${currentStep} of ${RELEASE_WIZARD_STEPS.length} · ${stepMeta.label}`}
            </p>
          </div>
        </div>

        {submitSuccess ? (
          <ReleaseSubmitSuccess releaseTitle={submittedTitle} mode={mode} />
        ) : (
          <>
            <Card className={`${DASHBOARD_CARD} mb-6 w-full`}>
              <CardContent className="p-5 sm:p-6">
                <ReleaseWizardStepper currentStep={currentStep} onStepClick={goToStep} />
              </CardContent>
            </Card>

            <Card className={`${DASHBOARD_CARD} w-full`}>
              <CardContent className="p-0">
                <div className="border-b border-[#1a1a1a] px-5 py-5 sm:px-8">
                  <h2 className="text-[18px] font-semibold text-white sm:text-[20px]">{stepMeta.label}</h2>
                  <p className="mt-1 text-[13px] text-neutral-500">{STEP_SUBTITLES[currentStep]}</p>
                </div>

                <div key={currentStep} className="release-step-content-enter w-full">
                  <StepComponent />
                </div>

                <div className="px-5 py-5 sm:px-8">
                  <ReleaseWizardNav
                    currentStep={currentStep}
                    totalSteps={RELEASE_WIZARD_STEPS.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitLabel={isEdit ? 'Save Changes' : 'Submit'}
                    submittingLabel={isEdit ? 'Saving...' : 'Submitting...'}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </FormProvider>
    </ReleaseWizardProvider>
  );
}

function getStepPayload(step: number, values: CreateReleaseFormData, isEdit: boolean) {
  switch (step) {
    case 1:
      return isEdit
        ? {
            title: values.title,
            version: values.version,
            artist: values.artist,
            releaseType: values.releaseType,
            releasingDate: values.releasingDate,
            label: values.label,
            instrumental: values.instrumental,
            explicit: values.explicit,
            aiGenerated: values.aiGenerated,
            upc: values.upc,
            pLine: values.pLine,
            cLine: values.cLine,
            coverArt: values.coverArt,
            coverArtPreview: values.coverArtPreview,
          }
        : {
            title: values.title,
            version: values.version,
            artist: values.artist,
            releaseType: values.releaseType,
            releasingDate: values.releasingDate,
            label: values.label,
            instrumental: values.instrumental,
            explicit: values.explicit,
            aiGenerated: values.aiGenerated,
            upc: values.upc,
            pLine: values.pLine,
            cLine: values.cLine,
            coverArt: values.coverArt,
          };
    case 2:
      return { audioFiles: values.audioFiles };
    case 3:
      return { tracks: values.tracks };
    case 4:
      return {
        crbtEntries: values.crbtEntries,
      };
    case 5:
      return {
        releasingDate: values.releasingDate,
        scheduledReleaseDate: values.scheduledReleaseDate,
      };
    case 6:
      return {
        releasePlatform: values.releasePlatform,
        termsAccepted: values.termsAccepted,
      };
    default:
      return {};
  }
}
