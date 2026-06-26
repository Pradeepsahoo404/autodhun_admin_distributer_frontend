import { cn } from '@/lib/utils';

interface AuthHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
}

/** Auth page headings with the shared drop-shadow and balance styles. */
export function AuthHeading({ children, className, as: Tag = 'h1' }: AuthHeadingProps) {
  return (
    <Tag
      className={cn(
        'block whitespace-normal text-balance text-center text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]',
        'font-sans text-[28px] font-bold leading-tight tracking-tight sm:text-[32px] lg:text-[36px]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
