import { z } from 'zod';

/**
 * Per-field provenance metadata, structural on every org-fact field
 * (contracts/CONTENT-CONTRACT.md — "not an optional bolt-on"). A field
 * added without this wrapper fails to compile against the base schema,
 * which is what makes T1's fail-closed default mechanically real rather
 * than a lint suggestion.
 */
export const ContentStatusSchema = z.enum([
  'draft',
  'pending_review',
  'approved',
  'published',
]);
export type ContentStatus = z.infer<typeof ContentStatusSchema>;

export const RegistryIdSchema = z
  .string()
  .min(
    1,
    'a source must be a non-empty registry id, never a raw URL or free text (T2)',
  );

export const ProvenanceMetaSchema = z.object({
  sources: z.array(RegistryIdSchema).nullable().default(null),
  status: ContentStatusSchema.default('draft'),
  validUntil: z.coerce.date().nullable().default(null),
  approver: z.string().min(1).nullable().default(null),
  isPlaceholder: z.boolean().default(false),
});

/** Wraps a value schema with the mandatory provenance envelope for an org-fact field. */
export function provenanced<T extends z.ZodTypeAny>(valueSchema: T) {
  return ProvenanceMetaSchema.extend({ value: valueSchema });
}

export type Provenanced<T> = z.infer<typeof ProvenanceMetaSchema> & {
  value: T;
};

/**
 * knowledge/07 placeholder discipline: a placeholder is machine-
 * distinguishable by this sentinel form, never a plausible-looking value.
 */
export function placeholderSentinel(fieldName: string): string {
  return `__PLACEHOLDER_${fieldName.toUpperCase()}__`;
}

export function isPlaceholderSentinel(value: unknown): boolean {
  return (
    typeof value === 'string' && /^__PLACEHOLDER_[A-Z0-9_]+__$/.test(value)
  );
}
