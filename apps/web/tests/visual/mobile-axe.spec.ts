import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Mobile-viewport accessibility sweep (2026-08-27).
 *
 * WHY THIS EXISTS SEPARATELY FROM `axe.spec.ts` / `pages.spec.ts`:
 * `playwright.config.ts`'s only project is Desktop Chrome, so every axe-core
 * scan in this suite has only ever run at desktop width. A dedicated mobile
 * sweep across all 16 routes found 4 real `heading-order` violations
 * (/about, /franchises x2, /community) plus a color-contrast regression
 * introduced while fixing /404's own heading-order gap — none visible to
 * the existing desktop-only scans. This file closes that gap so it can't
 * silently reopen.
 */

const ALL_ROUTES = [
  '/',
  '/about',
  '/club-captain',
  '/players',
  '/franchises',
  '/tournaments',
  '/news',
  '/contact',
  '/faq',
  '/join',
  '/membership',
  '/services',
  '/coaching',
  '/community',
  '/design-system',
  '/404',
];

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

for (const route of ALL_ROUTES) {
  test(`no axe violations on ${route} at mobile viewport (390x844)`, async ({
    page,
  }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice'])
      .analyze();

    if (results.violations.length > 0) {
      console.log(JSON.stringify(results.violations, null, 2));
    }
    expect(
      results.violations,
      `axe violations on ${route}: ${results.violations.map((v) => v.id).join(', ')}`,
    ).toEqual([]);
  });
}
