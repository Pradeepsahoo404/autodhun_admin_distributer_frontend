import { cn } from '@/lib/utils';
import { BRAND_LOGO } from '@/constants';

interface AuthLogoProps {
  className?: string;
  src?: string;
}

/** Autodhun brand logo — centered above auth forms. */
export function AuthLogo({ className, src = BRAND_LOGO }: AuthLogoProps) {
  return (
    <img
      src={src}
      alt="Autodhun"
      width={200}
      height={36}
      loading="eager"
      decoding="async"
      className={cn('h-auto w-[min(200px,72vw)] max-w-full object-contain', className)}
    />
  );
}
