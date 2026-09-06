import { expect, test } from '@playwright/test';

/**
 * Focus-visibility interaction tests — assert the VISIBLE ring, not just
 * outline presence (Stage 8 red team F3 class). Render-verified locally
 * 2026-09-06: gold ring on the gold drawer toggle measured ~1:1.
 */

test('drawer toggle has a contrasting keyboard focus ring', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.ukbt-header__toggle');
  // Real keyboard modality: Tab until focused.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const cls =
      (await page.evaluate(() => document.activeElement?.className)) ?? '';
    if (String(cls).includes('ukbt-header__toggle')) break;
  }
  await expect(toggle, 'toggle reached by Tab').toBeFocused();
  const ring = await toggle.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      style: cs.outlineStyle,
      width: cs.outlineWidth,
      color: cs.outlineColor,
      offset: cs.outlineOffset,
    };
  });
  expect(ring.style, 'visible ring style').toBe('solid');
  // White ring clears the gold button (gold-on-gold was invisible).
  expect(ring.color, 'contrasting ring color').toBe('rgb(255, 255, 255)');
});

test('banner headline wraps balanced at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tournaments');
  const wrap = await page
    .locator('.ukbt-page-banner h1')
    .evaluate((el) => getComputedStyle(el).textWrap);
  expect(wrap, 'balanced headline wrap').toBe('balance');
});
