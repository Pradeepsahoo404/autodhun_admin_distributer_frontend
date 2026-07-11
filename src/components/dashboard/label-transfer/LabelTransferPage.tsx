'use client';

import { DASHBOARD_PAGE } from '@/constants';
import { LabelsManagePage } from '@/components/dashboard/label-transfer/LabelsManagePage';
import { LabelUpdatesTable } from '@/components/dashboard/label-update/LabelUpdatesTable';
import { LabelTransferHistoryTable } from '@/components/dashboard/label-transfer/LabelTransferHistoryTable';

export function LabelTransferPage() {
  return (
    <div className={`${DASHBOARD_PAGE} space-y-8`}>
      <LabelsManagePage
        status="active"
        permissionModule="label-transfer"
        title="Label Transfer"
        description="Manage active labels, transfer ownership between admins, and block labels that should no longer appear in forms."
        tableTitle="Active Labels"
        tableIcon="tag"
        emptyMessage="No active labels found in the catalog."
        showTransfer
        embedded
      />

      <LabelUpdatesTable
        title="Recent Label Updates"
        description="Label name changes made by Super Admin from this page."
        compact
      />

      <LabelTransferHistoryTable />
    </div>
  );
}
