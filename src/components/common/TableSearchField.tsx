'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tableControlClass } from '@/components/common/tableControls';

interface TableSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableSearchField({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: TableSearchFieldProps) {
  return (
    <div className={cn('relative min-w-[260px]', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(tableControlClass, 'w-full pl-10 pr-4')}
      />
    </div>
  );
}
