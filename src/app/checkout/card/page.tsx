import { Suspense } from "react";
import { CheckoutCardConfirmClient } from "@/components/checkout/CheckoutCardConfirmClient";
import { CheckoutStripePaymentFallback } from "@/components/checkout/CheckoutStripePaymentFallback";
import { CheckoutStripePaymentLoader } from "@/components/checkout/CheckoutStripePaymentLoader";
import { getCheckoutProductImage } from "@/lib/checkoutProductMeta";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";
import { isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CardCheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ctx = resolveCheckoutContext(sp);
  const productImageSrc = getCheckoutProductImage(ctx.productSlug);
  const stripeEnabled = isStripeCardCheckoutEnabled();

  const stripePaymentSection = stripeEnabled ? (
    <Suspense fallback={<CheckoutStripePaymentFallback />}>
      <CheckoutStripePaymentLoader
        productSlug={ctx.productSlug}
        productName={ctx.productName}
        quantity={ctx.quantity}
      />
    </Suspense>
  ) : undefined;

  return (
    <CheckoutCardConfirmClient
      productSlug={ctx.productSlug}
      productName={ctx.productName}
      productImageSrc={productImageSrc}
      quantity={ctx.quantity}
      stripeEnabled={stripeEnabled}
      stripePaymentSection={stripePaymentSection}
    />
  );
}
