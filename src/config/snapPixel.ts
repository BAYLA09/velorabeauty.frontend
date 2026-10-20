/** Velora Beauty UAE — Snap Pixel (Ads Manager). */
export const VELORA_SNAP_PIXEL_ID = "628f12d8-df4e-4272-889a-4806255011cd";

/** Retired pixel — never load or accept from env. */
export const LEGACY_SNAP_PIXEL_ID = "fc3323cd-f493-4a59-899d-d533e282c701";

/** Public Snap Pixel ID — baked at build via NEXT_PUBLIC_SNAP_PIXEL_ID (optional override). */
export function getSnapPixelId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID?.trim();
  if (fromEnv && fromEnv !== LEGACY_SNAP_PIXEL_ID) return fromEnv;
  return VELORA_SNAP_PIXEL_ID;
}

export function isSnapPixelConfigured(): boolean {
  return Boolean(getSnapPixelId());
}

export const SNAP_CURRENCY = "AED" as const;

export const SNAP_CATALOG_SLUGS = [
  "hair-gummies",
  "skin-gummies",
  "eye-serum",
  "warm",
] as const;

export type SnapCatalogSlug = (typeof SNAP_CATALOG_SLUGS)[number];

export function isSnapCatalogSlug(slug: string): slug is SnapCatalogSlug {
  return (SNAP_CATALOG_SLUGS as readonly string[]).includes(slug);
}
