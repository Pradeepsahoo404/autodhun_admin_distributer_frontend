'use client';

import { useRef } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useAppSelector } from '@/hooks/useAppStore';
import { useUpdateAvatarMutation } from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const AVATAR_SIZE = 'h-[88px] w-[88px]';

export function EditableProfileAvatar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAppSelector((s) => s.auth);
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error('Image must be under 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await updateAvatar(formData).unwrap();
      toast.success('Profile photo updated');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className={cn('relative mx-auto mb-3', AVATAR_SIZE)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className={cn(
          'group relative overflow-hidden rounded-full p-[3px]',
          'bg-gradient-to-br from-brand-lime/80 via-brand-lime/40 to-brand-purple/70',
          'shadow-[0_0_24px_rgba(163,255,18,0.15)] transition-all duration-300',
          'hover:shadow-[0_0_28px_rgba(163,255,18,0.28)] disabled:cursor-wait',
          AVATAR_SIZE,
        )}
        aria-label="Edit profile photo"
        title="Edit profile photo"
      >
        <span className={cn('relative block overflow-hidden rounded-full bg-[#0b0b0b]', 'h-[82px] w-[82px]')}>
          <UserAvatar
            key={user?.avatarUrl ?? 'initials'}
            name={user?.name}
            avatarUrl={user?.avatarUrl}
            className="h-full w-full text-xl"
          />

          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px] transition-opacity',
              isLoading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-brand-lime" />
            ) : (
              <Pencil className="h-5 w-5 text-white drop-shadow" />
            )}
          </span>
        </span>
      </button>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
