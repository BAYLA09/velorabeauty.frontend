import type { BundleQuantity } from "@/config/pricing";
import { getProductBySlug } from "@/lib/productCatalog";

/** Same packshot as homepage product cards (`images.products.*`). */
export function getCheckoutProductImage(slug: string): string | undefined {
  const product = getProductBySlug(slug);
  if (!product) return undefined;
  const homeSrc = product.image.src?.trim();
  if (homeSrc) return homeSrc;
  return product.pageImage.src?.trim() || undefined;
}

export function bundleOfferLabel(quantity: BundleQuantity): string {
  if (quantity === 1) return "منتج واحد";
  if (quantity === 2) return "منتجان · شهرين";
  return "٣ منتجات · أقوى توفير";
}
