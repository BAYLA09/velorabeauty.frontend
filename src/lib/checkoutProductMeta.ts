import { isRetiredBundleImageSrc } from "@/config/retiredBundleImage";
import type { BundleQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { getMerchandiseAedForLineQuantity } from "@/config/pricing";
import { normalizeCartLines } from "@/lib/cart/cartPricing";
import { getStoreProductBySlug } from "@/lib/productCatalog";

/** Per-line bundle price (2× hair = 249, 1× skin = 199, …). */
export function allocateCartLinePrices(lines: CartLine[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const line of normalizeCartLines(lines)) {
    out.set(line.slug, getMerchandiseAedForLineQuantity(line.quantity) ?? 0);
  }
  return out;
}

/** Same packshot as homepage product cards (`images.products.*`). */
export function getCheckoutProductImage(slug: string): string | undefined {
  const product = getStoreProductBySlug(slug);
  if (!product) return undefined;
  const homeSrc = product.image.src?.trim();
  if (homeSrc && !isRetiredBundleImageSrc(homeSrc)) return homeSrc;
  const pdpSrc = product.pageImage.src?.trim();
  if (pdpSrc && !isRetiredBundleImageSrc(pdpSrc)) return pdpSrc;
  return undefined;
}

export function bundleOfferLabel(quantity: BundleQuantity): string {
  if (quantity === 1) return "منتج واحد";
  if (quantity === 2) return "منتجان · شهرين";
  return "٣ منتجات · أقوى توفير";
}
