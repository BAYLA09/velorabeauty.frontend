import { CheckoutCardConfirmClient } from "@/components/checkout/CheckoutCardConfirmClient";
import { getCheckoutProductImage } from "@/lib/checkoutProductMeta";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";
import { bootstrapStripeCardCheckout } from "@/lib/stripeCardBootstrap";
import { isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CardCheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ctx = resolveCheckoutContext(sp);
  const productImageSrc = getCheckoutProductImage(ctx.productSlug);
  const stripeEnabled = isStripeCardCheckoutEnabled();

  const stripeBootstrap = stripeEnabled
    ? await bootstrapStripeCardCheckout({
        productSlug: ctx.productSlug,
        productName: ctx.productName,
        quantity: ctx.quantity,
      })
    : null;

  return (
    <CheckoutCardConfirmClient
      productSlug={ctx.productSlug}
      productName={ctx.productName}
      productImageSrc={productImageSrc}
      quantity={ctx.quantity}
      stripeEnabled={stripeEnabled}
      stripeBootstrap={stripeBootstrap}
    />
  );
}
