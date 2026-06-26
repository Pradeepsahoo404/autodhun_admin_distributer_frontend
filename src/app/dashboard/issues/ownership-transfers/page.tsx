'use client';

import { IssuesAssignedEntryPage } from '@/components/dashboard/issues-entry/IssuesAssignedEntryPage';
import { OWNERSHIP_TRANSFERS_PAGE_CONFIG } from '@/constants/issuesModuleConfigs';

export default function OwnershipTransfersPage() {
  return <IssuesAssignedEntryPage config={OWNERSHIP_TRANSFERS_PAGE_CONFIG} />;
}
