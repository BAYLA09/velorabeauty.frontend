import type { Metadata } from "next";
import { StripeTestProductPage } from "@/components/product/StripeTestProductPage";
import { StripeTestProductSetupPage } from "@/components/product/StripeTestProductSetupPage";
import {
  isStripeTestCheckoutEnabled,
  STRIPE_TEST_PRODUCT_NAME,
  stripeTestCardCheckoutPath,
} from "@/config/stripeTestCheckout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${STRIPE_TEST_PRODUCT_NAME} | فيلورا`,
  description: "صفحة اختبار دفع Stripe — 20 د.إ",
  robots: { index: false, follow: false },
};

export default function StripeTestProductRoutePage() {
  if (!isStripeTestCheckoutEnabled()) {
    return <StripeTestProductSetupPage />;
  }
  return <StripeTestProductPage cardCheckoutHref={stripeTestCardCheckoutPath()} />;
}
