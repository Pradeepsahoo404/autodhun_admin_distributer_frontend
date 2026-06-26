'use client';

import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getModuleIcon } from '@/utils/icons';
import { DASHBOARD_CARD } from '@/constants';
import { cn } from '@/lib/utils';
import type { Module } from '@/types';

interface ModuleCardProps {
  module: Module;
  canDelete: boolean;
  onDelete: (module: Module) => void;
}

export function ModuleCard({ module, canDelete, onDelete }: ModuleCardProps) {
  const Icon = getModuleIcon(module.icon);

  return (
    <Card className={cn(DASHBOARD_CARD, 'group relative border-[#222222] transition-colors hover:border-[#2f2f2f]')}>
      <CardContent className="flex items-center gap-4 px-5 py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-lime/10">
          <Icon className="h-5 w-5 text-brand-lime" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-white">{module.name}</p>
          <p className="truncate text-[13px] text-neutral-500">{module.route}</p>
        </div>

        <div className="relative flex h-8 shrink-0 items-center">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[12px] font-medium transition-opacity',
              module.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400',
              canDelete && 'group-hover:opacity-0',
            )}
          >
            {module.isActive ? 'Active' : 'Inactive'}
          </span>

          {canDelete ? (
            <div className="absolute inset-0 flex items-center justify-end opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="sm"
                variant="ghost"
                title="Delete module"
                className="h-8 w-8 bg-[#1a1a1a] p-0 text-neutral-400 hover:text-red-400"
                onClick={() => onDelete(module)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
