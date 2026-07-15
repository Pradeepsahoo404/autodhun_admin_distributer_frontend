'use client';

import { use } from 'react';
import { EditSubAdminForm } from '@/components/dashboard/users/EditSubAdminForm';

export default function EditSubAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <EditSubAdminForm userId={id} />;
}
