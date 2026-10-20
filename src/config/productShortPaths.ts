/** Short URLs → canonical product PDP paths (ads, bookmarks, old links). */
export const PRODUCT_SHORT_PATH_REDIRECTS = [
  { short: "/warm", canonical: "/products/warm" },
  { short: "/hair-gummies", canonical: "/products/hair-gummies" },
  { short: "/skin-gummies", canonical: "/products/skin-gummies" },
  { short: "/eye-serum", canonical: "/products/eye-serum" },
  { short: "/eye-gummies", canonical: "/products/eye-serum" },
] as const;

export function canonicalProductPath(path: string): string | null {
  const pathOnly = path.split("?")[0] ?? path;
  const hit = PRODUCT_SHORT_PATH_REDIRECTS.find((r) => r.short === pathOnly);
  return hit?.canonical ?? null;
}
