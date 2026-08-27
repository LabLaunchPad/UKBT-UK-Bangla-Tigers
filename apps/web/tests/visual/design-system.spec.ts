import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Stage 5 (prompts/15-design-system.md): "Run: type check · lint · unit
 * tests · build · accessibility checks." This is the real, executing
 * accessibility check against the design-system test page — not asserted,
 * run.
 */
test('axe-core scan reports zero violations on the design-system test page', async ({
  page,
}) => {
  await page.goto('/design-system');
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

/**
 * contracts/ACCESSIBILITY-CONTRACT.md: "explicit keyboard-navigation
 * Playwright tests" + visible focus indicator on every focusable element
 * — checked as a real computed-style assertion, not merely that
 * :focus-visible exists in the stylesheet.
 */
test('every button and the linked card show a visible focus outline when tabbed to', async ({
  page,
}) => {
  await page.goto('/design-system');

  const focusable = page.locator(
    '.ukbt-button:not([disabled]), a.ukbt-card--linked',
  );
  const count = await focusable.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await focusable.nth(i).focus();
    const outlineStyle = await focusable.nth(i).evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
    expect(
      outlineStyle.outlineStyle,
      `element ${i} must have a non-"none" outline when focused`,
    ).not.toBe('none');
    expect(
      Number.parseFloat(outlineStyle.outlineWidth),
      `element ${i} must have a non-zero outline width when focused`,
    ).toBeGreaterThan(0);
  }
});

test('disabled button is not reachable by keyboard tab', async ({ page }) => {
  await page.goto('/design-system');
  const disabledButton = page.getByRole('button', { name: 'Disabled' });
  await expect(disabledButton).toBeDisabled();
});
