import { ROLES } from '@/constants';

export function isMasterAdminRole(role?: string | null): boolean {
  return role === ROLES.MASTER_ADMIN;
}

export function isSuperAdminRole(role?: string | null): boolean {
  return role === ROLES.SUPER_ADMIN;
}

/** Master or Super Admin — elevated panel access (Phase 2 bridge). */
export function isElevatedRole(role?: string | null): boolean {
  return isMasterAdminRole(role) || isSuperAdminRole(role);
}
