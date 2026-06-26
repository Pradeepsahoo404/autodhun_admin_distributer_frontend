import { BRAND_LOGO } from '@/constants';

/** Autodhun brand logo — sized to align with the dashboard header row. */
export function SidebarLogo() {
  return (
    <img
      src={BRAND_LOGO}
      alt="Autodhun"
      width={148}
      height={28}
      loading="eager"
      decoding="async"
      className="h-7 w-auto max-w-[148px] object-contain lg:h-8 lg:max-w-[160px]"
    />
  );
}