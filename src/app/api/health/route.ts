import {
  getStripePublishableKey,
  isStripeCardCheckoutEnabled,
} from "@/lib/stripeServer";

export async function GET() {
  const stripeSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const cardEnabled = isStripeCardCheckoutEnabled();

  return Response.json({
    ok: true,
    service: "velorabeauty-frontend",
    /** Set at Docker build (GitHub Actions). Compare after Easypanel Deploy. */
    version: process.env.BUILD_SHA ?? "local",
    deploy: {
      nodeEnv: process.env.NODE_ENV ?? "unknown",
      hostname: process.env.HOSTNAME ?? "unknown",
      databasePath: process.env.DATABASE_PATH ?? "/app/data/velora.sqlite",
      siteUrl:
        process.env.SITE_URL?.trim() ||
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        null,
      /** Easypanel: use Docker Image (not Git build) — see docs/EASYPANEL-SETUP-AR.md */
      recommendedImage: "ghcr.io/bayla09/velorabeauty.frontend:latest",
    },
    payments: {
      stripeSecretConfigured: stripeSecret,
      stripePublishableConfigured: Boolean(getStripePublishableKey()),
      cardCheckoutEnabled: cardEnabled,
      embeddedPaymentElement: cardEnabled && Boolean(getStripePublishableKey()),
      webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
    },
  });
}
