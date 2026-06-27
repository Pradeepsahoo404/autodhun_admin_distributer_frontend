'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, LogOut, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { useGetSidebarQuery, useLogoutMutation } from '@/store/api';
import { setSidebarModules } from '@/store/slices/permissionSlice';
import { logout } from '@/store/slices/authSlice';
import { getModuleIcon } from '@/utils/icons';
import { buildModuleTree, isModuleBranchOpen, isNavItemActive, type ModuleNavNode } from '@/utils/moduleTree';
import { SidebarLogo } from './SidebarLogo';
// import { EditableProfileAvatar } from './EditableProfileAvatar';
import { ROUTES, DASHBOARD_SIDEBAR_WIDTH, HEADER_ONLY_MODULE_SLUGS } from '@/constants';

interface SidebarProps {
  desktopOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// const formatRole = (role?: string): string =>
//   role
//     ? role
//         .split('-')
//         .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//         .join(' ')
//     : '';

export function Sidebar({ desktopOpen, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const { user } = useAppSelector((s) => s.auth);
  const { sidebarModules } = useAppSelector((s) => s.permission);

  const { data: sidebarData, isSuccess } = useGetSidebarQuery();
  // const { data: dashboardData } = useGetDashboardQuery();
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess && sidebarData?.data) {
      dispatch(setSidebarModules(sidebarData.data));
    }
  }, [isSuccess, sidebarData, dispatch]);

  const modules = sidebarModules.length > 0 ? sidebarModules : sidebarData?.data ?? [];
  const headerOnlySlugs = new Set<string>(HEADER_ONLY_MODULE_SLUGS);
  const navModules = modules.filter((m) => !headerOnlySlugs.has(m.slug));
  const mainModules = buildModuleTree(navModules.filter((m) => m.group !== 'management'));
  const managementModules = buildModuleTree(navModules.filter((m) => m.group === 'management'));

  // const earnings = dashboardData?.data.earnings ?? 0;
  // const currency = dashboardData?.data.currency === 'INR' ? '₹' : '$';
  // const roleLabel = formatRole(user?.role);
  // const showRole = roleLabel && roleLabel !== (user?.name ?? 'User');

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // local logout regardless
    }
    dispatch(logout());
    toast.success('Logged out');
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onMobileClose} aria-hidden />
      )}

      <aside
        className={cn(
          'font-sans z-50 flex h-full shrink-0 flex-col border-r border-[#1a1a1a] bg-[#080808] transition-all duration-300 ease-in-out',
          DASHBOARD_SIDEBAR_WIDTH,
          'fixed inset-y-0 left-0 lg:relative lg:inset-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          desktopOpen
            ? 'lg:translate-x-0'
            : 'lg:w-0 lg:min-w-0 lg:max-w-0 lg:overflow-hidden lg:border-r-0 lg:opacity-0 lg:pointer-events-none',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-center border-b border-[#141414] px-4 lg:h-16">
          <SidebarLogo />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Profile card — hidden for all roles (restore by uncommenting block below)
          <div className="px-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#1a1a1a] to-[#101010] px-3 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.35)]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-lime/[0.07] via-transparent to-brand-purple/[0.1]" />
              <div className="relative">
                <EditableProfileAvatar />
                <p className="truncate text-[14px] font-semibold text-white">{user?.name ?? 'User'}</p>
                {showRole ? <p className="mt-0.5 truncate text-[12px] text-neutral-500">{roleLabel}</p> : null}
              </div>
            </div>
          </div>
          */}

          {/* Earnings — hidden for all roles (restore by uncommenting block below)
          <div className="px-3 pt-4">
            <p className="px-1 pb-2 text-[10px] font-semibold tracking-[0.14em] text-neutral-600">EARNINGS</p>
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-gradient-to-r from-[#161616] to-[#121212] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-lime/15 text-sm font-bold text-brand-lime">
                  {currency}
                </div>
                <span className="text-[15px] font-bold text-white">
                  {currency}
                  {earnings}
                </span>
              </div>
              <Info className="h-3.5 w-3.5 text-neutral-600" />
            </div>
          </div>
          */}

          <nav className="mt-3 space-y-0.5 px-3 pb-3 pt-3">
            <p className="px-2 pb-2 text-[11px] font-semibold tracking-[0.14em] text-neutral-600">DASHBOARD</p>
            {mainModules.map((mod) => (
              <NavBranch key={mod.slug} node={mod} pathname={pathname} onMobileClose={onMobileClose} depth={0} />
            ))}

            {managementModules.length > 0 && (
              <>
                <p className="px-2 pb-2 pt-5 text-[11px] font-semibold tracking-[0.14em] text-neutral-600">MANAGEMENT</p>
                {managementModules.map((mod) => (
                  <NavBranch key={mod.slug} node={mod} pathname={pathname} onMobileClose={onMobileClose} depth={0} />
                ))}
              </>
            )}
          </nav>
        </div>

        <div className="shrink-0 px-3 pb-3">
          <div className="rounded-xl border border-brand-lime/20 bg-gradient-to-br from-brand-lime/10 to-transparent p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <Crown className="h-3.5 w-3.5 text-brand-lime" />
              <span className="text-[13px] font-semibold text-white">Upgrade to Pro</span>
            </div>
            <p className="mb-2.5 text-[11px] leading-relaxed text-neutral-500">
              Unlock playlist pitching, publishing and more.
            </p>
            <button className="w-full rounded-lg bg-brand-lime py-2 text-[12px] font-semibold text-black transition-colors hover:bg-brand-lime-dark">
              Upgrade Now
            </button>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#1a1a1a] px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium text-neutral-400 transition-colors hover:bg-[#141414] hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

interface NavBranchProps {
  node: ModuleNavNode;
  pathname: string;
  onMobileClose: () => void;
  depth: number;
}

function NavBranch({ node, pathname, onMobileClose, depth }: NavBranchProps) {
  const hasChildren = node.children.length > 0;
  const branchOpen = isModuleBranchOpen(node, pathname);
  const [expanded, setExpanded] = useState(branchOpen);

  useEffect(() => {
    if (branchOpen) setExpanded(true);
  }, [branchOpen]);

  if (!hasChildren) {
    return <NavLink mod={node} pathname={pathname} onMobileClose={onMobileClose} depth={depth} />;
  }

  const Icon = getModuleIcon(node.icon);
  const indent = 10 + depth * 12;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          'group relative flex w-full items-center gap-2.5 rounded-lg py-2.5 text-[13px] font-medium transition-colors',
          expanded ? 'text-white' : 'text-neutral-400 hover:bg-[#141414] hover:text-white',
        )}
        style={{ paddingLeft: `${indent}px`, paddingRight: '10px' }}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 truncate text-left leading-snug">{node.name}</span>
        {node.isPro && (
          <span className="flex shrink-0 items-center gap-0.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-400">
            <Zap className="h-2.5 w-2.5" />
            PRO
          </span>
        )}
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', expanded && 'rotate-180')} />
      </button>
      {expanded && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <NavBranch key={child.slug} node={child} pathname={pathname} onMobileClose={onMobileClose} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface NavLinkProps {
  mod: ModuleNavNode;
  pathname: string;
  onMobileClose: () => void;
  depth: number;
}

function NavLink({ mod, pathname, onMobileClose, depth }: NavLinkProps) {
  const Icon = getModuleIcon(mod.icon);
  const active = isNavItemActive(mod, pathname);
  const indent = 10 + depth * 12;

  return (
    <Link
      href={mod.route}
      onClick={() => {
        if (window.matchMedia('(max-width: 1023px)').matches) {
          onMobileClose();
        }
      }}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-lg py-2.5 text-[13px] font-medium transition-colors',
        active ? 'bg-brand-lime/10 text-brand-lime' : 'text-neutral-400 hover:bg-[#141414] hover:text-white',
      )}
      style={{ paddingLeft: `${indent}px`, paddingRight: '10px' }}
    >
      {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-lime" />}
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1 truncate leading-snug">{mod.name}</span>
      {mod.isPro && (
        <span className="flex shrink-0 items-center gap-0.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-400">
          <Zap className="h-2.5 w-2.5" />
          PRO
        </span>
      )}
      {!mod.isPro && !active && (
        <ChevronRight className="h-4 w-4 shrink-0 text-neutral-700 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </Link>
  );
}
