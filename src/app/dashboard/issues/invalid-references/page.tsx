'use client';

import { IssuesAssignedEntryPage } from '@/components/dashboard/issues-entry/IssuesAssignedEntryPage';
import { INVALID_REFERENCES_PAGE_CONFIG } from '@/constants/issuesModuleConfigs';

export default function InvalidReferencesPage() {
  return <IssuesAssignedEntryPage config={INVALID_REFERENCES_PAGE_CONFIG} />;
}
