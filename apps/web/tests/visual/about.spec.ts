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
  // Settle reveals/transitions before scanning (same rationale as
  // homepage.spec.ts: mid-flight opacity blends into bogus ~1.01
  // ratios — this exact footer signature failed on CI).
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () => {
      const slideshow = new Set(
        document.querySelector('.ukbt-hero__bg--alt')?.getAnimations() ?? [],
      );
      return (
        Array.from(document.querySelectorAll('[data-motion="reveal"]')).every(
          (el) => el.classList.contains('is-visible'),
        ) &&
        document
          .getAnimations()
          .every(
            (a) =>
              a.playState === 'finished' ||
              a.playState === 'idle' ||
              slideshow.has(a),
          )
      );
    },
    null,
    { timeout: 15000 },
  );
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

test('leadership imagery is limited to the two owner-authorised photographs', async ({
  page,
}) => {
  await page.goto('/about');
  // Cards stay text-only — the authorised photographs render outside
  // the cards (About Phase 1, EV-20260910-001).
  const cardImgs = await page.locator('.ukbt-leadership__card img').count();
  expect(
    cardImgs,
    'leadership cards must stay text-only, no unconfirmed photos',
  ).toBe(0);
  // Exactly the authorised set renders, nothing else.
  const graphic = page.locator('.ukbt-leadership__graphic img');
  await expect(graphic).toHaveCount(1);
  await expect(graphic).toHaveAttribute('src', /management-team\.webp$/);
  const spotlight = page.locator('.ukbt-leadership__spotlight img');
  await expect(spotlight).toHaveCount(1);
  await expect(spotlight).toHaveAttribute('src', /sayem-rahman\.jpg$/);
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
