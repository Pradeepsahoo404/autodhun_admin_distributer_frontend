'use client';

import { useMemo } from 'react';
import {
  dashboardTableBodyClass,
  dashboardTableCellCenter,
  dashboardTableCellPrimary,
  dashboardTableClass,
  dashboardTableHeadClassCenter,
  dashboardTableHeadRowClass,
  dashboardTableRowClass,
  dashboardTableWrapperClass,
  groupBadgeClass,
} from '@/components/common/dashboardTableStyles';
import { cn } from '@/lib/utils';

export type SubAdminPermissionAction = 'canView' | 'canCreate' | 'canUpdate' | 'canDelete';

export interface SubAdminPermissionRow {
  moduleId: string;
  name: string;
  slug: string;
  group: string;
  order: number;
}

export type SubAdminPermissionsMatrixState = Record<
  string,
  Record<SubAdminPermissionAction, boolean>
>;

const ACTIONS: { key: SubAdminPermissionAction; label: string }[] = [
  { key: 'canView', label: 'View' },
  { key: 'canCreate', label: 'Create' },
  { key: 'canUpdate', label: 'Update' },
  { key: 'canDelete', label: 'Delete' },
];

interface SubAdminPermissionsMatrixProps {
  rows: SubAdminPermissionRow[];
  matrix: SubAdminPermissionsMatrixState;
  onChange: (next: SubAdminPermissionsMatrixState) => void;
  disabled?: boolean;
  fullHeight?: boolean;
  error?: string;
}

export function buildDefaultSubAdminMatrix(
  rows: SubAdminPermissionRow[],
  existing?: SubAdminPermissionsMatrixState,
): SubAdminPermissionsMatrixState {
  const next: SubAdminPermissionsMatrixState = {};
  for (const row of rows) {
    const current = existing?.[row.moduleId];
    const defaultView = row.slug === 'dashboard';
    next[row.moduleId] = {
      canView: current?.canView ?? defaultView,
      canCreate: current?.canCreate ?? false,
      canUpdate: current?.canUpdate ?? false,
      canDelete: current?.canDelete ?? false,
    };
  }
  return next;
}

export function matrixToPermissionPayload(matrix: SubAdminPermissionsMatrixState) {
  return Object.entries(matrix)
    .filter(([, perms]) => perms.canView || perms.canCreate || perms.canUpdate || perms.canDelete)
    .map(([moduleId, perms]) => ({ moduleId, ...perms }));
}

export function SubAdminPermissionsMatrix({
  rows,
  matrix,
  onChange,
  disabled = false,
  fullHeight = false,
  error,
}: SubAdminPermissionsMatrixProps) {
  const sortedRows = useMemo(
    () => rows.slice().sort((a, b) => a.order - b.order),
    [rows],
  );

  const toggle = (moduleId: string, action: SubAdminPermissionAction) => {
    if (disabled) return;

    const current = matrix[moduleId] ?? {
      canView: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    };
    const row = { ...current, [action]: !current[action] };

    if (action === 'canView' && !row.canView) {
      row.canCreate = false;
      row.canUpdate = false;
      row.canDelete = false;
    }
    if (action !== 'canView' && row[action]) {
      row.canView = true;
    }

    onChange({ ...matrix, [moduleId]: row });
  };

  if (sortedRows.length === 0) {
    return <p className="text-sm text-neutral-500">No modules available for permission assignment.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-400">
        Assign module access for this Sub Admin. Dashboard View is recommended.
      </p>
      <div className={dashboardTableWrapperClass()}>
        <div className={fullHeight ? 'overflow-x-auto' : 'max-h-[280px] overflow-auto'}>
          <table className={cn(dashboardTableClass, 'min-w-[520px]')}>
            <thead className={dashboardTableHeadClassCenter}>
              <tr className={dashboardTableHeadRowClass}>
                <th>Module</th>
                {ACTIONS.map((action) => (
                  <th key={action.key}>{action.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className={dashboardTableBodyClass}>
              {sortedRows.map((mod) => (
                <tr key={mod.moduleId} className={dashboardTableRowClass}>
                  <td className={dashboardTableCellPrimary}>
                    {mod.name}
                    {mod.group === 'management' ? (
                      <span className={groupBadgeClass}>admin</span>
                    ) : null}
                  </td>
                  {ACTIONS.map((action) => {
                    const checked = matrix[mod.moduleId]?.[action.key] ?? false;
                    return (
                      <td key={action.key} className={dashboardTableCellCenter}>
                        <button
                          type="button"
                          onClick={() => toggle(mod.moduleId, action.key)}
                          disabled={disabled}
                          className={cn(
                            'inline-flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition-colors',
                            checked
                              ? 'border-brand-lime/40 bg-brand-lime/15 text-brand-lime shadow-[0_0_10px_rgba(163,255,0,0.12)]'
                              : 'border-[#2a2a2a] bg-[#0d0d0d] text-neutral-700',
                            disabled
                              ? 'cursor-not-allowed opacity-70'
                              : 'cursor-pointer hover:border-brand-lime/30 hover:bg-[#141414]',
                          )}
                          aria-label={`${mod.name} ${action.label}`}
                        >
                          {checked ? '✓' : ''}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
