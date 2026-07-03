import { cn } from '@/lib/utils';

interface ReleaseFormRowProps {
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** Full-width form field row — label on top, control below. */
export function ReleaseFormRow({ label, description, required, children, className }: ReleaseFormRowProps) {
  return (
    <div className={cn('space-y-2 py-4', className)}>
      <div>
        <p className="text-[14px] font-medium text-neutral-300">
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
        </p>
        {description ? <p className="mt-0.5 text-[12px] text-neutral-600">{description}</p> : null}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

interface ReleaseFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ReleaseFormSection({ title, description, children, className }: ReleaseFormSectionProps) {
  return (
    <section className={cn('border-b border-[#1a1a1a] last:border-b-0', className)}>
      <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]/50 px-5 py-4 sm:px-8">
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>
        {description ? <p className="mt-1 text-[13px] text-neutral-500">{description}</p> : null}
      </div>
      <div className="divide-y divide-[#141414] px-5 sm:px-8">{children}</div>
    </section>
  );
}

interface ReleaseFormGridProps {
  children: React.ReactNode;
  className?: string;
}

/** Two-column grid for pairing related fields on larger screens. */
export function ReleaseFormGrid({ children, className }: ReleaseFormGridProps) {
  return <div className={cn('grid gap-0 sm:grid-cols-2 sm:gap-x-8', className)}>{children}</div>;
}

/** Three-column grid for yes/no option groups on larger screens. */
export function ReleaseFormGrid3({ children, className }: ReleaseFormGridProps) {
  return (
    <div className={cn('grid gap-0 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6', className)}>{children}</div>
  );
}
