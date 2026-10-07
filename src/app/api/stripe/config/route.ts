import { NextResponse } from "next/server";
import { getStripePublishableKey, isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

export async function GET() {
  const publishableKey = getStripePublishableKey();
  const ready = isStripeCardCheckoutEnabled() && Boolean(publishableKey);
  return NextResponse.json({
    ready,
    publishableKey: ready ? publishableKey : null,
  });
}
