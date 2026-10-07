import { CheckoutStripePaymentIsland } from "@/components/checkout/CheckoutStripePaymentIsland";
import type { BundleQuantity } from "@/config/pricing";
import { bootstrapStripeCardCheckout } from "@/lib/stripeCardBootstrap";

type Props = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
};

/** Server: create PaymentIntent while the delivery form is already on screen. */
export async function CheckoutStripePaymentLoader({
  productSlug,
  productName,
  quantity,
}: Props) {
  const bootstrap = await bootstrapStripeCardCheckout({
    productSlug,
    productName,
    quantity,
  });

  return <CheckoutStripePaymentIsland bootstrap={bootstrap} />;
}
