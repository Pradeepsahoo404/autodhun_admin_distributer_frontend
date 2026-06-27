import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'compact';
}

/** Lime primary CTA and dark secondary button — exact design tokens. */
export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ children, loading, variant = 'primary', size = 'default', className, disabled, ...props }, ref) => {
    const compact = size === 'compact';
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'flex w-full items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
          compact ? 'h-[46px] text-[14px]' : 'h-[52px] text-[15px]',
          variant === 'primary' &&
            'bg-brand-lime text-black shadow-[0_0_24px_rgba(163,255,18,0.22)] hover:bg-brand-lime-dark',
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
