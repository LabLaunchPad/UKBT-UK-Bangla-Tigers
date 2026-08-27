import { defineConfig } from 'astro/config';

// contracts/REPOSITORY-CONTRACT.md / ARCHITECTURE-PROPOSAL-V3.md §1:
// static output. @astrojs/cloudflare is present as a devDependency
// (contracts/FORM-CONTRACT.md, contracts/DEPLOYMENT-CONTRACT.md) but is
// NOT activated as an adapter here — that happens only once a real form
// exists and needs Cloudflare Pages Functions. Activating it prematurely
// would be building ahead of the gate that unlocks it.
export default defineConfig({
  output: 'static',
  // `site` (canonical production domain) is set once confirmed — never
  // invented. Omitted, not guessed, per contracts/SEO-CONTRACT.md.

  // Pinned to the literal IPv4 loopback, not the default `localhost`.
  // Real CI failure (PR #1, check_run 98063976034): `astro preview`'s
  // default host binds to whatever `localhost` resolves to for Node's
  // getaddrinfo on that machine — IPv6 `::1` on GitHub Actions'
  // ubuntu-24.04 runners, IPv4 `127.0.0.1` in this sandbox. Playwright's
  // webServer.url in playwright.config.ts polls `http://127.0.0.1:4321`
  // explicitly, so on a host where `localhost` resolves to `::1` first,
  // the server was healthy but never observed as ready — a 120s hang,
  // not a build failure. Pinning both server and dev to the same literal
  // address removes the ambiguity everywhere, not just in CI.
  server: { host: '127.0.0.1' },
});
