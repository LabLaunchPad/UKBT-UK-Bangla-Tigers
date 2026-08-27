import { describe, expect, it } from 'vitest';
import { ClubInfoSchema, PlayerSchema } from './content-types.js';
import {
  ContentRecordSchema,
  isPlaceholderSentinel,
  placeholderSentinel,
} from './provenance.js';

/**
 * Synthetic fixtures only — none of the values below is a real UK Bangla
 * Tigers fact. See contracts/CONTENT-CONTRACT.md placeholder discipline.
 */
describe('content schema — provenance envelope', () => {
  it('accepts a fully-provenanced draft record with no sources yet', () => {
    const parsed = ClubInfoSchema.parse({
      name: { value: 'Synthetic Test FC' },
      foundedYear: { value: 1999 },
      ground: { value: 'Synthetic Ground' },
      leagueAffiliation: { value: 'Synthetic League' },
      description: { value: 'Fixture text for schema testing only.' },
    });
    expect(parsed.name.status).toBe('draft');
    expect(parsed.name.sources).toBeNull();
  });

  it('accepts a fully-approved record with sources/approver/validUntil', () => {
    const parsed = PlayerSchema.parse({
      name: {
        value: 'Synthetic Player',
        status: 'approved',
        sources: ['SRC-TEST-001', 'SRC-TEST-002'],
        approver: 'Test Approver',
        validUntil: '2027-01-01',
      },
      squadNumber: { value: 7 },
      position: { value: 'Synthetic Position' },
      photoAssetId: { value: null },
      bio: { value: null },
    });
    expect(parsed.name.status).toBe('approved');
    expect(parsed.name.sources).toEqual(['SRC-TEST-001', 'SRC-TEST-002']);
  });

  it('rejects a free-text URL-shaped empty source id', () => {
    expect(() =>
      PlayerSchema.parse({
        name: { value: 'Synthetic Player', sources: [''] },
        squadNumber: { value: null },
        position: { value: 'Synthetic Position' },
        photoAssetId: { value: null },
        bio: { value: null },
      }),
    ).toThrow();
  });
});

describe('ContentRecordSchema — RM-5 (real per-field content shape)', () => {
  it('accepts a real content record shape as used by apps/web/src/content/*.ts', () => {
    const parsed = ContentRecordSchema.parse({
      field: 'org.tagline',
      value: 'Synthetic tagline for schema testing only.',
      status: 'pending_review',
      sources: ['EV-TEST-001'],
    });
    expect(parsed.field).toBe('org.tagline');
    expect(parsed.sources).toEqual(['EV-TEST-001']);
  });

  it('rejects an invalid status value the truth gate would otherwise silently fall through on', () => {
    // gate/rules.ts's evaluate() only special-cases 'draft'; anything else
    // proceeds through the full T1-T8 checks assuming a real status. A
    // typo like 'publised' previously reached evaluate() unchecked — this
    // is exactly the "structural part of the schema" gap RM-5 closes.
    expect(() =>
      ContentRecordSchema.parse({
        field: 'org.tagline',
        value: 'x',
        status: 'publised',
        sources: ['EV-TEST-001'],
      }),
    ).toThrow();
  });

  it('rejects an empty field name', () => {
    expect(() =>
      ContentRecordSchema.parse({
        field: '',
        value: 'x',
        status: 'draft',
        sources: null,
      }),
    ).toThrow();
  });

  it('rejects an empty-string registry id in sources (T2: registry ids, never free text)', () => {
    expect(() =>
      ContentRecordSchema.parse({
        field: 'org.tagline',
        value: 'x',
        status: 'pending_review',
        sources: [''],
      }),
    ).toThrow();
  });
});

describe('placeholder discipline', () => {
  it('generates a machine-distinguishable sentinel, never a plausible value', () => {
    expect(placeholderSentinel('player_name')).toBe(
      '__PLACEHOLDER_PLAYER_NAME__',
    );
    expect(isPlaceholderSentinel('__PLACEHOLDER_PLAYER_NAME__')).toBe(true);
  });

  it('does not mistake a plausible-looking value for a placeholder', () => {
    expect(isPlaceholderSentinel('A. Khan')).toBe(false);
    expect(isPlaceholderSentinel('2015')).toBe(false);
  });
});
