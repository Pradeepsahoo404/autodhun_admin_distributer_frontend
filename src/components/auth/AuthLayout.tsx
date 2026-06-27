import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  /** Wider card for multi-field forms (register, reset password). */
  wide?: boolean;
}

/** Centered auth shell on a pure black canvas. */
export function AuthLayout({ children, wide }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black px-4 py-4 font-sans sm:px-6 sm:py-6">
      <div className={cn('w-full animate-fade-up', wide ? 'max-w-[580px]' : 'max-w-[480px]')}>{children}</div>
    </div>
  );
}
