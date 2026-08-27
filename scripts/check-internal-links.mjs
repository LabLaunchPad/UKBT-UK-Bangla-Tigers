#!/usr/bin/env node
// Site-wide internal-link integrity check (Stage 10 release-gate RM-3,
// artifacts/receipts/RELEASE.md). Crawls the real built output — never
// the source — so a route renamed or removed on one page but still
// linked from another is caught the way a real visitor would hit it.
// No HTML-parser dependency: the build output is our own controlled
// Astro output, so a href="..."/href='...' regex is reliable here and
// avoids a new dependency-allowlist entry for a one-file check.
import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'apps/web/dist');

if (!existsSync(distDir)) {
  console.error(
    JSON.stringify({
      status: 'FAIL',
      reason: 'apps/web/dist does not exist — run `pnpm build` first',
    }),
  );
  process.exit(1);
}

const htmlFiles = globSync('**/*.html', { cwd: distDir }).map((f) =>
  join(distDir, f),
);

const hrefPattern = /href=["']([^"'#][^"']*)["']/g;
const brokenLinks = [];
let checkedLinks = 0;

function resolvesToRealFile(internalPath) {
  const clean = internalPath.split('?')[0].split('#')[0];
  if (clean === '' || clean === '/')
    return existsSync(join(distDir, 'index.html'));
  const trimmed = clean.replace(/^\//, '');
  if (extname(trimmed)) {
    // A real file request (image, css, etc.) or an explicit *.html link.
    return existsSync(join(distDir, trimmed));
  }
  // Astro's static routing: /foo -> foo/index.html (trailing slash optional).
  const withoutTrailingSlash = trimmed.replace(/\/$/, '');
  return (
    existsSync(join(distDir, withoutTrailingSlash, 'index.html')) ||
    existsSync(join(distDir, `${withoutTrailingSlash}.html`))
  );
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const relFile = file.slice(distDir.length + 1);
  for (const match of html.matchAll(hrefPattern)) {
    const href = match[1];
    // Only internal, site-relative links are this check's job — external
    // URLs (social links, etc.) are out of scope and not our build output.
    if (!href.startsWith('/')) continue;
    checkedLinks++;
    if (!resolvesToRealFile(href)) {
      brokenLinks.push({ file: relFile, href });
    }
  }
}

const result = {
  status: brokenLinks.length === 0 ? 'PASS' : 'FAIL',
  html_files_scanned: htmlFiles.length,
  internal_links_checked: checkedLinks,
  broken_links: brokenLinks,
};
console.log(JSON.stringify(result, null, 2));
process.exit(brokenLinks.length === 0 ? 0 : 1);
