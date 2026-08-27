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
    // `pnpm run build` here only runs this package's own "build" script
    // (`astro build`) — it does NOT chain packages/truth's tokens:build
    // first the way the root "build" script does. Without an explicit
    // tokens:build first, `astro build`/`astro preview` fails outright:
    // BaseLayout.astro imports the generated tokens.css, which does not
    // exist until Style Dictionary runs (contracts/CSS-CONTRACT.md). This
    // was caught by a real CI failure, not anticipated in advance —
    // `pnpm --filter` resolves against the workspace root regardless of
    // the invoking cwd, so this works whether Playwright is invoked from
    // the repo root or from apps/web directly.
    //
    // `ASTRO_PREVIEW_BACKGROUND=false` is required as of Astro 7: `astro
    // preview` now self-daemonizes (forks to background and exits 0
    // immediately) whenever it detects it's being run by an agentic CLI
    // tool — which this environment is — printing "Preview server
    // running" and returning before Playwright's webServer can observe a
    // live foreground process, which Playwright then reports as "Process
    // from config.webServer exited early." Found by reproducing the
    // failure directly (`astro preview --help` documents the opt-in
    // `--background` flag; reading node_modules/astro/dist/cli/preview/
    // showed the *automatic* agent-detection path this flag doesn't
    // cover), not assumed from a changelog. This env var is Astro's own
    // documented escape hatch and is set unconditionally so behavior is
    // identical whether or not the invoking shell is ever detected as
    // agentic — including on CI runners, which so far are not, but
    // should not depend on staying that way.
    //
    // Invokes `astro preview` directly (not `pnpm run preview -- --port
    // 4321`) because Astro 7's CLI now parses a literal `--` separator
    // ahead of `--port` as an attempt to run a subcommand named
    // "--port", failing with "Unknown command" — reproduced directly,
    // not assumed. `pnpm exec` forwards flags without that extra `--`.
    command:
      'pnpm --filter @ukbt/truth tokens:build && pnpm run build && ASTRO_PREVIEW_BACKGROUND=false pnpm exec astro preview --port 4321',
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
