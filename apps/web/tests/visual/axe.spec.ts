import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Proves axe-core actually executes against a real rendered page and can
 * report a real violation — not merely that the dependency is installed.
 * contracts/ACCESSIBILITY-CONTRACT.md: automated checks catch roughly a
 * third of real defects; a pass here means "no automatable WCAG 2.2 AA
 * violation found," never "accessible."
 */
test('axe-core scan executes and reports zero violations on the placeholder homepage', async ({
  page,
}) => {
  await page.goto('/');
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

test('axe-core detects a real, deliberately introduced violation (sanity check)', async ({
  page,
}) => {
  await page.goto('/');
  // Deliberately break accessibility on this page instance only — proves
  // the scan can fail, not just pass. Per knowledge/08 anti_vacuity: "a
  // check with no failing case is decorative."
  await page.evaluate(() => {
    const img = document.createElement('img');
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    document.body.appendChild(img);
  });
  const results = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();
  const hasImageAltViolation = results.violations.some(
    (v) => v.id === 'image-alt',
  );
  expect(
    hasImageAltViolation,
    'axe should have flagged the deliberately alt-less image',
  ).toBe(true);
});
