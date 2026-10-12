import type { CartLine } from "@/lib/cart/cartTypes";
import { MIXED_CART_PRODUCT_SLUG } from "@/lib/cart/cartTypes";
import { getProductBySlug } from "@/lib/productCatalog";

export function buildMixedCartSummary(lines: CartLine[]): {
  productSlug: string;
  productName: string;
} {
  const parts = lines.map((line) => {
    const product = getProductBySlug(line.slug);
    const name = product?.name ?? line.slug;
    return line.quantity > 1 ? `${name} ×${line.quantity}` : name;
  });
  return {
    productSlug: MIXED_CART_PRODUCT_SLUG,
    productName: parts.join(" · "),
  };
}
