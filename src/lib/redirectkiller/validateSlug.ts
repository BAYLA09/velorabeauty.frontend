const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export function normalizeRedirectSlug(raw: string): string | null {
  const slug = raw.trim().toLowerCase();
  if (!slug || slug.length > 64) return null;
  if (!SLUG_RE.test(slug)) return null;
  return slug;
}
