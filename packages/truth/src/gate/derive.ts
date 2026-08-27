import type { ContentRecord } from './types.js';

/**
 * T9: a computed/derived value inherits the union of its inputs'
 * provenance and the earliest validUntil among them.
 */
export function deriveProvenance(
  inputs: readonly Pick<ContentRecord, 'sources' | 'validUntil'>[],
): Pick<ContentRecord, 'sources' | 'validUntil'> {
  const sourceSet = new Set<string>();
  let earliest: Date | null = null;

  for (const input of inputs) {
    for (const id of input.sources ?? []) sourceSet.add(id);
    if (
      input.validUntil != null &&
      (earliest == null || input.validUntil.getTime() < earliest.getTime())
    ) {
      earliest = input.validUntil;
    }
  }

  return { sources: [...sourceSet], validUntil: earliest };
}
