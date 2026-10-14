import type { BundleQuantity } from "@/config/pricing";
import { normalizeCartLines } from "@/lib/cart/cartPricing";
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

export function bundleOfferLabel(quantity: BundleQuantity, lines: CartLine[] = []): string {
  const normalized = normalizeCartLines(lines);
  if (quantity === 1) return "وحدة واحدة";

  if (normalized.length > 1) {
    if (quantity === 2) return "منتجان مختلفان · 249";
    return "٣ منتجات مختلفة · 339";
  }

  if (normalized.length === 1) {
    const form = getProductBySlug(normalized[0].slug)?.page.form;
    const unitPair = form === "serum" ? "عبواتان" : "علبتان";
    const unitThree = form === "serum" ? "3 عبوات" : "3 علب";
    if (quantity === 2) return `${unitPair} · نفس المنتج · 249`;
    return `${unitThree} · نفس المنتج · 339`;
  }

  if (quantity === 2) return "عرض منتجين · 249";
  return "عرض 3 منتجات · 339";
}
