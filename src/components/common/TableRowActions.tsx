'use client';

import type { ReactNode } from 'react';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  tableIconButtonClass,
  tableIconButtonDangerClass,
} from '@/components/common/dashboardTableStyles';

interface TableRowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  leadingActions?: ReactNode;
  statusToggle?: {
    checked: boolean;
    disabled?: boolean;
    loading?: boolean;
    onCheckedChange: (checked: boolean) => void;
    ariaLabel: string;
    loadingAriaLabel?: string;
  };
}

export function TableRowActions({
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  leadingActions,
  statusToggle,
}: TableRowActionsProps) {
  const showEdit = canEdit && onEdit;
  const showDelete = canDelete && onDelete;

  if (!statusToggle && !showEdit && !showDelete && !leadingActions) return null;

  return (
    <div className="inline-flex items-center justify-end gap-1.5">
      {leadingActions}
      {statusToggle ? (
        <div className="flex h-6 w-11 items-center justify-center">
          {statusToggle.loading ? (
            <Loader2
              className="h-4 w-4 animate-spin text-brand-lime"
              aria-label={statusToggle.loadingAriaLabel ?? statusToggle.ariaLabel}
            />
          ) : (
            <Switch
              checked={statusToggle.checked}
              disabled={statusToggle.disabled}
              onCheckedChange={statusToggle.onCheckedChange}
              aria-label={statusToggle.ariaLabel}
            />
          )}
        </div>
      ) : null}
      {showEdit ? (
        <Button
          size="sm"
          variant="ghost"
          title="Edit"
          className={tableIconButtonClass}
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      ) : null}
      {showDelete ? (
        <Button
          size="sm"
          variant="ghost"
          title="Delete"
          className={tableIconButtonDangerClass}
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
