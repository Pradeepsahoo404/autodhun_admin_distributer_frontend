const FOOTER_LINKS = [
  { label: 'Content Policy', href: '#' },
  { label: 'Cookie Policy', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Distribution Agreement', href: '#' },
  { label: 'Sync Agreement', href: '#' },
  { label: 'Fraud Policy', href: '#' },
] as const;

/** Legal links footer shown at the bottom of the dashboard content area. */
export function DashboardFooter() {
  return (
    <footer className="border-t border-[#141414] px-6 py-6 lg:px-10">
      <nav className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2.5 text-center text-[13px] text-neutral-500">
        {FOOTER_LINKS.map((link, index) => (
          <span key={link.label} className="inline-flex items-center gap-2">
            {index > 0 && <span className="text-neutral-700" aria-hidden>•</span>}
            <a href={link.href} className="transition-colors hover:text-neutral-300">
              {link.label}
            </a>
          </span>
        ))}
      </nav>
    </footer>
  );
}
