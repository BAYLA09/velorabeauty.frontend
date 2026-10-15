import { CheckoutCardConfirmClient } from "@/components/checkout/CheckoutCardConfirmClient";
import { CheckoutStripePaymentShell } from "@/components/checkout/CheckoutStripePaymentShell";
import { StripeEarlyInit } from "@/components/checkout/StripeEarlyInit";
import { getCheckoutProductImage } from "@/lib/checkoutProductMeta";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";
import { bootstrapStripeCardCheckout } from "@/lib/stripeCardBootstrap";
import { getStripePublishableKey, isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CardCheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ctx = resolveCheckoutContext(sp);
  const productImageSrc = getCheckoutProductImage(ctx.productSlug);
  const stripeEnabled = isStripeCardCheckoutEnabled();
  const publishableKey = stripeEnabled ? getStripePublishableKey() : null;

  const stripeBootstrap = stripeEnabled
    ? await bootstrapStripeCardCheckout({
        productSlug: ctx.productSlug,
        productName: ctx.productName,
        quantity: ctx.quantity,
        eligibleUnits: ctx.eligibleUnits,
      })
    : null;

  const paymentSlot =
    stripeBootstrap != null ? (
      <CheckoutStripePaymentShell bootstrap={stripeBootstrap} />
    ) : undefined;

  return (
    <>
      <StripeEarlyInit publishableKey={publishableKey} bootstrap={stripeBootstrap} />
      <CheckoutCardConfirmClient
        productSlug={ctx.productSlug}
        productName={ctx.productName}
        productImageSrc={productImageSrc}
        quantity={ctx.quantity}
        eligibleUnits={ctx.eligibleUnits}
        stripeEnabled={stripeEnabled}
        stripeBootstrap={stripeBootstrap}
        paymentSlot={paymentSlot}
      />
    </>
  );
}
