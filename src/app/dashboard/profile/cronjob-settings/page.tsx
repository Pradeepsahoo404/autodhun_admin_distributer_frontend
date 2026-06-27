'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CronjobSettingsForm } from '@/components/dashboard/profile/CronjobSettingsForm';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { ROUTES } from '@/constants';

export default function CronjobSettingsPage() {
  const router = useRouter();
  const { isSuperAdmin } = useAuthAccount();

  useEffect(() => {
    if (!isSuperAdmin) {
      router.replace(ROUTES.PROFILE);
    }
  }, [isSuperAdmin, router]);

  if (!isSuperAdmin) {
    return null;
  }

  return <CronjobSettingsForm />;
}
