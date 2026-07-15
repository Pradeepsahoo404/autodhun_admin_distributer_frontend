'use client';

import { DASHBOARD_PAGE } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { LabelUpdatesTable } from '@/components/dashboard/label-update/LabelUpdatesTable';

export function LabelUpdatePage() {
  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardPageHeader
        title="Label Update"
        description="View a complete history of label name changes for future reference."
      />

      <LabelUpdatesTable />
    </div>
  );
}
