'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  className?: string;
}

/**
 * Renders the user's profile photo when available, otherwise initials.
 * Falls back to initials if the remote image fails to load.
 */
export function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U';

  const showImage = Boolean(avatarUrl?.trim()) && !imageFailed;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        role="presentation"
        className={cn('h-full w-full shrink-0 rounded-full object-cover', className)}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-full shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-lime font-bold text-black',
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
