// Club Captain page content bound to @ukbt/truth's gate. All values are
// the structured facts actually captured in
// artifacts/content/UKBT-CONTENT-INVENTORY.md (C-003, C-005, C-006, C-007,
// C-008) — no biography prose is invented where only structured facts,
// not verbatim source text, were captured during ingestion. External
// stats-provider and personal-social PLATFORM NAMES are evidenced (the
// source PDF names them); their literal URL strings were not transcribed
// during ingestion and are not retrievable in this session, so they are
// rendered as plain text, never as a fabricated href.
//
// Role and Franchise History were corrected per a client corrections
// document (EV-20260831-001) and the clarifying decisions it required
// (EV-20260831-002): role drops "Founder & CEO" on THIS page only (he
// still holds that title org-wide — see about-data.ts, unaffected by
// this change); Franchise History's Previous Teams now matches the
// correction document's 8 entries plus London Blaze and Roma Ovest
// Titans (moved from Current, per the client's confirmation he is
// currently only playing for UK Bangla Tigers and Uppsala Tigers).
import { type ContentRecord, createRegistry, evaluate } from '@ukbt/truth/gate';
import { ContentRecordSchema } from '@ukbt/truth/schema';

const registry = createRegistry([
  { id: 'EV-026', tier: 'T1', url: 'artifacts/evidence/EV-20260826-026.yaml' },
  {
    id: 'EV-0831-01',
    tier: 'T1',
    url: 'artifacts/evidence/EV-20260831-001.yaml',
  },
  {
    id: 'EV-0831-02',
    tier: 'T1',
    url: 'artifacts/evidence/EV-20260831-002.yaml',
  },
]);
const exemptFields = new Set<string>();
const twoSourceFields = new Set<string>();
const gateOptions = { registry, exemptFields, twoSourceFields };

interface Fact<T> {
  field: string;
  value: T;
  sources: string[];
}
// RM-5: Zod-validated, not just TS-shaped — see provenance.ts's
// ContentRecordSchema doc comment.
function record(f: Fact<unknown>): ContentRecord {
  // `as ContentRecord`: Zod already validated every field at runtime above;
  // the cast reconciles a TS quirk where `z.unknown()` makes `value`
  // structurally optional (unknown includes undefined) even though the
  // object literal always supplies it.
  return ContentRecordSchema.parse({
    field: f.field,
    value: f.value,
    status: 'pending_review',
    sources: f.sources,
  }) as ContentRecord;
}

const facts = {
  name: {
    field: 'captain.name',
    value: 'Mohammad Chowdhury',
    sources: ['EV-026'],
  },
  role: {
    field: 'captain.role',
    value: 'Club Captain',
    sources: ['EV-026', 'EV-0831-01', 'EV-0831-02'],
  },
  dob: { field: 'captain.dob', value: '10 December 1990', sources: ['EV-026'] },
  nationality: {
    field: 'captain.nationality',
    value: 'British & Bangladeshi',
    sources: ['EV-026'],
  },
  battingStyle: {
    field: 'captain.batting_style',
    value: 'Right-Handed Top Order Batter',
    sources: ['EV-026'],
  },
  bowlingStyle: {
    field: 'captain.bowling_style',
    value: 'Right-Arm Off Spin Bowler',
    sources: ['EV-026'],
  },
} satisfies Record<string, Fact<string>>;

const allRecords: ContentRecord[] = Object.values(facts).map((f) => record(f));
for (const rec of allRecords) {
  const result = evaluate(rec, gateOptions);
  if (!result.passed) {
    throw new Error(
      `Truth gate failed for '${rec.field}': ${result.reasons.map((r) => `${r.rule}: ${r.detail}`).join('; ')}`,
    );
  }
}

export const captain = {
  name: facts.name.value,
  role: facts.role.value,
  dob: facts.dob.value,
  nationality: facts.nationality.value,
  battingStyle: facts.battingStyle.value,
  bowlingStyle: facts.bowlingStyle.value,
  // Current/Previous per EV-0831-01 + EV-0831-02: he is currently playing
  // for UK Bangla Tigers and Uppsala Tigers only; London Blaze and Roma
  // Ovest Titans moved to Previous; Previous Teams otherwise matches the
  // correction document's 8 entries exactly.
  currentFranchises: [
    'UK Bangla Tigers (UAE, Safari International T20 Cup)',
    'Uppsala Tigers (Sweden, Nordic Smash T20)',
  ],
  previousFranchises: [
    'London Blaze (England, Gateway T20)',
    'Roma Ovest Titans (Italy, RPL T10)',
    'Yankee Royals (USA, US Open)',
    'Bangladesh Tigers of USA (USA, Atlanta Open)',
    'US All Stars (West Indies, Caribbean T10)',
    'Dynamite Ducks (South Africa, LMS World Championship)',
    'Bangladesh Tigers (USA, Diversity Cup)',
    'BAS Vampire (England, T20 Pro-Am)',
    'Bangladesh Tigers of USA (USA, Motor City Championship)',
    'Faisalabad Falcons (USA, US Open)',
  ],
  battingStats: [
    {
      format: '50-Over',
      matches: 276,
      innings: 231,
      runs: 11276,
      highScore: '189',
      average: '48.81',
      strikeRate: '117',
      hundreds: 31,
      fifties: 45,
    },
    {
      format: 'T20',
      matches: 136,
      innings: 123,
      runs: 4700,
      highScore: '132',
      average: '38.21',
      strikeRate: '132',
      hundreds: 7,
      fifties: 26,
    },
    {
      format: 'T10',
      matches: 54,
      innings: 47,
      runs: 1600,
      highScore: '103',
      average: '34.04',
      strikeRate: '147',
      hundreds: 2,
      fifties: 11,
    },
  ],
  bowlingStats: [
    {
      format: '50-Over',
      overs: '1203.2',
      wickets: 297,
      average: '14.56',
      economy: '4.09',
      best: '6/21',
    },
    {
      format: 'T20',
      overs: '246.3',
      wickets: 143,
      average: '15.70',
      economy: '6.30',
      best: '5/19',
    },
    {
      format: 'T10',
      overs: '98.2',
      wickets: 67,
      average: '17.98',
      economy: '8.06',
      best: '4/26',
    },
  ],
  statsProviders: [
    'ESPN Cricinfo',
    'Play-Cricket (England)',
    'CricHeroes',
    'Last Man Stands',
    'National Cricket League London',
    'European Cricket / CREX',
  ],
  personalSocialPlatforms: ['Facebook', 'Instagram', 'YouTube', 'LinkedIn'],
};
