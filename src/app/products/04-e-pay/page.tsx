import type { Metadata } from "next";
import { ElectronicProduct04Page } from "@/components/product/ElectronicProduct04Page";
import {
  isStripeTestCheckoutEnabled,
  STRIPE_TEST_PRODUCT_HEADLINE,
  STRIPE_TEST_PRODUCT_NAME,
  stripeTestCardCheckoutPath,
} from "@/config/stripeTestCheckout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${STRIPE_TEST_PRODUCT_NAME} | فيلورا`,
  description: STRIPE_TEST_PRODUCT_HEADLINE,
  robots: { index: false, follow: false },
};

/** Same hidden PDP as velora-stripe-test-20 — short share link. */
export default function Product04EPayPage() {
  return (
    <ElectronicProduct04Page
      cardCheckoutHref={stripeTestCardCheckoutPath()}
      checkoutEnabled={isStripeTestCheckoutEnabled()}
    />
  );
}
