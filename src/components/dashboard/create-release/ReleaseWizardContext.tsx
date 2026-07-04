'use client';

import { createContext, useContext } from 'react';

interface ReleaseWizardContextValue {
  isEdit: boolean;
}

const ReleaseWizardContext = createContext<ReleaseWizardContextValue>({ isEdit: false });

export function ReleaseWizardProvider({
  isEdit,
  children,
}: {
  isEdit: boolean;
  children: React.ReactNode;
}) {
  return <ReleaseWizardContext.Provider value={{ isEdit }}>{children}</ReleaseWizardContext.Provider>;
}

export function useReleaseWizardContext(): ReleaseWizardContextValue {
  return useContext(ReleaseWizardContext);
}
