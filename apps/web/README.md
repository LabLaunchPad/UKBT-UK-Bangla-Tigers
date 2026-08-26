# @ukbt/web

The UK Bangla Tigers production site (Astro, static output). See
`contracts/REPOSITORY-CONTRACT.md` for package boundaries and
`contracts/*.md` generally for the rules this package must follow.

## Local Playwright note

Some sandboxed dev environments pre-install a Chromium build outside
Playwright's own managed cache, at `/opt/pw-browsers/chromium`, and set
`PLAYWRIGHT_BROWSERS_PATH` accordingly. If the installed `@playwright/test`
version expects a different browser revision than what's cached there,
`playwright.config.ts` falls back to that path directly (skipped when
`CI=true`, where the GitHub Actions workflow runs a normal
`playwright install chromium` instead). If you hit a "browser not found"
error locally and don't have that path, run
`pnpm exec playwright install chromium` yourself.
