import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

/** Lime primary CTA and dark secondary button — exact design tokens. */
export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ children, loading, variant = 'primary', className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'flex h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'primary' && 'bg-brand-lime text-black hover:bg-brand-lime-dark',
          variant === 'secondary' &&
            'border border-neutral-800 bg-[#141414] text-white hover:border-neutral-600 hover:bg-[#1a1a1a]',
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
      </button>
    );
  },
);
AuthButton.displayName = 'AuthButton';
