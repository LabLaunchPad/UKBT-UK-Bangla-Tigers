// Players Profile page content, bound to @ukbt/truth's gate. The full
// 42-name UK Bangla Tigers roster is real evidence — the client's own
// "Players Profile" / "List Of Players" document (EV-20260831-005),
// explicitly described by the requester as being about the club's
// players, not Uppsala Tigers. It contains all 20 names from the
// separately-supplied Uppsala Tigers squad list, confirming
// CLIENT_REQ_007 ("Uppsala Tigers players should also appear on the UK
// Bangla Tigers Players list", EV-20260826-027) — those 20 are tagged
// `alsoUppsala` here rather than duplicated with different data.
// "Nipo Khadem" is absent from this list — CLIENT_REQ_008 unaffected.
//
// One conflict resolved per EV-20260831-006, not guessed: Roushan
// Singh's country has three different values across three documents
// (Portugal, India, Netherlands) — left UNSET here too, same as on the
// Uppsala Tigers page, not silently defaulted to any of them.
//
// No photos, no stats: CLIENT_REQ_006 says squad-list pages show only
// name, picture and country — no picture is supplied for any of these
// 42 people, so cards stay text-only, the same discipline as
// RosterGrid's other call site.
import { type ContentRecord, createRegistry, evaluate } from '@ukbt/truth/gate';
import { ContentRecordSchema } from '@ukbt/truth/schema';

const registry = createRegistry([
  {
    id: 'EV-0831-05',
    tier: 'T1',
    url: 'artifacts/evidence/EV-20260831-005.yaml',
  },
  {
    id: 'EV-0831-06',
    tier: 'T1',
    url: 'artifacts/evidence/EV-20260831-006.yaml',
  },
]);
const exemptFields = new Set<string>();
const twoSourceFields = new Set<string>();
const gateOptions = { registry, exemptFields, twoSourceFields };

export interface RosterPlayer {
  name: string;
  country?: string;
  tags?: string[];
  note?: string;
}

// field-name-safe slug for each player, used only as the truth-gate
// record key — not rendered.
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const UPPSALA_TAG = 'Also plays for Uppsala Tigers';

const rawRoster: { name: string; country?: string; alsoUppsala?: boolean }[] = [
  { name: 'Mohammad Chowdhury', country: 'England', alsoUppsala: true },
  { name: 'Shakib Al Hasan', country: 'Bangladesh', alsoUppsala: true },
  { name: 'Mark James Nunn', country: 'England' },
  { name: 'Karanbir Singh', country: 'Austria', alsoUppsala: true },
  { name: 'Wayne Parnel', country: 'South Africa' },
  { name: 'Junaid Siddique', country: 'Canada' },
  { name: 'Owen Palmer', country: 'England', alsoUppsala: true },
  { name: 'Shaheryar Butt', country: 'Belgium', alsoUppsala: true },
  { name: 'Chad Potgieter', country: 'South Africa', alsoUppsala: true },
  { name: 'Roushan Singh', alsoUppsala: true }, // country unset — see file header
  { name: 'Juan Henri', country: 'Portugal' },
  { name: 'Shabbir Rahman', country: 'Bangladesh' },
  { name: 'Kenner Lewis', country: 'West Indies' },
  { name: 'Jaspreet Singh', country: 'Italy', alsoUppsala: true },
  { name: 'Pater Robert Harness', country: 'England' },
  { name: 'Amahl Nathaniel', country: 'West Indies' },
  { name: 'Armaan Randhawa', country: 'Austria', alsoUppsala: true },
  { name: 'Sufyan Mehmood', country: 'Oman' },
  { name: 'Arafat Bhuiyan', country: 'England' },
  { name: 'Jawid Stanigze', country: 'Afghanistan', alsoUppsala: true },
  { name: 'Rajesh Sharma', country: 'India' },
  { name: 'Chinthaka Rajapaksha', country: 'Sri Lanka', alsoUppsala: true },
  { name: 'Elias Sunny', country: 'Bangladesh' },
  { name: 'Ruman Ahmed', country: 'Bangladesh' },
  { name: 'Forhad Reza', country: 'Bangladesh' },
  { name: 'Tasaduq Hussain', country: 'Sweden', alsoUppsala: true },
  { name: 'Tawfique Khan Tushar', country: 'Bangladesh' },
  { name: 'Lemar Momand', country: 'Afghanistan', alsoUppsala: true },
  { name: 'Humayun Kabir Jyoti', country: 'USA', alsoUppsala: true },
  { name: 'Raminda Wijesooriya', country: 'Sri Lanka' },
  { name: 'Towker Khan', country: 'USA' },
  { name: 'Prashant Shukla', country: 'India', alsoUppsala: true },
  { name: 'Anop Ravi', country: 'Canada' },
  { name: 'Qudratullah Mir Afzal', country: 'Sweden', alsoUppsala: true },
  { name: 'Elliot Green', country: 'England' },
  { name: 'Hamid Mahmood', country: 'Sweden', alsoUppsala: true },
  { name: 'Anas Zaheer', country: 'Sweden', alsoUppsala: true },
  { name: 'Essa Farooq', country: 'Sweden', alsoUppsala: true },
  { name: 'Dhrubonil Roy', country: 'Sweden', alsoUppsala: true },
  { name: 'Dhavalkumar Norotam', country: 'Portugal' },
  { name: 'Musa Ahmad', country: 'Netherlands' },
  { name: 'Jeremy Martins', country: 'Portugal' }, // NOT on Uppsala's own squad list — EV-0831-06
];

const roster: { field: string; value: RosterPlayer; sources: string[] }[] =
  rawRoster.map((p) => ({
    field: `players.roster.${slug(p.name)}`,
    value: {
      name: p.name,
      country: p.country,
      tags: p.alsoUppsala ? [UPPSALA_TAG] : undefined,
      note:
        p.name === 'Roushan Singh'
          ? 'Country unconfirmed — three supplied documents give three different countries (Portugal, India, Netherlands); left unset rather than guessed (EV-0831-06).'
          : undefined,
    },
    sources: ['EV-0831-05'],
  }));

for (const r of roster) {
  // RM-5: Zod-validated, not just TS-shaped — see provenance.ts's
  // ContentRecordSchema doc comment.
  const rec = ContentRecordSchema.parse({
    field: r.field,
    value: r.value,
    status: 'pending_review',
    sources: r.sources,
  }) as ContentRecord;
  const result = evaluate(rec, gateOptions);
  if (!result.passed) {
    throw new Error(
      `Truth gate failed for '${rec.field}': ${result.reasons.map((r2) => `${r2.rule}: ${r2.detail}`).join('; ')}`,
    );
  }
}

export const fullRoster: RosterPlayer[] = roster.map((r) => r.value);
