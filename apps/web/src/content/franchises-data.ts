// Our Franchises page content, bound to @ukbt/truth's gate. The Uppsala
// Tigers squad is real evidence — originally an "Overseas Signings"
// graphic (EV-20260826-030), later a full squad list and country
// corrections (EV-20260831-001/-002), now superseded by the club's own
// "Uppsala Tigers Players & Managements List" (EV-20260831-005/-006),
// which supplies the full 20-player squad (9 overseas signings + 11
// domestic players, three of them U-19) plus team officials. "Nipo
// Khadem" was named for removal from any published squad list by the
// client (EV-20260826-027, CLIENT_REQ_008) and is absent from every
// squad list supplied since — excluded here, not rendered.
//
// Two conflicts resolved per EV-20260831-006, not guessed:
// - Roushan Singh's country has three conflicting values across three
//   documents (Portugal, India, Netherlands) — left UNSET here, not
//   silently defaulted to any of them; the UI renders "Country
//   unconfirmed" with a note.
// - Jeremy Martins is on the UK Bangla Tigers master players list
//   (players-data.ts) but NOT on Uppsala Tigers' own squad list, despite
//   being live here previously — removed from this file; see
//   players-data.ts for where he now appears.
import { type ContentRecord, createRegistry, evaluate } from '@ukbt/truth/gate';
import { ContentRecordSchema } from '@ukbt/truth/schema';

const registry = createRegistry([
  { id: 'EV-026', tier: 'T1', url: 'artifacts/evidence/EV-20260826-026.yaml' },
  { id: 'EV-029', tier: 'T1', url: 'artifacts/evidence/EV-20260826-029.yaml' },
  { id: 'EV-030', tier: 'T1', url: 'artifacts/evidence/EV-20260826-030.yaml' },
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

export interface SquadMember {
  name: string;
  country?: string;
  tags?: string[];
  note?: string;
}

const squad: { field: string; value: SquadMember; sources: string[] }[] = [
  {
    field: 'uppsala.squad.chowdhury',
    value: {
      name: 'Mohammad Chowdhury',
      country: 'England',
      tags: ['Captain', 'Overseas Signing'],
    },
    sources: ['EV-030', 'EV-0831-01', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.hasan',
    value: {
      name: 'Shakib Al Hasan',
      country: 'Bangladesh',
      tags: ['Overseas Signing'],
      note: 'Name spelled per the client corrections document (EV-0831-01); identity not independently asserted.',
    },
    sources: ['EV-030', 'EV-0831-01', 'EV-0831-02', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.singh_karanbir',
    value: {
      name: 'Karanbir Singh',
      country: 'Austria',
      tags: ['Overseas Signing'],
    },
    sources: ['EV-0831-01', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.palmer',
    value: {
      name: 'Owen Palmer',
      country: 'England',
      tags: ['Overseas Signing', 'Wicketkeeper'],
    },
    sources: ['EV-0831-01', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.butt',
    value: {
      name: 'Shaheryar Butt',
      country: 'Belgium',
      tags: ['Overseas Signing'],
    },
    sources: ['EV-030', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.potgieter',
    value: {
      name: 'Chad Potgieter',
      country: 'South Africa',
      tags: ['Overseas Signing'],
    },
    sources: ['EV-030', 'EV-0831-01', 'EV-0831-02', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.singh_roushan',
    value: {
      name: 'Roushan Singh',
      tags: ['Overseas Signing', 'Wicketkeeper'],
      note: 'Country unconfirmed — three supplied documents give three different countries (Portugal, India, Netherlands); left unset rather than guessed (EV-0831-06).',
    },
    sources: ['EV-0831-01', 'EV-0831-05', 'EV-0831-06'],
  },
  {
    field: 'uppsala.squad.singh_jaspreet',
    value: {
      name: 'Jaspreet Singh',
      country: 'Italy',
      tags: ['Overseas Signing'],
    },
    sources: ['EV-0831-01', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.randhawa',
    value: {
      name: 'Armaan Randhawa',
      country: 'Austria',
      tags: ['Overseas Signing'],
    },
    sources: ['EV-0831-01', 'EV-0831-05'],
  },
  {
    field: 'uppsala.squad.stanigze',
    value: { name: 'Jawid Stanigze', country: 'Afghanistan' },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.rajapaksha',
    value: { name: 'Chinthaka Rajapaksha', country: 'Sri Lanka' },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.hussain',
    value: { name: 'Tasaduq Hussain', country: 'Sweden' },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.momand',
    value: { name: 'Lemar Momand', country: 'Afghanistan' },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.jyoti',
    value: {
      name: 'Humayun Kabir Jyoti',
      country: 'USA',
      tags: ['Wicketkeeper'],
    },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.shukla',
    value: { name: 'Prashant Shukla', country: 'India' },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.afzal',
    value: { name: 'Qudratullah Mir Afzal', country: 'Sweden' },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.mahmood',
    value: { name: 'Hamid Mahmood', country: 'Sweden' },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.zaheer',
    value: { name: 'Anas Zaheer', country: 'Sweden', tags: ['U-19'] },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.farooq',
    value: { name: 'Essa Farooq', country: 'Sweden', tags: ['U-19'] },
    sources: ['EV-0831-05'],
  },
  {
    field: 'uppsala.squad.roy',
    value: { name: 'Dhrubonil Roy', country: 'Sweden', tags: ['U-19'] },
    sources: ['EV-0831-05'],
  },
  // "Nipo Khadem" deliberately excluded — CLIENT_REQ_008.
];

for (const r of squad) {
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

export const uppsalaSquad: SquadMember[] = squad.map((r) => r.value);
export const uppsalaOverseasSignings: SquadMember[] = uppsalaSquad.filter((m) =>
  m.tags?.includes('Overseas Signing'),
);

export interface TeamOfficial {
  role: string;
  name: string;
}

// EV-20260831-005 — "Uppsala Tigers Players & Managements List".
export const uppsalaOfficials: TeamOfficial[] = [
  { role: 'Coach', name: 'Shaftab Khalid' },
  { role: 'Team Manager', name: 'AGM Sabbir' },
  { role: 'Logistics Manager', name: 'MD Ashraful Alam' },
  { role: 'Team Mentor', name: 'Javed Butt' },
];

export const uppsalaFacts = [
  {
    title: 'Based in Sweden',
    body: "UK Bangla Tigers' sister franchise, competing internationally.",
  },
  {
    title: 'Nordic Smash T20',
    body: 'Competed in the Nordic Smash T20 tournament, Sweden.',
  },
];

// The Our Franchises landing (/franchises) is a card grid, one entry per
// sister franchise, per the client's instruction that Uppsala Tigers sit
// under a clickable "Our Franchise" list "in future there will be more in
// the list" (EV-0831-01/EV-0831-02). Only Uppsala Tigers is evidenced
// today — this list is not pre-populated with any invented future entry.
//
// `logo` is Uppsala Tigers' own supplied crest (EV-20260831-004,
// apps/web/src/assets/MANIFEST.md), replacing the UK Bangla Tigers crest
// this page and the detail page fell back to before it was supplied.
export interface FranchiseSummary {
  slug: string;
  name: string;
  country: string;
  blurb: string;
  logo: string;
  logoAlt: string;
}

export const ourFranchises: FranchiseSummary[] = [
  {
    slug: 'uppsala-tigers',
    name: 'Uppsala Tigers',
    country: 'Sweden',
    blurb: "UK Bangla Tigers' sister franchise, competing internationally.",
    logo: '/brand/uppsala-tigers-crest.jpg',
    logoAlt: 'Uppsala Tigers crest',
  },
];
