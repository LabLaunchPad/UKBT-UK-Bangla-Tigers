import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { VIEWPORT_MATRIX } from './viewports.js';

/**
 * Stage 7 About Us (artifacts/pages/ABOUT-CONTRACT.md acceptance
 * criteria). Real, executing checks — not asserted.
 */

test('axe-core scan reports zero violations on the About Us page', async ({
  page,
}) => {
  await page.goto('/about');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  if (results.violations.length > 0) {
    console.log(JSON.stringify(results.violations, null, 2));
  }
  expect(
    results.violations,
    `axe violations: ${results.violations.map((v) => v.id).join(', ')}`,
  ).toEqual([]);
});

test('mobile nav toggle works on the About Us page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about');
  const toggle = page.locator('.ukbt-header__toggle');
  await expect(toggle).toBeVisible();
  // Below the collapse breakpoint the nav becomes an off-canvas drawer
  // (reference `.sidebar`), not an inline expansion — assert the drawer.
  const drawerLink = page.locator('.ukbt-header__drawer-menu a').first();
  await expect(drawerLink).not.toBeInViewport();
  await toggle.click();
  await expect(drawerLink).toBeInViewport();
});

test('no content-contamination strings appear anywhere in the rendered About Us page', async ({
  page,
}) => {
  await page.goto('/about');
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
      `forbidden term "${term}" found in rendered HTML`,
    ).toBe(false);
  }
});

test('excluded images are never referenced by the built About Us page', async ({
  page,
}) => {
  await page.goto('/about');
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
      `excluded asset "${file}" referenced in rendered HTML`,
    ).toBe(false);
  }
});

test('no leadership photo is rendered on the About Us page', async ({
  page,
}) => {
  await page.goto('/about');
  const leadershipImgs = await page
    .locator('.ukbt-leadership__card img')
    .count();
  expect(
    leadershipImgs,
    'leadership cards must stay text-only, no unconfirmed photos',
  ).toBe(0);
});

test('no horizontal overflow on the About Us page at any frozen viewport', async ({
  page,
}) => {
  for (const size of VIEWPORT_MATRIX) {
    await page.setViewportSize(size);
    await page.goto('/about');
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(
      scrollWidth,
      `horizontal overflow at ${size.width}x${size.height}`,
    ).toBeLessThanOrEqual(clientWidth);
  }
});
