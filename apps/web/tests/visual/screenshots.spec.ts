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

const pages = [
  { route: '/', slug: 'homepage' },
  { route: '/about', slug: 'about' },
  { route: '/club-captain', slug: 'club-captain' },
  { route: '/players', slug: 'players' },
  { route: '/franchises', slug: 'franchises' },
  { route: '/tournaments', slug: 'tournaments' },
  { route: '/contact', slug: 'contact' },
];

for (const viewport of VIEWPORT_MATRIX) {
  for (const p of pages) {
    test(`${p.slug} screenshot at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto(p.route);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: path.join(
          outDir,
          `${p.slug}-${viewport.width}x${viewport.height}.png`,
        ),
        fullPage: true,
      });
    });
  }
}
