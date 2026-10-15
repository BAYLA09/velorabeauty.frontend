import { redirect } from "next/navigation";
import type { BundleQuantity } from "@/config/pricing";
import { parseCartItemsParam } from "@/lib/cart/cartSerialization";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import {
  isStripeTestCheckoutEnabled,
  isStripeTestCheckoutTokenValid,
  isStripeTestProductSlug,
} from "@/config/stripeTestCheckout";
import { getProductBySlug } from "@/lib/productCatalog";
import { parseCheckoutQuantity } from "@/lib/checkoutRoutes";

export const HOMEPAGE_PRODUCT_SLUG = "velora-offer";

export type CheckoutContext = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
  cartItemsParam?: string;
};

export function resolveCheckoutContext(
  searchParams: Record<string, string | string[] | undefined>,
): CheckoutContext {
  const rawItems = searchParams.items;
  if (typeof rawItems === "string" && rawItems.trim()) {
    const parsed = parseCartItemsParam(rawItems);
    if (!parsed) redirect("/#products");
    const validated = validateCartForCheckout(parsed);
    if (!validated.ok) redirect("/#products");
    return {
      productSlug: validated.cart.productSlug,
      productName: validated.cart.productName,
      quantity: validated.cart.bundleQuantity,
      eligibleUnits: validated.cart.eligibleUnits,
      cartItemsParam: rawItems.trim(),
    };
  }

  const rawProduct = searchParams.product;
  const rawQty = searchParams.quantity;

  const productSlug =
    (typeof rawProduct === "string" ? rawProduct.trim() : "") || HOMEPAGE_PRODUCT_SLUG;
  const quantity = parseCheckoutQuantity(typeof rawQty === "string" ? rawQty : null);

  if (!quantity) {
    redirect("/#products");
  }

  if (isStripeTestProductSlug(productSlug)) {
    if (!isStripeTestCheckoutEnabled()) {
      redirect("/#products");
    }
    const tokenParam = searchParams.token;
    const token = typeof tokenParam === "string" ? tokenParam : null;
    if (!isStripeTestCheckoutTokenValid(token)) {
      redirect("/#products");
    }
  }

  const catalog = getProductBySlug(productSlug);
  const productName =
    catalog?.name ??
    (productSlug === HOMEPAGE_PRODUCT_SLUG ? "عرض فيلورا بيوتي" : "طلب فيلورا بيوتي");

  return { productSlug, productName, quantity, eligibleUnits: quantity };
}
