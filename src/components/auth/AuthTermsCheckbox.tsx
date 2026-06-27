import { cn } from '@/lib/utils';

interface AuthTermsCheckboxProps {
  variant?: 'login' | 'register';
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  loading?: boolean;
  className?: string;
  compact?: boolean;
}

/** Terms / privacy agreement with required checkbox. */
export function AuthTermsCheckbox({
  variant = 'login',
  checked,
  onChange,
  error,
  loading,
  compact,
  className,
}: AuthTermsCheckboxProps) {
  const id = variant === 'register' ? 'terms-register' : 'terms-login';

  return (
    <div className={cn('w-full text-center', className)}>
      <label
        htmlFor={id}
        className={cn(
          'mx-auto inline-flex cursor-pointer items-start gap-2.5 text-left',
          compact ? 'max-w-none' : 'max-w-[380px]',
          loading && 'pointer-events-none opacity-60',
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={loading}
          onChange={(e) => onChange(e.target.checked)}
          className={cn(
            'shrink-0 cursor-pointer rounded border border-neutral-600 bg-[#161616] accent-[#A3FF12] disabled:cursor-not-allowed',
            compact ? 'mt-0.5 h-4 w-4' : 'mt-1 h-[18px] w-[18px]',
          )}
        />
        <span className={cn('text-neutral-500', compact ? 'text-[12px] leading-snug' : 'text-[14px] leading-relaxed')}>
          {variant === 'register' ? (
            <>
              By signing up, I agree to the{' '}
              <a href="#" className="font-medium text-brand-lime hover:underline" onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </a>
              .
            </>
          ) : (
            <>
              By logging in, you agree to our{' '}
              <a href="#" className="text-blue-400 underline" onClick={(e) => e.stopPropagation()}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 underline" onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </a>
              .
            </>
          )}
        </span>
      </label>
      {loading && <p className="mt-2 text-center text-xs text-neutral-500">Saving your agreement…</p>}
      {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
