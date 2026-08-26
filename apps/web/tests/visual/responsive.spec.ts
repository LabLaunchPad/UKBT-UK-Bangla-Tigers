import { expect, test } from '@playwright/test';
import { VIEWPORT_MATRIX } from './viewports.js';

/**
 * Proves the frozen 6-viewport matrix (contracts/VISUAL-REGRESSION-CONTRACT.md)
 * is exercisable in this harness — deterministic responsive checks, not the
 * full per-page structural/visual/interaction suite that requires real
 * pages to exist first.
 */
for (const viewport of VIEWPORT_MATRIX) {
  test(`no horizontal overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto('/');
    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(
      hasOverflow,
      `horizontal overflow detected at ${viewport.name}`,
    ).toBe(false);
  });
}
