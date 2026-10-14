import { images } from "@/config/images";
import type { BundleQuantity } from "@/config/pricing";
import { getProductBySlug } from "@/lib/productCatalog";

function lineBundleQuantity(units: number): BundleQuantity {
  if (units >= 3) return 3;
  if (units === 2) return 2;
  return 1;
}

/** Same visuals as checkout upsell / cart line thumbnails — not PDP hero (`pageImage.src`). */
export function resolveOrderProductImage(
  productSlug: string,
  lineQuantity = 1,
): { src: string; alt: string } | null {
  if (productSlug === "velora-offer") {
    const src = images.products.bundle.src;
    return src ? { src, alt: "مجموعة فيلورا" } : null;
  }
  const product = getProductBySlug(productSlug);
  if (!product) return null;

  const qty = lineBundleQuantity(lineQuantity);
  const slot = product.pageImage.upsellSlotSrc;
  const src =
    slot?.[qty] ??
    slot?.[1] ??
    product.pageImage.upsellSrc ??
    product.image.src?.trim() ??
    "";

  if (!src) return null;
  return { src, alt: product.name ?? product.image.placeholder ?? "منتج فيلورا" };
}
