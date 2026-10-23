/**
 * Snap LP → catalog PDP redirects (query string preserved at redirect time).
 * Only listed slugs redirect; others keep the snap LP experience.
 */
const SNAP_LP_TO_PDP: Record<string, string> = {
  "hair-gummies": "/products/hair-gummies",
};

export function getSnapLpPdpRedirect(slug: string): string | null {
  const dest = SNAP_LP_TO_PDP[slug]?.trim();
  return dest?.startsWith("/") && !dest.startsWith("//") ? dest : null;
}

/** `/lp/snap/{slug}` → PDP path, or null when the snap LP should render. */
export function getSnapLpRedirectFromPathname(pathname: string): string | null {
  const pathOnly = pathname.split("?")[0] ?? pathname;
  const normalized = pathOnly.replace(/\/$/, "") || "/";
  const prefix = "/lp/snap/";
  if (!normalized.startsWith(prefix)) return null;
  const slug = normalized.slice(prefix.length);
  if (!slug || slug.includes("/")) return null;
  return getSnapLpPdpRedirect(slug);
}
