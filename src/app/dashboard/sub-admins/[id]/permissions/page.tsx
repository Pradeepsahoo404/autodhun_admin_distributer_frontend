'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

/** Legacy permissions URL — redirects to the unified edit page. */
export default function EditSubAdminPermissionsRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`${ROUTES.SUB_ADMINS}/${id}/edit`);
  }, [id, router]);

  return <p className="p-6 text-sm text-neutral-500">Redirecting...</p>;
}
