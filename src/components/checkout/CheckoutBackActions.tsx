"use client";

import Link from "next/link";
import type { BundleQuantity } from "@/config/pricing";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";
import { getProductPath } from "@/lib/productCatalog";
import { HOMEPAGE_PRODUCT_SLUG } from "@/lib/resolveCheckoutContext";

type BackTarget = "product" | "payment";

type Props = {
  productSlug: string;
  quantity: BundleQuantity;
  /** Step 3 → payment picker · Step 2 → product page */
  backTo: BackTarget;
  className?: string;
};

function productReturnHref(productSlug: string): string {
  if (productSlug === HOMEPAGE_PRODUCT_SLUG) {
    return "/#checkout";
  }
  return `${getProductPath(productSlug)}#purchase`;
}

function ChevronBackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CheckoutBackActions({
  productSlug,
  quantity,
  backTo,
  className = "",
}: Props) {
  const href =
    backTo === "payment"
      ? buildCheckoutPaymentStepPath({ product: productSlug, quantity })
      : productReturnHref(productSlug);

  const label =
    backTo === "payment" ? "العودة إلى طريقة الدفع" : "العودة إلى المنتج";

  return (
    <nav aria-label="رجوع" className={className}>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
      >
        <ChevronBackIcon className="h-[18px] w-[18px] shrink-0 text-neutral-400 transition group-hover:text-neutral-700 rtl:rotate-180" />
        <span>{label}</span>
      </Link>
    </nav>
  );
}
