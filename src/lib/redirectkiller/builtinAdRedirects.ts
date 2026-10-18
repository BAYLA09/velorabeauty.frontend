/**
 * Default /ads/{slug} targets when SQLite has no row yet (safe, internal paths only).
 * Override anytime in Redirect Killer — DB rows take precedence.
 */
const DEFAULT_BUILTIN: Record<string, string> = {
  "hair-ad": "/products/hair-gummies",
  "hair-ads": "/products/hair-gummies",
  "skin-ad": "/products/skin-gummies",
  "skin-ads": "/products/skin-gummies",
  "eye-ad": "/products/eye-serum",
  "eye-ads": "/products/eye-serum",
  "lp-ad": "/lp",
};

export function getBuiltinAdDestination(slug: string): string | null {
  const fromEnv = process.env.REDIRECTKILLER_BUILTIN_REDIRECTS_JSON?.trim();
  if (fromEnv) {
    try {
      const parsed = JSON.parse(fromEnv) as Record<string, string>;
      const v = parsed[slug]?.trim();
      if (v?.startsWith("/") && !v.startsWith("//")) return v;
    } catch {
      /* fall through */
    }
  }
  return DEFAULT_BUILTIN[slug] ?? null;
}
