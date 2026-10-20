import { images } from "@/config/images";
import { isRetiredBundleImageSrc } from "@/config/retiredBundleImage";
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
  if (productSlug === "velora-offer" || productSlug === "velora-mixed-cart") {
    const src = images.products.hair.src?.trim();
    return src ? { src, alt: "فيلورا" } : null;
  }
  const product = getProductBySlug(productSlug);
  if (!product) return null;

  const qty = lineBundleQuantity(lineQuantity);
  const slot = product.pageImage.upsellSlotSrc;
  const candidates = [
    slot?.[qty],
    slot?.[1],
    product.pageImage.upsellSrc,
    product.image.src?.trim(),
  ];
  const src = candidates.find((c) => c?.trim() && !isRetiredBundleImageSrc(c))?.trim() ?? "";

  if (!src) return null;
  return { src, alt: product.name ?? product.image.placeholder ?? "منتج فيلورا" };
}
