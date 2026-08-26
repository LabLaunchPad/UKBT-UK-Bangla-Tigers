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
});
