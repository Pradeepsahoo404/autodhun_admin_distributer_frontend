'use client';

import { createContext, useContext } from 'react';

interface ReleaseWizardContextValue {
  isEdit: boolean;
  releaseId?: string;
}

const ReleaseWizardContext = createContext<ReleaseWizardContextValue>({ isEdit: false });

export function ReleaseWizardProvider({
  isEdit,
  releaseId,
  children,
}: {
  isEdit: boolean;
  releaseId?: string;
  children: React.ReactNode;
}) {
  return (
    <ReleaseWizardContext.Provider value={{ isEdit, releaseId }}>{children}</ReleaseWizardContext.Provider>
  );
}

export function useReleaseWizardContext(): ReleaseWizardContextValue {
  return useContext(ReleaseWizardContext);
}
