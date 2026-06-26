'use client';

import { IssuesAssignedEntryPage } from '@/components/dashboard/issues-entry/IssuesAssignedEntryPage';
import { POTENTIAL_CLAIMS_PAGE_CONFIG } from '@/constants/issuesModuleConfigs';

export default function PotentialClaimsPage() {
  return <IssuesAssignedEntryPage config={POTENTIAL_CLAIMS_PAGE_CONFIG} />;
}
