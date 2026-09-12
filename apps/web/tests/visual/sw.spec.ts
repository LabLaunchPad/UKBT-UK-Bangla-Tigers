import { expect, test } from '@playwright/test';

/**
 * PWA-lite service worker: registration, versioned caches, offline
 * fallback, non-cacheable bypass. Runs against `astro preview` (the
 * production build, where scripts/build-sw.mjs has stamped the release
 * commit hash into dist/sw.js).
 */
test.describe('service worker', () => {
  test('registers and activates with versioned cache namespaces', async ({
    page,
  }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    const state = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      const keys = await caches.keys();
      return {
        active: reg?.active?.state ?? 'none',
        scope: reg?.scope ?? '',
        keys,
      };
    });
    expect(state.active, 'worker active').toBe('activated');
    expect(state.scope, 'same-origin scope').toContain('127.0.0.1:4321');
    expect(
      state.keys.some((k) => /^ukbt-static-[0-9a-f]+$/.test(k)),
      'versioned static cache (no placeholder)',
    ).toBe(true);
  });

  test('precaches the offline shell at install', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    const cached = await page.evaluate(async () => {
      const keys = await caches.keys();
      const staticKey = keys.find((k) => k.startsWith('ukbt-static-'));
      if (!staticKey) return [];
      const cache = await caches.open(staticKey);
      return (await cache.keys()).map((r) => new URL(r.url).pathname);
    });
    expect(cached, 'offline shell precached').toContain('/offline/');
    expect(cached, 'manifest precached').toContain('/manifest.webmanifest');
  });

  test('visited page survives offline reload; unvisited route falls back', async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/players/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    // Repeat-visit semantics: the first navigation predates worker
    // control, so reload once online to populate the pages cache —
    // exactly what a real second visit does.
    await page.reload();
    await expect(
      page.locator('.ukbt-squad-head__heading').first(),
      'online repeat visit renders',
    ).toBeVisible();
    await context.setOffline(true);
    await page.reload();
    await expect(
      page.locator('.ukbt-squad-head__heading').first(),
      'cached players page served offline',
    ).toBeVisible();
    await page.goto('/franchises/');
    await expect(
      page.locator('.ukbt-offline__heading'),
      'offline shell for uncached route',
    ).toBeVisible();
    await context.close();
  });

  test('POST requests bypass the worker untouched', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    const status = await page.evaluate(async () => {
      try {
        const res = await fetch('/', { method: 'POST' });
        return res.status;
      } catch {
        return -1;
      }
    });
    // Any real server response (405/404) proves pass-through; -1 would
    // mean the worker swallowed it.
    expect(status, 'POST reaches the network').not.toBe(-1);
  });

  test('cross-origin traffic is never cached', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    const foreign = await page.evaluate(async () => {
      const keys = await caches.keys();
      const urls: string[] = [];
      for (const k of keys) {
        const cache = await caches.open(k);
        for (const r of await cache.keys()) urls.push(new URL(r.url).origin);
      }
      return [...new Set(urls)];
    });
    expect(
      foreign.every((o) => o === 'http://127.0.0.1:4321'),
      'same-origin only in caches',
    ).toBe(true);
  });
});
