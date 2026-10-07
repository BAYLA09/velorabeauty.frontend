import { CheckoutCardConfirmClient } from "@/components/checkout/CheckoutCardConfirmClient";
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

  return (
    <CheckoutCardConfirmClient
      productSlug={ctx.productSlug}
      productName={ctx.productName}
      productImageSrc={productImageSrc}
      quantity={ctx.quantity}
      stripeEnabled={isStripeCardCheckoutEnabled()}
    />
  );
}
