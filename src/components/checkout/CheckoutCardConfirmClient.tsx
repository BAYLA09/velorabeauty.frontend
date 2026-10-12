"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { type ReactNode } from "react";
import { CheckoutCardVanillaCheckout } from "@/components/checkout/CheckoutCardVanillaCheckout";
import type { BundleQuantity } from "@/config/pricing";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";
import { parseCheckoutLines } from "@/lib/checkoutUpsell";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

const CheckoutCardStripeCheckout = dynamic(
  () =>
    import("@/components/checkout/CheckoutCardStripeCheckout").then(
      (mod) => mod.CheckoutCardStripeCheckout,
    ),
  { ssr: false },
);

const CheckoutCardLegacyCheckout = dynamic(
  () =>
    import("@/components/checkout/CheckoutCardLegacyCheckout").then(
      (mod) => mod.CheckoutCardLegacyCheckout,
    ),
  { ssr: false },
);

type Props = {
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
  stripeEnabled?: boolean;
  stripeBootstrap?: StripeCardBootstrap | null;
  paymentSlot?: ReactNode;
};

export function CheckoutCardConfirmClient({
  productSlug,
  productName,
  productImageSrc,
  quantity,
  eligibleUnits,
  stripeEnabled = false,
  stripeBootstrap = null,
  paymentSlot,
}: Props) {
  const searchParams = useSearchParams();
  const cartItemsParam = searchParams.get("items") ?? undefined;
  const cartLines = parseCheckoutLines(cartItemsParam, productSlug, quantity);
  const sendCartLines = Boolean(cartItemsParam);
  const backHref = buildCheckoutPaymentStepPath(
    { product: productSlug, quantity, items: cartItemsParam },
    "card",
  );

  if (stripeEnabled && stripeBootstrap && paymentSlot) {
    return (
      <CheckoutCardVanillaCheckout
        productSlug={productSlug}
        productName={productName}
        productImageSrc={productImageSrc}
        quantity={quantity}
        eligibleUnits={eligibleUnits}
        stripeBootstrap={stripeBootstrap}
        backHref={backHref}
        cartLines={cartLines}
        sendCartLines={sendCartLines}
        cartItemsParam={cartItemsParam}
        paymentSlot={paymentSlot}
      />
    );
  }

  if (stripeEnabled) {
    return (
      <CheckoutCardStripeCheckout
        productSlug={productSlug}
        productName={productName}
        productImageSrc={productImageSrc}
        quantity={quantity}
        eligibleUnits={eligibleUnits}
        backHref={backHref}
        stripeBootstrap={stripeBootstrap}
        cartLines={cartLines}
        sendCartLines={sendCartLines}
        cartItemsParam={cartItemsParam}
      />
    );
  }

  return (
    <CheckoutCardLegacyCheckout
      productSlug={productSlug}
      productName={productName}
      productImageSrc={productImageSrc}
      quantity={quantity}
      eligibleUnits={eligibleUnits}
      backHref={backHref}
      cartLines={cartLines}
      sendCartLines={sendCartLines}
    />
  );
}
