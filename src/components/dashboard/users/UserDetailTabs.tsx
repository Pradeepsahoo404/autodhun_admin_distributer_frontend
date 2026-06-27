'use client';

import { cn } from '@/lib/utils';

export type UserDetailTab = 'general' | 'bank';

interface UserDetailTabsProps {
  active: UserDetailTab;
  onChange: (tab: UserDetailTab) => void;
}

const TABS: { id: UserDetailTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'bank', label: 'Bank Details' },
];

export function UserDetailTabs({ active, onChange }: UserDetailTabsProps) {
  return (
    <div className="flex gap-6 border-b border-[#1f1f1f]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            '-mb-px border-b-2 pb-3 text-[14px] font-medium transition-colors',
            active === tab.id
              ? 'border-brand-lime text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-300',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
