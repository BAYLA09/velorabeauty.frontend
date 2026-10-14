import { images } from "@/config/images";
import { getProductBySlug } from "@/lib/productCatalog";

export function resolveOrderProductImage(productSlug: string): { src: string; alt: string } | null {
  if (productSlug === "velora-offer") {
    const src = images.products.bundle.src;
    return src ? { src, alt: "مجموعة فيلورا" } : null;
  }
  const product = getProductBySlug(productSlug);
  const src = product?.pageImage.src ?? product?.image.src;
  if (!src) return null;
  return { src, alt: product?.name ?? "منتج فيلورا" };
}
