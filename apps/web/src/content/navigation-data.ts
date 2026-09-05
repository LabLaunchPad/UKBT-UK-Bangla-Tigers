import type { NavItem } from '@ukbt/truth';

/**
 * Primary navigation — 7 links + 1 CTA. This is the single source of truth
 * for header, footer, and any navigation component.
 *
 * "Join the Club" is a primary CTA, not an ordinary navigation item.
 * Parent items with children remain navigable — clicking the label navigates
 * to the href, clicking the arrow/toggle opens the submenu.
 */
export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Club Captain', href: '/club-captain' },
  { label: 'Players Profile', href: '/players' },
  {
    label: 'Our Franchises',
    href: '/franchises',
    children: [{ label: 'Uppsala Tigers', href: '/franchises/uppsala-tigers' }],
  },
  {
    label: 'International Tournaments/Events',
    href: '/tournaments',
    children: [
      { label: 'Previous Events', href: '/tournaments/previous' },
      { label: 'Current Events', href: '/tournaments/current' },
      { label: 'Future Events', href: '/tournaments/future' },
    ],
  },
  { label: 'Contact Us', href: '/contact' },
];

/**
 * Primary CTA — rendered as a button in the header, not as a nav link.
 */
export const primaryCta = {
  label: 'Join the Club',
  href: '/join',
};

/**
 * Secondary navigation — footer only. Template-mirrored routes that extend
 * the client's IA without widening primary navigation.
 */
export const secondaryNav: NavItem[] = [
  { label: 'Community', href: '/community' },
  { label: 'Coaching & Development', href: '/coaching' },
  { label: 'Club News', href: '/news' },
  { label: 'FAQ', href: '/faq' },
];
