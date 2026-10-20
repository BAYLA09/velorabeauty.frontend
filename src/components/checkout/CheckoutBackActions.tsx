"use client";

import Link from "next/link";
import type { BundleQuantity } from "@/config/pricing";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";
import { getProductPath } from "@/lib/productCatalog";
import { MIXED_CART_PRODUCT_SLUG } from "@/lib/cart/cartTypes";
import { HOMEPAGE_PRODUCT_SLUG } from "@/lib/resolveCheckoutContext";
import { CheckoutBackChevron } from "@/components/checkout/CheckoutBackChevron";
import { checkoutBackLinkClassName } from "@/components/checkout/checkoutBackLinkStyles";

type BackTarget = "product" | "payment";

type Props = {
  productSlug: string;
  quantity: BundleQuantity;
  cartItemsParam?: string;
  /** Step 3 → payment picker · Step 2 → product page */
  backTo: BackTarget;
  className?: string;
};

function productReturnHref(productSlug: string): string {
  if (productSlug === MIXED_CART_PRODUCT_SLUG) {
    return "/#products";
  }
  if (productSlug === HOMEPAGE_PRODUCT_SLUG) {
    return "/#products";
  }
  return `${getProductPath(productSlug)}#purchase`;
}

export function CheckoutBackActions({
  productSlug,
  quantity,
  cartItemsParam,
  backTo,
  className = "",
}: Props) {
  const query = { product: productSlug, quantity, items: cartItemsParam };
  const href =
    backTo === "payment"
      ? buildCheckoutPaymentStepPath(query)
      : productReturnHref(productSlug);

  const label =
    backTo === "payment" ? "العودة إلى طريقة الدفع" : "العودة إلى المنتج";

  return (
    <nav aria-label="رجوع" className={className}>
      <Link href={href} className={checkoutBackLinkClassName}>
        <CheckoutBackChevron className="h-5 w-5 shrink-0 text-neutral-800 rtl:rotate-180" />
        <span>{label}</span>
      </Link>
    </nav>
  );
}
