import { ModulePermission } from '@/types';

type ModuleRef = Pick<ModulePermission, 'slug' | 'parentSlug'>;

export const buildModuleSlugMap = (modules: ModuleRef[]): Map<string, ModuleRef> =>
  new Map(modules.map((m) => [m.slug, m]));

/** Walks `parentSlug` links to the top-level ancestor used for permission checks. */
export const getRootSlug = (module: ModuleRef, bySlug: Map<string, ModuleRef>): string => {
  let current = module;
  const visited = new Set<string>();

  while (current.parentSlug && bySlug.has(current.parentSlug)) {
    if (visited.has(current.slug)) break;
    visited.add(current.slug);
    current = bySlug.get(current.parentSlug)!;
  }

  return current.slug;
};

export interface ModuleNavNode extends ModulePermission {
  children: ModuleNavNode[];
}

/** Builds a nested tree from a flat permission list using `parentSlug`. */
export function buildModuleTree(modules: ModulePermission[]): ModuleNavNode[] {
  const bySlug = new Map(modules.map((m) => [m.slug, { ...m, children: [] as ModuleNavNode[] }]));
  const roots: ModuleNavNode[] = [];

  for (const mod of modules) {
    const node = bySlug.get(mod.slug)!;
    if (mod.parentSlug && bySlug.has(mod.parentSlug)) {
      bySlug.get(mod.parentSlug)!.children.push(node);
    } else if (!mod.parentSlug) {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: ModuleNavNode[]): ModuleNavNode[] =>
    [...nodes]
      .sort((a, b) => a.order - b.order)
      .map((n) => ({ ...n, children: sortNodes(n.children) }));

  return sortNodes(roots);
}

/** True when this exact nav item matches the current route. */
export function isNavItemActive(node: Pick<ModuleNavNode, 'route'>, pathname: string): boolean {
  if (pathname === node.route) return true;
  if (node.route === '/dashboard') return false;
  return pathname.startsWith(`${node.route}/`);
}

/** True when the route or any descendant route matches — used only to auto-expand parents. */
export function isModuleBranchOpen(node: ModuleNavNode, pathname: string): boolean {
  if (isNavItemActive(node, pathname)) return true;
  return node.children.some((child) => isModuleBranchOpen(child, pathname));
}
