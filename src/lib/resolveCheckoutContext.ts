import { redirect } from "next/navigation";
import type { BundleQuantity } from "@/config/pricing";
import { getProductBySlug } from "@/lib/productCatalog";
import { parseCheckoutQuantity } from "@/lib/checkoutRoutes";

export const HOMEPAGE_PRODUCT_SLUG = "velora-offer";

export type CheckoutContext = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
};

export function resolveCheckoutContext(
  searchParams: Record<string, string | string[] | undefined>,
): CheckoutContext {
  const rawProduct = searchParams.product;
  const rawQty = searchParams.quantity;

  const productSlug =
    (typeof rawProduct === "string" ? rawProduct.trim() : "") || HOMEPAGE_PRODUCT_SLUG;
  const quantity = parseCheckoutQuantity(typeof rawQty === "string" ? rawQty : null);

  if (!quantity) {
    redirect("/#checkout");
  }

  const catalog = getProductBySlug(productSlug);
  const productName =
    catalog?.name ??
    (productSlug === HOMEPAGE_PRODUCT_SLUG ? "عرض فيلورا بيوتي" : "طلب فيلورا بيوتي");

  return { productSlug, productName, quantity };
}
