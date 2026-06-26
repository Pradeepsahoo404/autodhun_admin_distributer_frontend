'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut, User, KeyRound, LockKeyhole } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { useAuthAccount } from '@/hooks/useAuthAccount';
import { useLogoutMutation } from '@/store/api';
import { logout } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants';

const menuIconClass = 'h-4 w-4 shrink-0 text-white';

const menuRowClass = 'flex items-center gap-2.5 px-4 min-w-0';

const menuItemClass = cn(
  menuRowClass,
  'py-2.5 text-[14px] font-normal text-white transition-colors hover:bg-[#252525] focus-visible:bg-[#252525] focus-visible:outline-none',
);

export function ProfileMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { canManagePassword } = useAuthAccount();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logoutApi().unwrap();
    } catch {
      // local logout regardless
    }
    dispatch(logout());
    toast.success('Logged out');
    router.push(ROUTES.LOGIN);
  };

  const closeMenu = () => setOpen(false);

  return (    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full ring-offset-2 ring-offset-brand-black transition-shadow hover:ring-2 hover:ring-brand-lime/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime/50"
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar
          name={user?.name}
          avatarUrl={user?.avatarUrl}
          className="h-9 w-9 text-xs sm:h-10 sm:w-10 sm:text-sm"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[220px] overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] font-sans shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
        >
          <span
            className="absolute -top-[6px] right-4 h-3 w-3 rotate-45 border-l border-t border-[#2a2a2a] bg-[#1a1a1a]"
            aria-hidden
          />

          <div className={cn(menuRowClass, 'border-b border-[#2a2a2a] py-3')}>
            <User className={menuIconClass} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-normal text-white">{user?.name ?? 'User'}</p>
              <p className="mt-0.5 truncate text-[13px] text-neutral-500">{user?.email}</p>
            </div>
          </div>

          <div className="py-1.5">
            <ProfileMenuLink href={ROUTES.PROFILE} onClick={closeMenu} icon={<User className={menuIconClass} />}>
              Profile
            </ProfileMenuLink>
            {canManagePassword ? (
              <>
                <ProfileMenuLink
                  href={ROUTES.CHANGE_PASSWORD}
                  onClick={closeMenu}
                  icon={<KeyRound className={menuIconClass} />}
                >
                  Change Password
                </ProfileMenuLink>
                <ProfileMenuLink
                  href={ROUTES.PROFILE_FORGOT_PASSWORD}
                  onClick={closeMenu}
                  icon={<LockKeyhole className={menuIconClass} />}
                >
                  Forgot Password
                </ProfileMenuLink>
              </>
            ) : null}
          </div>
          <div className="border-t border-[#2a2a2a] py-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleLogout()}
              className={cn(
                menuItemClass,
                'flex w-full items-center gap-2.5 text-left hover:bg-red-500/10 hover:text-red-400 focus-visible:bg-red-500/10 focus-visible:text-red-400',
              )}
            >
              <LogOut className={menuIconClass} />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileMenuLink({
  href,
  onClick,
  icon,
  children,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} role="menuitem" onClick={onClick} className={menuItemClass}>
      {icon}
      {children}
    </Link>
  );
}
