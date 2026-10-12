import { productPages } from "@/config/productPages";
import type { ProductId } from "@/config/products";

/** Slugs eligible for 199 / 249 / 339 bundle pricing (all Velora sellable units). */
const ELIGIBLE_BY_ID: Record<ProductId, string> = {
  hair: productPages.hair.slug,
  skin: productPages.skin.slug,
  eye: productPages.eye.slug,
};

export const ELIGIBLE_PRODUCT_SLUGS: readonly string[] = Object.values(ELIGIBLE_BY_ID);

export function isEligibleProductSlug(slug: string): boolean {
  return ELIGIBLE_PRODUCT_SLUGS.includes(slug);
}
