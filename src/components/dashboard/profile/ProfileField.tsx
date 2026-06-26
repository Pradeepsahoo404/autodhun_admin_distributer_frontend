import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { PasswordInput } from '@/components/common/PasswordInput';

interface ProfileFieldProps {
  label: string;
  value?: string;
  className?: string;
}

/** Read-only profile field styled for the account settings cards. */
export function ProfileField({ label, value, className }: ProfileFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-[13px] font-medium text-neutral-400">{label}</label>
      <div className="flex h-11 items-center rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4 text-[14px] text-white">
        {value || '—'}
      </div>
    </div>
  );
}

interface ProfileTextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

/** Multi-line profile field styled for account settings cards. */
export function ProfileTextareaField({ label, error, className, id, ...props }: ProfileTextareaFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={fieldId} className="text-[13px] font-medium text-neutral-400">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={3}
        className={cn(
          'flex w-full resize-none rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4 py-3 text-[14px] text-white outline-none transition-colors',
          'placeholder:text-neutral-600 focus:border-brand-lime/40 focus:ring-1 focus:ring-brand-lime/20',
          error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
        )}
        {...props}
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

interface ProfileInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const profileInputClass = (error?: string) =>
  cn(
    'flex h-11 w-full rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4 text-[14px] text-white outline-none transition-colors',
    'placeholder:text-neutral-600 focus:border-brand-lime/40 focus:ring-1 focus:ring-brand-lime/20',
    error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
  );

/** Editable profile field styled for the account settings cards. Password fields include show/hide toggle. */
export const ProfileInputField = forwardRef<HTMLInputElement, ProfileInputFieldProps>(
  ({ label, error, className, id, type, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const inputClassName = profileInputClass(error);

    return (
      <div className={cn('space-y-2', className)}>
        <label htmlFor={fieldId} className="text-[13px] font-medium text-neutral-400">
          {label}
        </label>
        {type === 'password' ? (
          <PasswordInput id={fieldId} ref={ref} inputClassName={inputClassName} {...props} />
        ) : (
          <input id={fieldId} ref={ref} type={type} className={inputClassName} {...props} />
        )}
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
      </div>
    );
  },
);
ProfileInputField.displayName = 'ProfileInputField';
