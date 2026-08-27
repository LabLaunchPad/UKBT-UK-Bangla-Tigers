#!/usr/bin/env node
/**
 * Generates the page parity matrix from measured data rather than by
 * hand, so it cannot drift from what the site actually renders.
 *
 * Inputs:
 *   artifacts/ui/reference-geometry.json  (reference measurements)
 *   apps/web/dist/                        (built HTML, for section counts)
 *   UKBT_REFERENCE_DIR                    (optional: reference section names)
 *
 * Output: artifacts/ui/PAGE-PARITY-MATRIX.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const ref = read('artifacts/ui/reference-geometry.json');
const dist = path.join(root, 'apps/web/dist');

/** Reference page -> its section names, read from the licensed package. */
function referenceSections() {
  const dir = process.env.UKBT_REFERENCE_DIR;
  if (!dir || !fs.existsSync(dir)) return null;
  const out = {};
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    const names = [...s.matchAll(/<!-- ([A-Za-z0-9 /&-]*?) Section -->/g)]
      .map((m) => m[1])
      .filter((n) => !['Header', 'Sidebar', 'Main', 'Footer'].includes(n));
    out[f] = names;
  }
  return out;
}

/** Count the sections our build actually renders. */
function ukbtSections(route) {
  const file =
    route === '/'
      ? path.join(dist, 'index.html')
      : route === '/404'
        ? path.join(dist, '404.html')
        : path.join(dist, route.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(file)) return null;
  const s = fs.readFileSync(file, 'utf8');
  return {
    // Only the Section primitive emits the pt- modifier. Matching the bare
    // `ukbt-section` prefix would also catch `ukbt-section-header` and
    // inflate every count.
    sections: (s.match(/ukbt-section--pt-/g) ?? []).length,
    banner: s.includes('ukbt-page-banner') ? 1 : 0,
    hero: s.includes('ukbt-hero__inner') ? 1 : 0,
    shells: (s.match(/data-content-status="UNKNOWN"/g) ?? []).length,
    noindex: /name="robots"[^>]*noindex/.test(s),
  };
}

const refSections = referenceSections();
const rows = [];
for (const [file, data] of Object.entries(ref.pages)) {
  const route = data.ukbtRoute;
  const u = ukbtSections(route);
  const refNames = refSections?.[file] ?? null;
  rows.push({
    file,
    route,
    refCount: refNames ? refNames.length : '—',
    ukbtCount: u ? u.sections + u.banner + u.hero : 'NOT BUILT',
    shells: u ? u.shells : '—',
    noindex: u ? (u.noindex ? 'yes' : 'no') : '—',
    refNames,
  });
}

const lines = [];
lines.push('# Page Parity Matrix');
lines.push('');
lines.push(
  '**Generated** by `scripts/build-parity-matrices.mjs` from measured data — not written by hand, so it cannot drift from what the site renders. Regenerate after any page change.',
);
lines.push('');
lines.push(
  '`SECTIONS_UKBT` counts rendered `Section` primitives plus the page banner or hero. `SHELLS` counts sections carrying `CONTENT_STATUS = UNKNOWN`.',
);
lines.push('');
lines.push(
  '| TEMPLATE PAGE | UKBT ROUTE | SECTIONS_REF | SECTIONS_UKBT | SHELLS | NOINDEX | STATUS |',
);
lines.push('|---|---|---|---|---|---|---|');
for (const r of rows) {
  const status =
    r.ukbtCount === 'NOT BUILT'
      ? 'NOT_STARTED'
      : r.shells > 0
        ? 'SHELL — CONTENT_UNKNOWN'
        : 'BUILT';
  lines.push(
    `| \`${r.file}\` | \`${r.route}\` | ${r.refCount} | ${r.ukbtCount} | ${r.shells} | ${r.noindex} | ${status} |`,
  );
}

if (refSections) {
  lines.push('');
  lines.push('## Reference section sequences');
  lines.push('');
  lines.push(
    'What each reference page actually contains, for checking composition rather than counts.',
  );
  lines.push('');
  for (const r of rows) {
    if (!r.refNames) continue;
    lines.push(`- \`${r.file}\` → \`${r.route}\`: ${r.refNames.join(' → ')}`);
  }
}

lines.push('');
lines.push('## What a matching count does and does not prove');
lines.push('');
lines.push(
  'Equal counts do not mean equal pages. A route can hit its section count while a section carries a shell, and the reference sections with no UKBT counterpart (Service, Padel Booking, Pricing, Membership Benefit, Booking) are deliberately absent rather than pending. Read this table alongside `SHELLS` and `artifacts/ui/PARITY-HARNESS.md`, which measures geometry rather than composition.',
);

const out = path.join(root, 'artifacts/ui/PAGE-PARITY-MATRIX.md');
fs.writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`WROTE ${path.relative(root, out)} (${rows.length} routes)`);
