'use client';

import { LabelsManagePage } from '@/components/dashboard/label-transfer/LabelsManagePage';

export function LabelBlockPage() {
  return (
    <LabelsManagePage
      status="inactive"
      permissionModule="label-block"
      title="Label Block"
      description="Blocked labels are hidden from release and rights forms. Reactivate a label here to make it available again."
      tableTitle="Blocked Labels"
      tableIcon="ban"
      emptyMessage="No blocked labels."
    />
  );
}
