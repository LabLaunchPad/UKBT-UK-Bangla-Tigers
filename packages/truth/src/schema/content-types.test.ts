import { describe, expect, it } from 'vitest';
import { ClubInfoSchema, PlayerSchema } from './content-types.js';
import { isPlaceholderSentinel, placeholderSentinel } from './provenance.js';

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

describe('placeholder discipline', () => {
  it('generates a machine-distinguishable sentinel, never a plausible value', () => {
    expect(placeholderSentinel('player_name')).toBe('__PLACEHOLDER_PLAYER_NAME__');
    expect(isPlaceholderSentinel('__PLACEHOLDER_PLAYER_NAME__')).toBe(true);
  });

  it('does not mistake a plausible-looking value for a placeholder', () => {
    expect(isPlaceholderSentinel('A. Khan')).toBe(false);
    expect(isPlaceholderSentinel('2015')).toBe(false);
  });
});
