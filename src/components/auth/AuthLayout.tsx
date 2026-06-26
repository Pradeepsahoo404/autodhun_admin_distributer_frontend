import { ReactNode } from 'react';
import { AuthLogo } from './AuthLogo';

interface AuthLayoutProps {
  children: ReactNode;
}

/** Centered auth shell — logo + form vertically and horizontally centered. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black font-sans px-5 py-8 sm:px-8">
      <div className="flex w-full max-w-[600px] flex-col items-center justify-center animate-fade-up">
        <div className="mb-8 flex w-full justify-center sm:mb-10">
          <AuthLogo />
        </div>
        <div className="flex w-full flex-col items-center text-center">{children}</div>
      </div>
    </div>
  );
}
