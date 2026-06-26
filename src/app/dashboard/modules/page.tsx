'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteModuleMutation, useGetModulesQuery } from '@/store/api';
import { usePermission } from '@/hooks/usePermission';
import { getApiErrorMessage } from '@/services/apiClient';
import { DASHBOARD_PAGE, DASHBOARD_CARD } from '@/constants';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { TableSearchField } from '@/components/common/TableSearchField';
import { ModuleCard } from '@/components/dashboard/modules/ModuleCard';
import { DeleteModuleDialog } from '@/components/dashboard/modules/DeleteModuleDialog';
import { cn } from '@/lib/utils';
import type { Module } from '@/types';

export default function ModulesPage() {
  const { canDelete } = usePermission('modules');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [deleteModule, setDeleteModule] = useState<Module | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      rootsOnly: true,
      ...(search ? { search } : {}),
    }),
    [search],
  );

  const { data, isLoading, isFetching } = useGetModulesQuery(queryParams);
  const [deleteModuleApi, { isLoading: deleting }] = useDeleteModuleMutation();

  const modules = data?.data ?? [];

  const handleDeleteConfirm = async () => {
    if (!deleteModule) return;
    try {
      await deleteModuleApi(deleteModule._id).unwrap();
      toast.success('Module and related permissions deleted');
      setDeleteModule(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn(DASHBOARD_PAGE, 'space-y-8')}>
      <DashboardPageHeader
        title="Modules"
        description="Main application modules. Sub-modules inherit access from their parent automatically."
      />

      <Card className="border-[#1a1a1a] bg-[#111111]">
        <CardHeader className="space-y-4 border-b border-[#1a1a1a] pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-white">All modules</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <TableSearchField
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search by name, slug, or route..."
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className={cn(DASHBOARD_CARD, 'h-28 animate-pulse border-[#222222]')} />
              ))}
            </div>
          ) : modules.length === 0 ? (
            <p className="py-10 text-center text-neutral-500">No modules found.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {modules.map((mod) => (
                <ModuleCard
                  key={mod._id}
                  module={mod}
                  canDelete={canDelete}
                  onDelete={setDeleteModule}
                />
              ))}
            </div>
          )}
          {isFetching && !isLoading ? (
            <p className="mt-4 text-center text-xs text-neutral-600">Updating...</p>
          ) : null}
        </CardContent>
      </Card>

      <DeleteModuleDialog
        open={Boolean(deleteModule)}
        module={deleteModule}
        loading={deleting}
        onClose={() => setDeleteModule(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
