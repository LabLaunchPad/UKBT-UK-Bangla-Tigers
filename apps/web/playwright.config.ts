import { defineConfig, devices } from '@playwright/test';

/**
 * Foundation-stage Playwright config. Per contracts/VISUAL-REGRESSION-CONTRACT.md:
 * comparisons are meant to run CI-vs-CI only, on a pinned runner image —
 * that pinning happens in the CI workflow (.github/workflows/ci.yml), not
 * here. This config fixes the local/CI-shared mechanics: browser project,
 * base URL, and the webServer that serves the actual production build
 * (never `astro dev`) so what is tested matches what ships.
 */
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm run build && pnpm run preview -- --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Local sandbox environments pre-install Chromium outside
        // Playwright's own cache and expect it referenced by path (see
        // apps/web/README.md). CI runs a real `playwright install
        // chromium` instead (.github/workflows/ci.yml) and must not use
        // this override, since /opt/pw-browsers doesn't exist there.
        launchOptions: process.env.CI
          ? {}
          : { executablePath: '/opt/pw-browsers/chromium' },
      },
    },
  ],
});
