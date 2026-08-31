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
// One conflict, resolved not guessed: Roushan Singh's country had three
// different values across three documents (Portugal, India,
// Netherlands) — left UNSET per EV-20260831-006, then resolved to
// Portugal per EV-20260831-008 (his own supplied photo, showing a
// Portugal national jersey, corroborating both the filename and the
// original corrections document — 3 sources agree, 1 each for the
// other two).
//
// Photos: EV-20260831-008 supplied photos for the 20 Uppsala Tigers
// squad members (19 of them — not Dhrubonil Roy), reused here for the
// same 19 people rather than treated as separate evidence, since it's
// the same person in both places. No photo exists for the other 22
// UK Bangla Tigers-only names, so per CLIENT_REQ_006 those stay
// text-only — the same RosterGrid component, a mixed photo/no-photo
// grid, not a placeholder standing in for anyone.
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
  {
    id: 'EV-0831-08',
    tier: 'T1',
    url: 'artifacts/evidence/EV-20260831-008.yaml',
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
  photo?: string;
  photoAlt?: string;
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

interface RawPlayer {
  name: string;
  country?: string;
  alsoUppsala?: boolean;
  photoSlug?: string; // matches apps/web/public/media/uppsala-squad/<slug>.jpg
}

const rawRoster: RawPlayer[] = [
  {
    name: 'Mohammad Chowdhury',
    country: 'England',
    alsoUppsala: true,
    photoSlug: 'mohammad-chowdhury',
  },
  {
    name: 'Shakib Al Hasan',
    country: 'Bangladesh',
    alsoUppsala: true,
    photoSlug: 'shakib-al-hasan',
  },
  { name: 'Mark James Nunn', country: 'England' },
  {
    name: 'Karanbir Singh',
    country: 'Austria',
    alsoUppsala: true,
    photoSlug: 'karanbir-singh',
  },
  { name: 'Wayne Parnel', country: 'South Africa' },
  { name: 'Junaid Siddique', country: 'Canada' },
  {
    name: 'Owen Palmer',
    country: 'England',
    alsoUppsala: true,
    photoSlug: 'owen-palmer',
  },
  {
    name: 'Shaheryar Butt',
    country: 'Belgium',
    alsoUppsala: true,
    photoSlug: 'shaheryar-butt',
  },
  {
    name: 'Chad Potgieter',
    country: 'South Africa',
    alsoUppsala: true,
    photoSlug: 'chad-potgieter',
  },
  {
    name: 'Roushan Singh',
    country: 'Portugal',
    alsoUppsala: true,
    photoSlug: 'roushan-singh',
  },
  { name: 'Juan Henri', country: 'Portugal' },
  { name: 'Shabbir Rahman', country: 'Bangladesh' },
  { name: 'Kenner Lewis', country: 'West Indies' },
  {
    name: 'Jaspreet Singh',
    country: 'Italy',
    alsoUppsala: true,
    photoSlug: 'jaspreet-singh',
  },
  { name: 'Pater Robert Harness', country: 'England' },
  { name: 'Amahl Nathaniel', country: 'West Indies' },
  {
    name: 'Armaan Randhawa',
    country: 'Austria',
    alsoUppsala: true,
    photoSlug: 'armaan-randhawa',
  },
  { name: 'Sufyan Mehmood', country: 'Oman' },
  { name: 'Arafat Bhuiyan', country: 'England' },
  {
    name: 'Jawid Stanigze',
    country: 'Afghanistan',
    alsoUppsala: true,
    photoSlug: 'jawid-stanigze',
  },
  { name: 'Rajesh Sharma', country: 'India' },
  {
    name: 'Chinthaka Rajapaksha',
    country: 'Sri Lanka',
    alsoUppsala: true,
    photoSlug: 'chinthaka-rajapaksha',
  },
  { name: 'Elias Sunny', country: 'Bangladesh' },
  { name: 'Ruman Ahmed', country: 'Bangladesh' },
  { name: 'Forhad Reza', country: 'Bangladesh' },
  {
    name: 'Tasaduq Hussain',
    country: 'Sweden',
    alsoUppsala: true,
    photoSlug: 'tasaduq-hussain',
  },
  { name: 'Tawfique Khan Tushar', country: 'Bangladesh' },
  {
    name: 'Lemar Momand',
    country: 'Afghanistan',
    alsoUppsala: true,
    photoSlug: 'lemar-momand',
  },
  {
    name: 'Humayun Kabir Jyoti',
    country: 'USA',
    alsoUppsala: true,
    photoSlug: 'humayun-kabir-jyoti',
  },
  { name: 'Raminda Wijesooriya', country: 'Sri Lanka' },
  { name: 'Towker Khan', country: 'USA' },
  {
    name: 'Prashant Shukla',
    country: 'India',
    alsoUppsala: true,
    photoSlug: 'prashant-shukla',
  },
  { name: 'Anop Ravi', country: 'Canada' },
  {
    name: 'Qudratullah Mir Afzal',
    country: 'Sweden',
    alsoUppsala: true,
    photoSlug: 'qudratullah-mir-afzal',
  },
  { name: 'Elliot Green', country: 'England' },
  {
    name: 'Hamid Mahmood',
    country: 'Sweden',
    alsoUppsala: true,
    photoSlug: 'hamid-mahmood',
  },
  {
    name: 'Anas Zaheer',
    country: 'Sweden',
    alsoUppsala: true,
    photoSlug: 'anas-zaheer',
  },
  {
    name: 'Essa Farooq',
    country: 'Sweden',
    alsoUppsala: true,
    photoSlug: 'essa-farooq',
  },
  { name: 'Dhrubonil Roy', country: 'Sweden', alsoUppsala: true }, // no photo supplied — EV-0831-08
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
          ? 'Country was unconfirmed across three conflicting documents; resolved to Portugal once his own supplied photo and its filename both corroborated it (EV-0831-08).'
          : undefined,
      photo: p.photoSlug
        ? `/media/uppsala-squad/${p.photoSlug}.jpg`
        : undefined,
      photoAlt: p.photoSlug ? `${p.name} — Uppsala Tigers` : undefined,
    },
    sources: p.photoSlug ? ['EV-0831-05', 'EV-0831-08'] : ['EV-0831-05'],
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
