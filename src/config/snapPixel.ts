/** Public Snap Pixel ID — set at build time via Easypanel: NEXT_PUBLIC_SNAP_PIXEL_ID */
export function getSnapPixelId(): string | null {
  const id = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim();
  return id || null;
}

/** @deprecated use getSnapPixelId() — empty string when unset (Snap disabled) */
export const SNAP_PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim() ?? "";

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
