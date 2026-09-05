import { z } from 'zod';
import { provenanced } from './provenance.js';

/**
 * Content types per contracts/CONTENT-CONTRACT.md's table. Zero real UKBT
 * values exist yet (organization_facts_verified = 0,
 * knowledge/07-CONTENT-TRUTH-POLICY.yaml) — these are structural schemas
 * only, exercised so far exclusively by synthetic fixtures in
 * src/__tests__/. Every field here is an org-fact field and therefore
 * `provenanced` — none is populated from artifacts/extraction/ or any
 * Adelux demo content (contracts/RIGHTS-CONTRACT.md, LP-01).
 */

export const ClubInfoSchema = z.object({
  name: provenanced(z.string()),
  foundedYear: provenanced(z.number().int()),
  ground: provenanced(z.string()),
  leagueAffiliation: provenanced(z.string()),
  description: provenanced(z.string()),
});
export type ClubInfo = z.infer<typeof ClubInfoSchema>;

export const LeadershipMemberSchema = z.object({
  name: provenanced(z.string()),
  role: provenanced(z.string()),
  bio: provenanced(z.string()),
  photoAssetId: provenanced(z.string().nullable()),
  term: provenanced(z.string().nullable()),
});
export type LeadershipMember = z.infer<typeof LeadershipMemberSchema>;

export const PlayerSchema = z.object({
  name: provenanced(z.string()),
  squadNumber: provenanced(z.number().int().nullable()),
  position: provenanced(z.string()),
  photoAssetId: provenanced(z.string().nullable()),
  bio: provenanced(z.string().nullable()),
});
export type Player = z.infer<typeof PlayerSchema>;

export const FixtureSchema = z.object({
  opponent: provenanced(z.string()),
  date: provenanced(z.coerce.date()),
  venue: provenanced(z.string()),
  competition: provenanced(z.string()),
});
export type Fixture = z.infer<typeof FixtureSchema>;

export const ResultSchema = z.object({
  fixtureRef: provenanced(z.string()),
  score: provenanced(z.string()),
  scorers: provenanced(z.array(z.string())),
  report: provenanced(z.string().nullable()),
});
export type Result = z.infer<typeof ResultSchema>;

export const StatisticSchema = z.object({
  metric: provenanced(z.string()),
  value: provenanced(z.union([z.number(), z.string()])),
  period: provenanced(z.string()),
});
export type Statistic = z.infer<typeof StatisticSchema>;

/** Rights status is asset-domain, cross-referenced from contracts/ASSET-CONTRACT.md. */
export const MediaAssetRightsStatusSchema = z.enum([
  'ukbt_owned',
  'lablaunchpad_authorized_authored',
  'third_party_cleared',
  'unknown_uncleared',
]);

export const MediaAssetSchema = z.object({
  fileRef: z.string(),
  caption: provenanced(z.string().nullable()),
  credit: provenanced(z.string().nullable()),
  rightsStatus: MediaAssetRightsStatusSchema,
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const ContactDetailSchema = z.object({
  channel: provenanced(z.string()),
  value: provenanced(z.string()),
  purpose: provenanced(z.string().nullable()),
});
export type ContactDetail = z.infer<typeof ContactDetailSchema>;

/**
 * Exempt types (knowledge/07 not_organization_claims) — no provenance
 * wrapper. Never used for an org-fact field.
 */
export const GenericCopySchema = z.object({ body: z.string() });
export type GenericCopy = z.infer<typeof GenericCopySchema>;

export const UIStringSchema = z.object({ key: z.string(), label: z.string() });
export type UIString = z.infer<typeof UIStringSchema>;

/**
 * Navigation item — shared type for header, footer, and any navigation
 * component. Supports nested children for dropdowns.
 */
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
