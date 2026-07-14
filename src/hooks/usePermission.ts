'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { buildModuleSlugMap, getRootSlug } from '@/utils/moduleTree';

type Action = 'view' | 'create' | 'update' | 'delete';

/**
 * Returns whether the current user can perform an action on a module.
 * Child modules inherit permissions from their top-level root module.
 */
export function usePermission(moduleSlug: string) {
  const { sidebarModules } = useAppSelector((s) => s.permission);
  const { user } = useAppSelector((s) => s.auth);

  const isSuperAdmin = user?.role === 'super-admin';

  const mod = useMemo(() => {
    const direct = sidebarModules.find((m) => m.slug === moduleSlug);
    if (direct) return direct;

    const slugMap = buildModuleSlugMap(sidebarModules);
    const ref = slugMap.get(moduleSlug);
    if (!ref) return undefined;

    const rootSlug = getRootSlug(ref, slugMap);
    return sidebarModules.find((m) => m.slug === rootSlug);
  }, [sidebarModules, moduleSlug]);

  const can = (action: Action): boolean => {
    if (isSuperAdmin) return true;
    if (!mod) return false;
    const map: Record<Action, boolean> = {
      view: mod.canView,
      create: mod.canCreate,
      update: mod.canUpdate,
      delete: mod.canDelete,
    };
    return map[action];
  };

  return {
    canView: can('view'),
    canCreate: can('create'),
    canUpdate: can('update'),
    canDelete: can('delete'),
    can,
    module: mod,
    isSuperAdmin,
  };
}
