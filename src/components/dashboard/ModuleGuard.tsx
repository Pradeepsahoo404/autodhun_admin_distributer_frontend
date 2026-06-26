'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppStore';
import { useGetSidebarQuery } from '@/store/api';
import { ALL_MODULE_ROUTES, UNAUTHORIZED_ROUTE } from '@/constants';
import { buildModuleSlugMap, getRootSlug } from '@/utils/moduleTree';

/**
 * Client-side module access guard. Child routes inherit access from their
 * top-level root module permission.
 */
export function ModuleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { sidebarModules } = useAppSelector((s) => s.permission);
  const { data, isLoading, isSuccess } = useGetSidebarQuery();
  const [checked, setChecked] = useState(false);

  const modules = sidebarModules.length > 0 ? sidebarModules : data?.data ?? [];
  const isSuperAdmin = user?.role === 'super-admin';

  const matched = [...ALL_MODULE_ROUTES]
    .sort((a, b) => b.route.length - a.route.length)
    .find((m) => pathname === m.route || pathname.startsWith(`${m.route}/`));

  const allowed = useMemo(() => {
    if (isSuperAdmin || !matched) return true;

    const slugMap = buildModuleSlugMap(modules);
    const ref = slugMap.get(matched.slug);
    if (!ref) return false;

    const rootSlug = getRootSlug(ref, slugMap);
    return modules.some((m) => m.slug === rootSlug && m.canView);
  }, [isSuperAdmin, matched, modules]);

  useEffect(() => {
    if (isLoading) return;
    if (!isSuccess && sidebarModules.length === 0) return;
    if (!allowed) {
      router.replace(UNAUTHORIZED_ROUTE);
    } else {
      setChecked(true);
    }
  }, [allowed, isLoading, isSuccess, sidebarModules.length, router]);

  if (!allowed) return null;
  if (!checked && isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20 text-sm text-neutral-500">Loading…</div>
    );
  }

  return <>{children}</>;
}
