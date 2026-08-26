// Homepage content bound to @ukbt/truth's gate — every organizational
// fact below is checked against T1-T8 at build time, not hard-coded past
// the truth architecture. Status is 'pending_review' throughout: this is
// a first visual-review build (Stage 7G), not a formally approved
// publication — 'approved'/'published' require a named human approver
// (T6), which does not yet exist. See artifacts/brand/UKBT-BRAND-FOUNDATION.md
// and artifacts/pages/HOMEPAGE-CONTRACT.md for the decisions this data reflects.
import { type ContentRecord, createRegistry, evaluate } from '@ukbt/truth/gate';

const registry = createRegistry([
  { id: 'EV-026', tier: 'T1', url: 'artifacts/evidence/EV-20260826-026.yaml' },
  { id: 'EV-028', tier: 'T2', url: 'artifacts/evidence/EV-20260826-028.yaml' },
  { id: 'EV-029', tier: 'T1', url: 'artifacts/evidence/EV-20260826-029.yaml' },
  { id: 'EV-030', tier: 'T1', url: 'artifacts/evidence/EV-20260826-030.yaml' },
]);

const exemptFields = new Set([
  'nav.home',
  'nav.about',
  'nav.captain',
  'nav.players',
  'nav.franchises',
  'nav.tournaments',
  'nav.contact',
  'cta.primary.label',
]);

// Tagline is corroborated by two independent sources (EV-028 WebSearch,
// EV-029 client image) — genuinely, not nominally, so it's the one field
// held to T7's two-distinct-source rule.
const twoSourceFields = new Set(['org.tagline']);

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
  taglineLong: {
    field: 'org.tagline',
    value: 'We are not only a team, but also an institute for learning.',
    sources: ['EV-028', 'EV-029'],
  },
  taglineShort: {
    field: 'org.tagline_short',
    value: 'United by Passion. Driven by Cricket.',
    sources: ['EV-030'],
  },
  statPlayers: { field: 'org.stat_players', value: '30+', sources: ['EV-026'] },
  statCountries: {
    field: 'org.stat_countries',
    value: '15+',
    sources: ['EV-026'],
  },
  statTournaments: {
    field: 'org.stat_tournaments',
    value: '7+',
    sources: ['EV-026'],
  },
  captainName: {
    field: 'org.captain_name',
    value: 'Mohammad Chowdhury',
    sources: ['EV-026', 'EV-029'],
  },
  captainRole: {
    field: 'org.captain_role',
    value: 'Founder & CEO, Club Captain',
    sources: ['EV-029', 'EV-026'],
  },
  franchiseName: {
    field: 'org.sister_franchise',
    value: 'Uppsala Tigers',
    sources: ['EV-026', 'EV-029'],
  },
} satisfies Record<string, Fact<string>>;

const tournamentUpcoming = [
  {
    name: 'Nordic Lights',
    when: 'September 2026',
    where: 'Norway',
    field: 'org.tournament.nordic_lights',
    sources: ['EV-026'],
  },
  {
    name: 'Global T20 Championship',
    when: 'October 2026',
    where: 'Romania',
    field: 'org.tournament.global_t20',
    sources: ['EV-026'],
  },
];

const socialLinks = [
  {
    platform: 'facebook',
    url: 'https://www.facebook.com/UKBanglaTigers',
    field: 'org.social.facebook',
    sources: ['EV-026'],
  },
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/ukbanglatigers/',
    field: 'org.social.instagram',
    sources: ['EV-026'],
  },
  {
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@uk.bangla.tigers',
    field: 'org.social.tiktok',
    sources: ['EV-026'],
  },
  {
    platform: 'x',
    url: 'https://x.com/ukbanglatigers',
    field: 'org.social.x',
    sources: ['EV-026'],
  },
];

const gateOptions = { registry, exemptFields, twoSourceFields };

// Fail-closed: any org-fact that doesn't pass the truth gate stops the
// build rather than silently rendering. Real enforcement, not a comment.
const allRecords: ContentRecord[] = [
  ...Object.values(facts).map((f) => record(f)),
  ...tournamentUpcoming.map((t) =>
    record({ field: t.field, value: t, sources: t.sources }),
  ),
  ...socialLinks.map((s) =>
    record({ field: s.field, value: s, sources: s.sources }),
  ),
];

for (const rec of allRecords) {
  const result = evaluate(rec, gateOptions);
  if (!result.passed) {
    throw new Error(
      `Truth gate failed for '${rec.field}': ${result.reasons.map((r) => `${r.rule}: ${r.detail}`).join('; ')}`,
    );
  }
}

export const homepage = {
  tagline: facts.taglineLong.value,
  taglineShort: facts.taglineShort.value,
  stats: {
    players: facts.statPlayers.value,
    countries: facts.statCountries.value,
    tournaments: facts.statTournaments.value,
  },
  captain: {
    name: facts.captainName.value,
    role: facts.captainRole.value,
  },
  sisterFranchise: facts.franchiseName.value,
  upcomingTournaments: tournamentUpcoming,
  social: socialLinks,
  // The primary nav is exactly CLIENT_REQ_001's stated seven items; the
  // template-mirrored routes (CLIENT_REQ_009) are reachable from the
  // footer instead, so the client's own IA is not silently widened.
  // The commerce-shaped shells (/services, /membership, /join) appear in
  // NEITHER: ROUTE-CONTRACT Amendment 01 condition 2 keeps them out of
  // navigation until they carry real content.
  secondaryNav: [
    { label: 'Community', href: '/community' },
    { label: 'Coaching & Development', href: '/coaching' },
    { label: 'Club News', href: '/news' },
    { label: 'FAQ', href: '/faq' },
  ],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Club Captain', href: '/club-captain' },
    { label: 'Players Profile', href: '/players' },
    { label: 'Our Franchises', href: '/franchises' },
    { label: 'International Tournaments/Events', href: '/tournaments' },
    { label: 'Contact Us', href: '/contact' },
  ],
};
