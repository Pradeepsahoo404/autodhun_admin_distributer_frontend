import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'apple' | 'email';
  loading?: boolean;
}

const icons = {
  google: (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  ),
  apple: (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="white" aria-hidden>
      <path d="M13.2 9.6c-.02-2.2 1.8-3.26 1.88-3.32-1.02-1.5-2.62-1.7-3.18-1.72-1.36-.14-2.66.8-3.34.8-.7 0-1.76-.78-2.9-.76-1.5.02-2.88.87-3.66 2.2-1.56 2.7-.4 6.7 1.12 8.9.74 1.08 1.62 2.28 2.78 2.24 1.12-.04 1.54-.72 2.9-.72 1.34 0 1.72.72 2.9.7 1.2-.02 1.96-1.1 2.68-2.18.84-1.24 1.2-2.44 1.22-2.5-.02-.02-2.34-.9-2.36-3.56zM10.8 2.9c.62-.76 1.04-1.82.92-2.88-.9.04-1.98.6-2.62 1.36-.58.66-1.08 1.74-.94 2.76 1 .08 2.02-.5 2.64-1.24z" />
    </svg>
  ),
  email: (
    <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden>
      <rect x="1" y="1" width="16" height="12" rx="2" stroke="#A3FF12" strokeWidth="1.5" fill="none" />
      <path d="M1 3l8 5 8-5" stroke="#A3FF12" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ provider, loading, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-[#141414] text-[15px] font-medium text-white transition-all duration-200 hover:border-neutral-600 hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icons[provider]}
      {children}
    </button>
  ),
);
SocialButton.displayName = 'SocialButton';
