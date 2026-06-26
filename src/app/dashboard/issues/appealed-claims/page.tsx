'use client';

import { IssuesAssignedEntryPage } from '@/components/dashboard/issues-entry/IssuesAssignedEntryPage';
import { APPEALED_CLAIMS_PAGE_CONFIG } from '@/constants/issuesModuleConfigs';

export default function AppealedClaimsPage() {
  return <IssuesAssignedEntryPage config={APPEALED_CLAIMS_PAGE_CONFIG} />;
}
