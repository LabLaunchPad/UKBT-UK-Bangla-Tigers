// About Us page content bound to @ukbt/truth's gate — same discipline as
// homepage-data.ts. Facts here are About-specific (founding/legal entity,
// leadership, mission facts); shared site-wide facts (nav, social) are
// imported from homepage-data.ts rather than re-declared, so they are
// gated exactly once.
import { type ContentRecord, createRegistry, evaluate } from '@ukbt/truth/gate';

const registry = createRegistry([
  { id: 'EV-026', tier: 'T1', url: 'artifacts/evidence/EV-20260826-026.yaml' },
  { id: 'EV-028', tier: 'T2', url: 'artifacts/evidence/EV-20260826-028.yaml' },
  { id: 'EV-029', tier: 'T1', url: 'artifacts/evidence/EV-20260826-029.yaml' },
]);

const exemptFields = new Set<string>();
const twoSourceFields = new Set(['org.tagline']);
const gateOptions = { registry, exemptFields, twoSourceFields };

interface Fact<T> {
  field: string;
  value: T;
  sources: string[];
}

function record(f: Fact<unknown>): ContentRecord {
  return {
    field: f.field,
    value: f.value,
    status: 'pending_review',
    sources: f.sources,
  };
}

const facts = {
  tagline: {
    field: 'org.tagline',
    value: 'We are not only a team, but also an institute for learning.',
    sources: ['EV-028', 'EV-029'],
  },
  founded: { field: 'org.founded', value: '2020', sources: ['EV-029'] },
  legalEntity: {
    field: 'org.legal_entity',
    value: 'UK Bangla Tigers Cricket Club CIC',
    sources: ['EV-028'],
  },
  statPlayers: { field: 'org.stat_players', value: '30+', sources: ['EV-026'] },
  statTournaments: {
    field: 'org.stat_tournaments',
    value: '7+',
    sources: ['EV-026'],
  },
  founderCeo: {
    field: 'org.leader.founder_ceo',
    value: { name: 'Mohammad Chowdhury', role: 'Founder & CEO, Club Captain' },
    sources: ['EV-026', 'EV-029'],
  },
  actingChairman: {
    field: 'org.leader.acting_chairman',
    value: { name: 'MD Shahidul Alam Ratan', role: 'Acting Chairman' },
    sources: ['EV-026', 'EV-029'],
  },
  viceChairman: {
    field: 'org.leader.vice_chairman',
    value: { name: 'Sayem Rahman', role: 'Vice-Chairman' },
    sources: ['EV-029'],
  },
} satisfies Record<string, Fact<unknown>>;

const allRecords: ContentRecord[] = Object.values(facts).map((f) => record(f));

for (const rec of allRecords) {
  const result = evaluate(rec, gateOptions);
  if (!result.passed) {
    throw new Error(
      `Truth gate failed for '${rec.field}': ${result.reasons.map((r) => `${r.rule}: ${r.detail}`).join('; ')}`,
    );
  }
}

export const about = {
  tagline: facts.tagline.value,
  founded: facts.founded.value,
  legalEntity: facts.legalEntity.value,
  stats: {
    players: facts.statPlayers.value,
    tournaments: facts.statTournaments.value,
  },
  missionFacts: [
    {
      title: 'International Cricket',
      body: 'Competing on the international stage, from the Safari International T20 Cup to the upcoming Nordic Lights and Global T20 Championship.',
    },
    {
      title: 'Community & Learning',
      body: facts.tagline.value,
    },
    {
      title: 'Sister Franchise Network',
      body: 'Part of a multi-franchise family alongside Uppsala Tigers (Sweden).',
    },
    {
      title: 'Registered Organisation',
      body: `Founded ${facts.founded.value} as ${facts.legalEntity.value}.`,
    },
  ],
  storyParagraphs: [
    facts.tagline.value,
    `${facts.legalEntity.value}, founded in ${facts.founded.value}, competes as a cricket franchise on the international stage while building a sister-franchise network with Uppsala Tigers in Sweden.`,
  ],
  leaders: [
    facts.founderCeo.value,
    facts.actingChairman.value,
    facts.viceChairman.value,
  ],
};
