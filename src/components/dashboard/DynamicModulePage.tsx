'use client';

import { usePathname } from 'next/navigation';
import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder';
import { MODULE_PAGES } from '@/config/modulePages';

export function DynamicModulePage() {
  const pathname = usePathname();
  const config = MODULE_PAGES[pathname];

  if (!config) {
    return (
      <div className="px-5 py-6 lg:px-8">
        <p className="text-sm text-neutral-500">Module page not found.</p>
      </div>
    );
  }

  return (
    <ModulePlaceholder
      slug={config.slug}
      title={config.title}
      description={config.description}
      icon={config.icon}
    />
  );
}
