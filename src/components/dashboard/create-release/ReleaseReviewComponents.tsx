import { cn } from '@/lib/utils';

export function ReviewBadge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'lime' | 'outline' | 'warning';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
        variant === 'lime' && 'bg-brand-lime/15 text-brand-lime',
        variant === 'outline' && 'border border-[#333] bg-transparent text-neutral-400',
        variant === 'warning' && 'border border-amber-500/30 bg-amber-500/10 text-amber-400',
        variant === 'default' && 'bg-[#1a1a1a] text-neutral-300',
      )}
    >
      {children}
    </span>
  );
}

export function ReviewField({
  label,
  value,
  empty = '—',
}: {
  label: string;
  value?: string | null;
  empty?: string;
}) {
  const display = value?.trim() ? value : empty;
  const isEmpty = !value?.trim();
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600">{label}</p>
      <p className={cn('text-[14px] leading-snug', isEmpty ? 'text-neutral-600' : 'text-white')}>{display}</p>
    </div>
  );
}

export function ReviewCard({
  title,
  description,
  children,
  className,
  icon,
  flushBody,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  flushBody?: boolean;
}) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a]', className)}>
      <div className="flex items-center gap-2.5 border-b border-[#1a1a1a] bg-[#0d0d0d]/80 px-5 py-4 sm:px-6">
        {icon ? <span className="text-brand-lime">{icon}</span> : null}
        <div>
          <h4 className="text-[14px] font-semibold text-white">{title}</h4>
          {description ? <p className="mt-0.5 text-[12px] text-neutral-500">{description}</p> : null}
        </div>
      </div>
      <div className={cn(!flushBody && 'p-5 sm:p-6')}>{children}</div>
    </div>
  );
}

export function ReviewGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  return (
    <div
      className={cn(
        'grid gap-5',
        cols === 2 && 'sm:grid-cols-2',
        cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        cols === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
      )}
    >
      {children}
    </div>
  );
}

export function ReviewMetaStrip({ items }: { items: { label: string; value?: string | null }[] }) {
  const visible = items.filter((i) => i.value?.trim());
  if (visible.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#1a1a1a] pt-4">
      {visible.map((item) => (
        <div key={item.label}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-600">{item.label}</p>
          <p className="mt-0.5 text-[13px] font-medium text-neutral-300">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
