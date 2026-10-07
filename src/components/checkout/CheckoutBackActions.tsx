"use client";

import Link from "next/link";
import type { BundleQuantity, PaymentMethod } from "@/config/pricing";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";
import { getProductPath } from "@/lib/productCatalog";
import { HOMEPAGE_PRODUCT_SLUG } from "@/lib/resolveCheckoutContext";

type Props = {
  productSlug: string;
  quantity: BundleQuantity;
  /** Step 3: show link back to payment picker */
  paymentMethod?: PaymentMethod;
  variant?: "inline" | "stacked";
};

function productReturnHref(productSlug: string): string {
  if (productSlug === HOMEPAGE_PRODUCT_SLUG) {
    return "/#checkout";
  }
  return `${getProductPath(productSlug)}#purchase`;
}

export function CheckoutBackActions({
  productSlug,
  quantity,
  paymentMethod,
  variant = "inline",
}: Props) {
  const paymentHref = buildCheckoutPaymentStepPath(
    { product: productSlug, quantity },
    paymentMethod,
  );
  const productHref = productReturnHref(productSlug);

  const linkClass =
    "inline-flex items-center justify-center gap-2 rounded-full border border-velora-burgundy/15 bg-white px-4 py-2.5 text-sm font-bold text-velora-burgundy transition hover:border-velora-burgundy/35 hover:bg-velora-cream-dark";

  if (variant === "stacked") {
    return (
      <div className="flex flex-col gap-2">
        {paymentMethod !== undefined && (
          <Link href={paymentHref} className={`${linkClass} w-full`}>
            <span aria-hidden>→</span>
            رجوع — اختيار طريقة الدفع
          </Link>
        )}
        <Link href={productHref} className={`${linkClass} w-full`}>
          <span aria-hidden>→</span>
          العودة للمنتج
        </Link>
      </div>
    );
  }

  return (
    <nav
      aria-label="رجوع"
      className="mb-5 flex flex-wrap items-center gap-2 border-b border-velora-burgundy/8 pb-4"
    >
      {paymentMethod !== undefined && (
        <Link href={paymentHref} className={linkClass}>
          <span aria-hidden>→</span>
          طريقة الدفع
        </Link>
      )}
      <Link href={productHref} className={linkClass}>
        <span aria-hidden>→</span>
        المنتج
      </Link>
      <Link href="/" className={`${linkClass} text-velora-burgundy/70`}>
        الرئيسية
      </Link>
    </nav>
  );
}
