// Our Franchises page content, bound to @ukbt/truth's gate. The Uppsala
// Tigers overseas-signings roster is real evidence (EV-20260826-030, an
// "Overseas Signings" graphic) with one explicit exclusion carried
// forward: "Nipo Khadem" was named for removal from any published squad
// list by the client (EV-20260826-027, CLIENT_REQ_008) and very likely
// matches this graphic's "Nipo Khadem" entry — excluded here, not
// rendered.
import { type ContentRecord, createRegistry, evaluate } from '@ukbt/truth/gate';

const registry = createRegistry([
  { id: 'EV-026', tier: 'T1', url: 'artifacts/evidence/EV-20260826-026.yaml' },
  { id: 'EV-029', tier: 'T1', url: 'artifacts/evidence/EV-20260826-029.yaml' },
  { id: 'EV-030', tier: 'T1', url: 'artifacts/evidence/EV-20260826-030.yaml' },
]);
const exemptFields = new Set<string>();
const twoSourceFields = new Set<string>();
const gateOptions = { registry, exemptFields, twoSourceFields };

interface Signing {
  name: string;
  country: string;
  note?: string;
}

const roster: { field: string; value: Signing }[] = [
  {
    field: 'uppsala.signing.chowdhury',
    value: { name: 'Mohammad Chowdhury', country: 'England' },
  },
  {
    field: 'uppsala.signing.hasan',
    value: {
      name: 'Shakibal Hasan',
      country: 'Bangladesh',
      note: 'Name recorded exactly as shown on the source graphic; identity not independently asserted.',
    },
  },
  {
    field: 'uppsala.signing.potgieter',
    value: { name: 'Chad Potgieter', country: 'Portugal' },
  },
  {
    field: 'uppsala.signing.martins',
    value: { name: 'Jeremy Martins', country: 'Portugal' },
  },
  {
    field: 'uppsala.signing.butt',
    value: { name: 'Shaheryar Butt', country: 'Belgium' },
  },
  // "Nipo Khadem" (Portugal) deliberately excluded — CLIENT_REQ_008.
];

for (const r of roster) {
  const rec: ContentRecord = {
    field: r.field,
    value: r.value,
    status: 'pending_review',
    sources: ['EV-030'],
  };
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
