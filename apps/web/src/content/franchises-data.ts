// Our Franchises page content, bound to @ukbt/truth's gate. The Uppsala
// Tigers overseas-signings roster is real evidence (EV-20260826-030, an
// "Overseas Signings" graphic) with one explicit exclusion carried
// forward: "Nipo Khadem" was named for removal from any published squad
// list by the client (EV-20260826-027, CLIENT_REQ_008) and very likely
// matches this graphic's "Nipo Khadem" entry — excluded here, not
// rendered.
//
// Roster corrected/expanded per a client corrections document
// (EV-20260831-001) and the clarifying decision to trust it over the
// prior graphic evidence for two country conflicts (EV-20260831-002):
// Chad Potgieter is now South Africa (was Portugal), Jeremy Martins is
// now Ireland (was Portugal). The Bangladesh signing's name is now
// spelled "Shakib Al Hasan," per the client typing it directly in the
// correction document — a more deliberate signal than the prior
// image-OCR-style read ("Shakibal Hasan"); identity is still not
// asserted beyond the name string. 5 new signings added (Owen Palmer,
// Jaspreet Singh, Armaan Randhawa, Karanbir Singh, Roushan Singh). The
// correction document spells the Belgium signing "Shaheryar But" (one
// fewer letter than the existing "Shaheryar Butt") — judged a likely
// single-letter drop in that document rather than a deliberate
// correction, and left unchanged pending an explicit instruction either
// way (EV-20260831-002 notes).
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
]);
const exemptFields = new Set<string>();
const twoSourceFields = new Set<string>();
const gateOptions = { registry, exemptFields, twoSourceFields };

interface Signing {
  name: string;
  country: string;
  note?: string;
}

const roster: { field: string; value: Signing; sources: string[] }[] = [
  {
    field: 'uppsala.signing.chowdhury',
    value: { name: 'Mohammad Chowdhury', country: 'England' },
    sources: ['EV-030', 'EV-0831-01'],
  },
  {
    field: 'uppsala.signing.hasan',
    value: {
      name: 'Shakib Al Hasan',
      country: 'Bangladesh',
      note: 'Name spelled per the client corrections document (EV-0831-01); identity not independently asserted.',
    },
    sources: ['EV-030', 'EV-0831-01', 'EV-0831-02'],
  },
  {
    field: 'uppsala.signing.potgieter',
    value: { name: 'Chad Potgieter', country: 'South Africa' },
    sources: ['EV-030', 'EV-0831-01', 'EV-0831-02'],
  },
  {
    field: 'uppsala.signing.martins',
    value: { name: 'Jeremy Martins', country: 'Ireland' },
    sources: ['EV-030', 'EV-0831-01', 'EV-0831-02'],
  },
  {
    field: 'uppsala.signing.butt',
    value: { name: 'Shaheryar Butt', country: 'Belgium' },
    sources: ['EV-030'],
  },
  {
    field: 'uppsala.signing.palmer',
    value: { name: 'Owen Palmer', country: 'England' },
    sources: ['EV-0831-01'],
  },
  {
    field: 'uppsala.signing.singh_jaspreet',
    value: { name: 'Jaspreet Singh', country: 'Italy' },
    sources: ['EV-0831-01'],
  },
  {
    field: 'uppsala.signing.randhawa',
    value: { name: 'Armaan Randhawa', country: 'Austria' },
    sources: ['EV-0831-01'],
  },
  {
    field: 'uppsala.signing.singh_karanbir',
    value: { name: 'Karanbir Singh', country: 'Austria' },
    sources: ['EV-0831-01'],
  },
  {
    field: 'uppsala.signing.singh_roushan',
    value: { name: 'Roushan Singh', country: 'Portugal' },
    sources: ['EV-0831-01'],
  },
  // "Nipo Khadem" (Portugal) deliberately excluded — CLIENT_REQ_008.
];

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

export const uppsalaOverseasSignings: Signing[] = roster.map((r) => r.value);

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
