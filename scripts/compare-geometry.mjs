#!/usr/bin/env node
/**
 * Diffs measured UKBT geometry against measured reference geometry and
 * prints a per-page, per-viewport parity table.
 *
 * Inputs (both produced by Playwright specs, both committed):
 *   artifacts/ui/reference-geometry.json  <- reference-geometry.spec.ts
 *   artifacts/ui/ukbt-geometry.json       <- ukbt-geometry.spec.ts
 *
 * This exists so parity claims cite two measured numbers rather than an
 * impression. Severity follows the parity spec's P0-P3 scale.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const refFile = path.join(
  repoRoot,
  'artifacts',
  'ui',
  'reference-geometry.json',
);
const ukbtFile = path.join(repoRoot, 'artifacts', 'ui', 'ukbt-geometry.json');

for (const f of [refFile, ukbtFile]) {
  if (!fs.existsSync(f)) {
    console.error(
      `missing ${path.relative(repoRoot, f)} — run the matching Playwright spec first`,
    );
    process.exit(2);
  }
}

const ref = JSON.parse(fs.readFileSync(refFile, 'utf8'));
const ukbt = JSON.parse(fs.readFileSync(ukbtFile, 'utf8'));

/** Reference page -> UKBT route, taken from the reference file itself. */
const routeOf = {};
for (const [file, data] of Object.entries(ref.pages))
  routeOf[data.ukbtRoute] = file;

/**
 * Comparisons that actually define the template's proportions. Tolerance
 * is in px; `0` means exact. Type sizes are exact because they come
 * straight from the ported tokens — any drift is a real regression.
 */
const CHECKS = [
  { key: 'type.h1.size', label: 'h1 size', tol: 0 },
  { key: 'type.h2.size', label: 'h2 size', tol: 0 },
  { key: 'type.h3.size', label: 'h3 size', tol: 0 },
  { key: 'type.p.size', label: 'paragraph size', tol: 0 },
  { key: 'sectionPad', label: 'section padding', tol: 0 },
  { key: 'banner.padTop', label: 'banner pad-top', tol: 0 },
  { key: 'banner.padBottom', label: 'banner pad-bottom', tol: 0 },
];

const dig = (o, k) => k.split('.').reduce((a, p) => (a == null ? a : a[p]), o);
function value(g, key) {
  if (key === 'sectionPad') {
    const s = (g.sections || []).find((x) => x.padTop > 0);
    return s ? s.padTop : null;
  }
  return dig(g, key);
}
function severity(label, delta) {
  const d = Math.abs(delta);
  if (label.includes('size') && d >= 16) return 'P1';
  if (d >= 40) return 'P1';
  if (d >= 8) return 'P2';
  return 'P3';
}

const rows = [];
let compared = 0;
for (const [route, u] of Object.entries(ukbt.pages)) {
  const refFileName = routeOf[route];
  if (!refFileName) continue;
  const r = ref.pages[refFileName];
  for (const vp of Object.keys(u.viewports)) {
    const rg = r.viewports[vp];
    const ug = u.viewports[vp];
    if (!rg || !ug) continue;
    for (const c of CHECKS) {
      const rv = value(rg, c.key);
      const uv = value(ug, c.key);
      if (rv == null || uv == null) continue;
      compared++;
      const delta = uv - rv;
      if (Math.abs(delta) > c.tol) {
        rows.push({
          route,
          vp,
          check: c.label,
          ref: rv,
          ukbt: uv,
          delta,
          sev: severity(c.label, delta),
        });
      }
    }
    if (ug.horizontalOverflow) {
      rows.push({
        route,
        vp,
        check: 'horizontal overflow',
        ref: 'none',
        ukbt: 'OVERFLOW',
        delta: '-',
        sev: 'P0',
      });
    }
  }
}

const bySev = (s) => rows.filter((r) => r.sev === s).length;
console.log(
  `\nGeometry parity: ${compared} comparisons, ${rows.length} mismatches`,
);
console.log(
  `P0 ${bySev('P0')}  P1 ${bySev('P1')}  P2 ${bySev('P2')}  P3 ${bySev('P3')}\n`,
);

if (rows.length) {
  const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
  rows.sort(
    (a, b) => order[a.sev] - order[b.sev] || a.route.localeCompare(b.route),
  );
  console.log('| SEV | ROUTE | VIEWPORT | CHECK | REFERENCE | UKBT | DELTA |');
  console.log('|---|---|---|---|---|---|---|');
  for (const r of rows) {
    console.log(
      `| ${r.sev} | ${r.route} | ${r.vp} | ${r.check} | ${r.ref} | ${r.ukbt} | ${r.delta} |`,
    );
  }
} else {
  console.log('No geometry mismatches on the compared checks.');
}

// Non-zero exit on structural breakage only; P1-P3 are reported, not fatal,
// because parity is reached progressively across the build-out phases.
process.exit(bySev('P0') > 0 ? 1 : 0);
