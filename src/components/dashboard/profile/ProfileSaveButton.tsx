import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSaveButtonProps {
  loading?: boolean;
  label?: string;
  className?: string;
}

export function ProfileSaveButton({ loading, label = 'Save changes', className }: ProfileSaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-xl bg-brand-lime px-6 text-[14px] font-semibold text-black transition-colors',
        'hover:bg-brand-lime-dark disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </button>
  );
}
