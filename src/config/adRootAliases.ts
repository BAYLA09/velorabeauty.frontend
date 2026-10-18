/**
 * Root-level ad URLs (e.g. /hair-ads) → canonical /ads/{slug} handler.
 * Query strings are preserved by Next.js redirects.
 */
export const AD_ROOT_ALIASES: { source: string; slug: string }[] = [
  { source: "/hair-ads", slug: "hair-ads" },
  { source: "/hair-ad", slug: "hair-ad" },
  { source: "/skin-ads", slug: "skin-ads" },
  { source: "/skin-ad", slug: "skin-ad" },
  { source: "/eye-ads", slug: "eye-ads" },
  { source: "/eye-ad", slug: "eye-ad" },
];
