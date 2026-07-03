'use client';

import { useRouter } from 'next/navigation';
import { DashboardQuickAction } from '@/types';
import { getModuleIcon } from '@/utils/icons';
import { getRouteForModuleSlug } from '@/config/modulePages';

/** Horizontal row of permission-filtered quick-action buttons. */
export function QuickActions({ actions }: { actions: DashboardQuickAction[] }) {
  const router = useRouter();

  if (actions.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-[14px] font-semibold tracking-wide text-neutral-400">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        {actions.map((action, i) => {
          const Icon = getModuleIcon(action.icon);
          const accent = i % 2 === 0 ? 'lime' : 'purple';
          const href = getRouteForModuleSlug(action.module);

          return (
            <button
              key={action.key}
              type="button"
              disabled={!href}
              onClick={() => {
                if (href) router.push(href);
              }}
              className="flex items-center gap-3 rounded-2xl border border-[#222222] bg-[#111111] px-5 py-3.5 text-[14px] font-medium text-neutral-300 transition-all hover:border-brand-lime/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={
                  accent === 'lime'
                    ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-brand-lime/10 text-brand-lime'
                    : 'flex h-9 w-9 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple'
                }
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
