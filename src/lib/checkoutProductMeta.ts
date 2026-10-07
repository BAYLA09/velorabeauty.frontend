import type { BundleQuantity } from "@/config/pricing";
import { getProductBySlug } from "@/lib/productCatalog";
import { HOMEPAGE_PRODUCT_SLUG } from "@/lib/resolveCheckoutContext";

export function getCheckoutProductImage(slug: string): string | undefined {
  if (slug === HOMEPAGE_PRODUCT_SLUG) {
    return getProductBySlug("hair-gummies")?.pageImage.src;
  }
  const product = getProductBySlug(slug);
  return product?.pageImage.src ?? product?.image.src;
}

export function bundleOfferLabel(quantity: BundleQuantity): string {
  if (quantity === 1) return "منتج واحد";
  if (quantity === 2) return "منتجان · شهرين";
  return "٣ منتجات · أقوى توفير";
}
