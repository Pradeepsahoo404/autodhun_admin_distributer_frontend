import { ALL_MODULE_ROUTES as MODULE_ROUTE_CATALOG } from '@/config/modulePages';



export const ROUTES = {

  LOGIN: '/login',

  REGISTER: '/register',

  VERIFY_REGISTER: '/verify-otp',

  VERIFY_LOGIN: '/verify-login-otp',

  FORGOT_PASSWORD: '/forgot-password',

  RESET_PASSWORD: '/reset-password',

  DASHBOARD: '/dashboard',

  SETTINGS: '/dashboard/settings',

  PROFILE: '/dashboard/profile',

  PROFILE_BANK_DETAILS: '/dashboard/profile/bank-details',

  CHANGE_PASSWORD: '/dashboard/profile/change-password',

  PROFILE_FORGOT_PASSWORD: '/dashboard/profile/forgot-password',

} as const;



export const OTP_PURPOSE = {

  REGISTER: 'REGISTER',

  LOGIN: 'LOGIN',

  FORGOT_PASSWORD: 'FORGOT_PASSWORD',

} as const;



export type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];



export const ROLES = {

  SUPER_ADMIN: 'super-admin',

  ADMIN: 'admin',

} as const;



export const TOKEN_STORAGE_KEY = 'autodhun_access_token';

export const OTP_LENGTH = 6;

/** Root modules that use header UI instead of the sidebar nav (still in permission matrix). */
export const HEADER_ONLY_MODULE_SLUGS = ['notifications'] as const;



/** Brand logo served from `public/autodhun-logo.webp`. */

export const BRAND_LOGO = '/autodhun-logo.webp';



/**

 * Static catalog of all module routes -> slug. Used by the client-side route

 * guard to detect when a user manually navigates to a module page they do not

 * have `canView` permission for.

 */

export const ALL_MODULE_ROUTES: Array<{ route: string; slug: string }> = [

  { route: '/dashboard', slug: 'dashboard' },

  ...MODULE_ROUTE_CATALOG,

  { route: '/dashboard/analytics', slug: 'analytics' },

  { route: '/dashboard/settings', slug: 'settings' },

  { route: '/dashboard/profile', slug: 'settings' },

  { route: '/dashboard/help-support', slug: 'help-support' },

  { route: '/dashboard/users', slug: 'users' },

  { route: '/dashboard/roles', slug: 'roles' },

  { route: '/dashboard/modules', slug: 'modules' },

  { route: '/dashboard/permissions', slug: 'permissions' },

];



export const UNAUTHORIZED_ROUTE = '/unauthorized';

export {
  DASHBOARD_SIDEBAR_WIDTH,
  DASHBOARD_PAGE,
  DASHBOARD_PAGE_TITLE,
  PROFILE_PAGE_TITLE,
  DASHBOARD_PAGE_SUBTITLE,
  DASHBOARD_CARD,
} from './dashboardLayout';

