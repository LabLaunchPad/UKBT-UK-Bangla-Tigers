// contracts/REPOSITORY-CONTRACT.md's dependency-addition policy +
// contracts/CI-CONTRACT.md's dependency-allowlist gate.
// Fails the build if any package.json declares a dependency (prod or dev)
// that has no entry in scripts/dependency-allowlist.json, and fails if a
// permanently_blocked dependency is declared at all — this is what turns
// THIRD-PARTY-DISPOSITION.md's DO_NOT_ADOPT decisions into an enforced
// gate rather than documented-but-ignorable policy.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const allowlistPath = path.join(root, 'scripts/dependency-allowlist.json');
const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));

const allowedNames = new Set(allowlist.entries.map((e) => e.name));
const blockedNames = new Set(allowlist.permanently_blocked.map((b) => b.name));

const packageJsonPaths = [
  'package.json',
  'apps/web/package.json',
  'packages/truth/package.json',
];

const notAllowed = [];
const blocked = [];

for (const relPath of packageJsonPaths) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, relPath), 'utf8'));
  for (const depType of ['dependencies', 'devDependencies']) {
    for (const name of Object.keys(pkg[depType] ?? {})) {
      if (blockedNames.has(name)) {
        blocked.push({ package: relPath, name, depType });
      } else if (!allowedNames.has(name)) {
        notAllowed.push({ package: relPath, name, depType });
      }
    }
  }
}

if (blocked.length > 0 || notAllowed.length > 0) {
  console.error(
    JSON.stringify(
      {
        status: 'FAIL',
        blocked,
        not_on_allowlist: notAllowed,
        hint: 'Add an entry to scripts/dependency-allowlist.json (with license + contractStatus) before adding a new dependency, per contracts/REPOSITORY-CONTRACT.md.',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: 'PASS',
      checked_files: packageJsonPaths,
      allowed_count: allowedNames.size,
    },
    null,
    2,
  ),
);
