import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from '@playwright/test';
import { VIEWPORT_MATRIX } from './viewports.js';

/**
 * Stage 7G mandatory visual review (artifacts/pages/HOMEPAGE-CONTRACT.md,
 * "Visual QA"). Saves real screenshots into the repo (not the gitignored
 * test-results/ dir) so they can actually be reviewed, per the frozen
 * 6-viewport matrix.
 */
const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  'artifacts',
  'ui',
  'screenshots',
);

for (const viewport of VIEWPORT_MATRIX) {
  test(`homepage screenshot at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(
        outDir,
        `homepage-${viewport.width}x${viewport.height}.png`,
      ),
      fullPage: true,
    });
  });
}
