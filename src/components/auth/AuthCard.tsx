import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AuthLogo } from './AuthLogo';
import { AuthHeading } from './AuthHeading';

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: ReactNode;
  className?: string;
  /** Tighter padding and spacing for taller forms. */
  compact?: boolean;
}

/** Dark rounded card shell for auth screens — logo, heading, and form content. */
export function AuthCard({ children, title, subtitle, className, compact }: AuthCardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-[#1f1f1f] bg-[#111111]',
        compact ? 'px-5 py-5 sm:px-7 sm:py-6' : 'px-6 py-8 sm:px-10 sm:py-10',
        className,
      )}
    >
      <div className={cn('flex justify-center', compact ? 'mb-4' : 'mb-8')}>
        <AuthLogo className={compact ? 'w-[min(168px,60vw)]' : undefined} />
      </div>

      {(title || subtitle) && (
        <div className={cn('text-center', compact ? 'mb-4' : 'mb-6')}>
          {title && (
            <AuthHeading className={cn('font-bold', compact ? 'text-[20px] sm:text-[22px]' : 'text-[22px] sm:text-[24px]')}>
              {title}
            </AuthHeading>
          )}
          {subtitle && (
            <p
              className={cn(
                'text-neutral-500',
                compact ? 'text-[13px] leading-snug' : 'text-[14px] leading-relaxed',
                title && 'mt-1.5',
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
