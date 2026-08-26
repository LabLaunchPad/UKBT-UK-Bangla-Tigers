import { expect, test } from '@playwright/test';

/**
 * Foundation-stage smoke test — proves the Playwright harness can
 * actually start the application, load a route, and detect real
 * failures. This is NOT the Stage-per-page visual-regression suite
 * (contracts/VISUAL-REGRESSION-CONTRACT.md) — no golden reference is
 * created or compared here. It proves the mechanism executes.
 */
test('homepage loads with no fatal console errors or failed requests', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const failedRequests: { url: string; status: number }[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push({ url: response.url(), status: response.status() });
    }
  });

  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/UK Bangla Tigers/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  expect(
    consoleErrors,
    `console errors: ${JSON.stringify(consoleErrors)}`,
  ).toEqual([]);
  expect(
    failedRequests,
    `failed requests: ${JSON.stringify(failedRequests)}`,
  ).toEqual([]);
});

test('homepage screenshot capability executes (not a golden baseline)', async ({
  page,
}) => {
  await page.goto('/');
  // Proves screenshot capture works end-to-end; output is a test artifact
  // (gitignored, test-results/), never committed as a reference render —
  // contracts/VISUAL-REGRESSION-CONTRACT.md's immutable references are a
  // separate, later, per-page artifact this Foundation gate does not
  // create.
  const buffer = await page.screenshot({ fullPage: true });
  expect(buffer.length).toBeGreaterThan(0);
});
