/** Catalog slug for hair gummies PDP / checkout. */
export const HAIR_GUMMIES_PRODUCT_SLUG = "hair-gummies";

/**
 * When true, hair-gummies shows backorder reservation copy on PDP and checkout.
 * Set to `false` when stock is back in warehouse.
 */
export const HAIR_GUMMIES_BACKORDER = true;

export const HAIR_GUMMIES_BACKORDER_NOTICE_AR =
  "نفدت الكمية مؤقتاً — المخزون الجديد واصل قريباً جداً. احجزي حبتك الحين ونتواصل معك أول ما يوصل.";

export const HAIR_GUMMIES_BACKORDER_CTA_LABEL = "احجزي الحين";

export function isHairGummiesBackorderReservation(productSlug: string): boolean {
  return productSlug === HAIR_GUMMIES_PRODUCT_SLUG && HAIR_GUMMIES_BACKORDER;
}
