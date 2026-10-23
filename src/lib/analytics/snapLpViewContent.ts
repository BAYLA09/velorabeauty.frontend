/** Snap LP slugs that fire VIEW_CONTENT on mount. */
export const SNAP_LP_VIEW_CONTENT_SLUGS: readonly string[] = ["hair-gummies"];

export function snapLpViewContentValueAed(slug: string, priceAed: number): number | undefined {
  return SNAP_LP_VIEW_CONTENT_SLUGS.includes(slug) ? priceAed : undefined;
}
