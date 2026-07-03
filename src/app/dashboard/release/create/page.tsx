'use client';

import { CreateReleaseWizard } from '@/components/dashboard/create-release/CreateReleaseWizard';
import { CreateReleaseScrollFix } from '@/components/dashboard/create-release/CreateReleaseScrollFix';

export default function CreateNewReleasePage() {
  return (
    <CreateReleaseScrollFix>
      <CreateReleaseWizard />
    </CreateReleaseScrollFix>
  );
}
