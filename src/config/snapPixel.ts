/** Public Snap Pixel ID (safe for browser). Override via Easypanel build env. */
export const SNAP_PIXEL_ID =
  process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim() ||
  "fc3323cd-f493-4a59-899d-d533e282c701";

export const SNAP_CURRENCY = "AED" as const;

export const SNAP_CATALOG_SLUGS = [
  "hair-gummies",
  "skin-gummies",
  "eye-serum",
] as const;

export type SnapCatalogSlug = (typeof SNAP_CATALOG_SLUGS)[number];

export function isSnapCatalogSlug(slug: string): slug is SnapCatalogSlug {
  return (SNAP_CATALOG_SLUGS as readonly string[]).includes(slug);
}
