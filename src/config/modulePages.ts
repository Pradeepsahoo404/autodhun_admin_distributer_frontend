export interface ModulePageDef {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const MODULE_PAGES: Record<string, ModulePageDef> = {
  '/dashboard/active-accounts/active': {
    slug: 'active-account',
    title: 'Active Account',
    description: 'Manage active platform accounts',
    icon: 'UserCheck',
  },
  '/dashboard/active-accounts/deactive': {
    slug: 'deactive-account',
    title: 'Deactive Account',
    description: 'Review and manage deactivated accounts',
    icon: 'UserX',
  },
  '/dashboard/assets': {
    slug: 'assets',
    title: 'Assets',
    description: 'Manage your music assets and catalog',
    icon: 'Package',
  },
  '/dashboard/assets/overview': {
    slug: 'assets-overview',
    title: 'Overview',
    description: 'Overview of all assets in the catalog',
    icon: 'Package',
  },
  '/dashboard/assets/label-transfer': {
    slug: 'label-transfer',
    title: 'Label Transfer',
    description: 'Transfer labels between accounts',
    icon: 'ArrowLeftRight',
  },
  '/dashboard/assets/label-block': {
    slug: 'label-block',
    title: 'Label Block',
    description: 'Block labels from distribution',
    icon: 'Ban',
  },
  '/dashboard/assets/label-update': {
    slug: 'label-update',
    title: 'Label Update',
    description: 'Update label metadata and settings',
    icon: 'RefreshCw',
  },
  '/dashboard/content-delivery': {
    slug: 'content-delivery',
    title: 'Content Delivery',
    description: 'Monitor and manage content delivery pipelines',
    icon: 'Truck',
  },
  '/dashboard/release/create': {
    slug: 'create-new-release',
    title: 'Create New Release',
    description: 'Create and submit a new music release',
    icon: 'PlusCircle',
  },
  '/dashboard/release/correction': {
    slug: 'release-correction',
    title: 'Correction',
    description: 'Submit corrections for existing releases',
    icon: 'FilePen',
  },
  '/dashboard/issues/reference-overlaps': {
    slug: 'reference-overlaps',
    title: 'Reference Overlaps',
    description: 'Resolve overlapping content references',
    icon: 'GitMerge',
  },
  '/dashboard/issues/invalid-references': {
    slug: 'invalid-references',
    title: 'Invalid References',
    description: 'Review and fix invalid reference claims',
    icon: 'FileWarning',
  },
  '/dashboard/issues/ownership-transfers': {
    slug: 'ownership-transfers',
    title: 'Ownership Transfers',
    description: 'Manage ownership transfer requests',
    icon: 'ArrowRightLeft',
  },
  '/dashboard/issues/potential-claims': {
    slug: 'potential-claims',
    title: 'Potential Claims',
    description: 'Review potential rights claims',
    icon: 'ShieldAlert',
  },
  '/dashboard/issues/disputed-claims': {
    slug: 'disputed-claims',
    title: 'Disputed Claims',
    description: 'Handle disputed content claims',
    icon: 'Scale',
  },
  '/dashboard/issues/appealed-claims': {
    slug: 'appealed-claims',
    title: 'Appealed Claims',
    description: 'Track and respond to appealed claims',
    icon: 'Gavel',
  },
  '/dashboard/reports/report': {
    slug: 'report',
    title: 'Report',
    description: 'Generate and view operational reports',
    icon: 'FileText',
  },
  '/dashboard/reports/statements': {
    slug: 'statements',
    title: 'Statements',
    description: 'Royalty and financial statements',
    icon: 'Receipt',
  },
  '/dashboard/reports/withdrawals': {
    slug: 'withdrawals',
    title: 'Withdrawals',
    description: 'Manage payout and withdrawal requests',
    icon: 'Wallet',
  },
  '/dashboard/channels/linking': {
    slug: 'channel-linking',
    title: 'Linking',
    description: 'Link and verify distribution channels',
    icon: 'Link',
  },
  '/dashboard/channels/create': {
    slug: 'create-channel',
    title: 'Create Channel',
    description: 'Create a new distribution channel',
    icon: 'Plus',
  },
  '/dashboard/legal/right-manager/youtube-claim-release': {
    slug: 'youtube-claim-release',
    title: 'Youtube Claim Release',
    description: 'Release YouTube content claims',
    icon: 'Youtube',
  },
  '/dashboard/legal/right-manager/facebook-claim-release': {
    slug: 'facebook-claim-release',
    title: 'Facebook Claim Release',
    description: 'Release Facebook content claims',
    icon: 'Facebook',
  },
  '/dashboard/legal/right-manager/content-id': {
    slug: 'content-id',
    title: 'Content ID',
    description: 'Manage Content ID registrations',
    icon: 'Fingerprint',
  },
  '/dashboard/legal/right-manager/oac': {
    slug: 'oac',
    title: 'OAC',
    description: 'Official Artist Channel management',
    icon: 'BadgeCheck',
  },
  '/dashboard/legal/right-manager/profile-linking': {
    slug: 'profile-linking',
    title: 'Profile Linking',
    description: 'Link artist profiles across platforms',
    icon: 'UserRound',
  },
  '/dashboard/legal/right-manager/allowlist': {
    slug: 'allowlist',
    title: 'Allowlist',
    description: 'Manage content allowlists',
    icon: 'ListChecks',
  },
  '/dashboard/legal/right-manager/manual-claiming': {
    slug: 'manual-claiming',
    title: 'Manual Claiming',
    description: 'Submit and track manual claims',
    icon: 'Hand',
  },
  '/dashboard/legal/right-manager/takedown': {
    slug: 'takedown',
    title: 'Takedown',
    description: 'Process content takedown requests',
    icon: 'Trash2',
  },
  '/dashboard/notifications': {
    slug: 'notifications',
    title: 'Notifications',
    description: 'Alerts and updates across modules',
    icon: 'Bell',
  },
};

export const ALL_MODULE_ROUTES = Object.entries(MODULE_PAGES).map(([route, def]) => ({
  route,
  slug: def.slug,
}));
