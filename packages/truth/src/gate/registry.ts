import type { RegistrySource, SourceRegistry } from './types.js';

/**
 * Builds a source registry from a flat list. U-22 (who owns/maintains the
 * real registry) is unresolved — see contracts/TRUTH-CONTRACT.md. This
 * helper is registry-shape infrastructure only; it does not itself
 * populate any real UKBT source.
 */
export function createRegistry(
  sources: readonly RegistrySource[],
): SourceRegistry {
  const map = new Map<string, RegistrySource>();
  for (const source of sources) {
    map.set(source.id, source);
  }
  return map;
}
