import type { BundleQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { getProductBySlug } from "@/lib/productCatalog";

/** Split bundle merchandise across lines (display only; order total unchanged). */
export function allocateCartLinePrices(
  lines: CartLine[],
  merchandiseAed: number,
): Map<string, number> {
  const units = lines.reduce((sum, l) => sum + l.quantity, 0);
  if (units <= 0) return new Map();
  const out = new Map<string, number>();
  let allocated = 0;
  lines.forEach((line, index) => {
    if (index === lines.length - 1) {
      out.set(line.slug, merchandiseAed - allocated);
      return;
    }
    const part = Math.round((line.quantity / units) * merchandiseAed);
    out.set(line.slug, part);
    allocated += part;
  });
  return out;
}

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
