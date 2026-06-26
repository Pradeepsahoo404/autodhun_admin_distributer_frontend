'use client';

import { cn } from '@/lib/utils';
import { usePermission } from '@/hooks/usePermission';
import { DASHBOARD_PAGE, DASHBOARD_CARD } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

interface ModulePlaceholderProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Generic, permission-aware module page scaffold. Renders the module header and
 * an action toolbar whose buttons appear only when the user has the matching
 * create/update/delete permission for the module.
 */
export function ModulePlaceholder({ slug, title, description }: ModulePlaceholderProps) {
  const { canCreate, canUpdate, canDelete } = usePermission(slug);

  return (
    <div className={DASHBOARD_PAGE}>
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          canCreate ? (
            <button className="rounded-xl bg-brand-lime px-5 py-2.5 text-[14px] font-semibold text-black hover:bg-brand-lime-dark">
              Create
            </button>
          ) : undefined
        }
      />

      <div className={cn(DASHBOARD_CARD, 'p-10 text-center')}>
        <p className="text-[15px] text-neutral-500">
          The <span className="font-medium text-white">{title}</span> module is ready and access-controlled.
        </p>
        <div className="mt-4 flex justify-center gap-2 text-xs text-neutral-600">
          <span className="rounded-md bg-[#1a1a1a] px-2 py-1">View ✓</span>
          {canCreate && <span className="rounded-md bg-[#1a1a1a] px-2 py-1">Create ✓</span>}
          {canUpdate && <span className="rounded-md bg-[#1a1a1a] px-2 py-1">Update ✓</span>}
          {canDelete && <span className="rounded-md bg-[#1a1a1a] px-2 py-1">Delete ✓</span>}
        </div>
      </div>
    </div>
  );
}
