'use client';

import { LabelsManagePage } from '@/components/dashboard/label-transfer/LabelsManagePage';

export function LabelTransferPage() {
  return (
    <LabelsManagePage
      status="active"
      permissionModule="label-transfer"
      title="Label Transfer"
      description="Manage active labels, transfer ownership between admins, and block labels that should no longer appear in forms."
      tableTitle="Active Labels"
      tableIcon="tag"
      emptyMessage="No active labels found in the catalog."
      showTransfer
    />
  );
}
