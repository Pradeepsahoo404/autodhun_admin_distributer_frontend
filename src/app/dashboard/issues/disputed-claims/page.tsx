'use client';

import { IssuesAssignedEntryPage } from '@/components/dashboard/issues-entry/IssuesAssignedEntryPage';
import { DISPUTED_CLAIMS_PAGE_CONFIG } from '@/constants/issuesModuleConfigs';

export default function DisputedClaimsPage() {
  return <IssuesAssignedEntryPage config={DISPUTED_CLAIMS_PAGE_CONFIG} />;
}
