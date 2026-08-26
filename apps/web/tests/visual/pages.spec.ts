import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { VIEWPORT_MATRIX } from './viewports.js';

/**
 * Stage 7 site-scale pages (Club Captain, Players Profile, Our
 * Franchises, International Tournaments/Events, Contact Us). Same
 * discipline as homepage.spec.ts/about.spec.ts — real, executing checks.
 */

const routes = [
  { path: '/club-captain', name: 'Club Captain' },
  { path: '/players', name: 'Players Profile' },
  { path: '/franchises', name: 'Our Franchises' },
  { path: '/tournaments', name: 'International Tournaments/Events' },
  { path: '/contact', name: 'Contact Us' },
];

for (const route of routes) {
  test(`axe-core scan reports zero violations on ${route.name}`, async ({
    page,
  }) => {
    await page.goto(route.path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    if (results.violations.length > 0) {
      console.log(JSON.stringify(results.violations, null, 2));
    }
    expect(
      results.violations,
      `axe violations on ${route.path}: ${results.violations.map((v) => v.id).join(', ')}`,
    ).toEqual([]);
  });

  test(`no content-contamination strings appear on ${route.name}`, async ({
    page,
  }) => {
    await page.goto(route.path);
    const html = await page.content();
    const forbidden = [
      'Adelux',
      'Padel Club',
      'Fox Creation',
      'Nipo Khadem',
      'Nipo',
    ];
    for (const term of forbidden) {
      expect(
        html.includes(term),
        `forbidden term "${term}" found on ${route.path}`,
      ).toBe(false);
    }
  });

  test(`excluded images are never referenced on ${route.name}`, async ({
    page,
  }) => {
    await page.goto(route.path);
    const html = await page.content();
    const excluded = [
      'home-hero.webp',
      'join-us.webp',
      'gallery-06.webp',
      'nordic-smash-slide.webp',
    ];
    for (const file of excluded) {
      expect(
        html.includes(file),
        `excluded asset "${file}" found on ${route.path}`,
      ).toBe(false);
    }
  });

  test(`no horizontal overflow on ${route.name} at any frozen viewport`, async ({
    page,
  }) => {
    for (const size of VIEWPORT_MATRIX) {
      await page.setViewportSize(size);
      await page.goto(route.path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `horizontal overflow at ${size.width}x${size.height} on ${route.path}`,
      ).toBeLessThanOrEqual(clientWidth);
    }
  });

  test(`mobile nav toggle works on ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route.path);
    const toggle = page.locator('.ukbt-header__toggle');
    await expect(toggle).toBeVisible();
    // Below the collapse breakpoint the nav becomes an off-canvas drawer
    // (reference `.sidebar`), not an inline expansion — assert the drawer.
    const drawerLink = page.locator('.ukbt-header__drawer-menu a').first();
    await expect(drawerLink).not.toBeInViewport();
    await toggle.click();
    await expect(drawerLink).toBeInViewport();
  });
}

test('no player photo is rendered on the Our Franchises roster', async ({
  page,
}) => {
  await page.goto('/franchises');
  const rosterImgs = await page.locator('.ukbt-roster-card img').count();
  expect(
    rosterImgs,
    'roster cards must stay text-only, no unconfirmed photos',
  ).toBe(0);
});

test('no captain portrait is rendered on the Club Captain page', async ({
  page,
}) => {
  await page.goto('/club-captain');
  const portrait = await page
    .locator('.ukbt-profile-header__content img')
    .count();
  expect(
    portrait,
    'profile header must stay crest-only, no unconfirmed portrait',
  ).toBe(0);
});

test('Contact Us page renders no submission form (no live backend exists)', async ({
  page,
}) => {
  await page.goto('/contact');
  const forms = await page.locator('form').count();
  expect(
    forms,
    'no fake/non-functional form should ship without a real backend',
  ).toBe(0);
});
