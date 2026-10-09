import {
  getStripePublishableKey,
  isStripeCardCheckoutEnabled,
} from "@/lib/stripeServer";

export async function GET() {
  const stripeSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const cardEnabled = isStripeCardCheckoutEnabled();

  const buildSha = process.env.BUILD_SHA?.trim() || "local";
  const shortSha = buildSha.length >= 7 ? buildSha.slice(0, 7) : buildSha;

  return Response.json({
    ok: true,
    service: "velorabeauty-frontend",
    /** Set at Docker build (GitHub Actions). Compare after Easypanel Deploy. */
    version: buildSha,
    deploy: {
      nodeEnv: process.env.NODE_ENV ?? "unknown",
      hostname: process.env.HOSTNAME ?? "unknown",
      databasePath: process.env.DATABASE_PATH ?? "/app/data/velora.sqlite",
      siteUrl:
        process.env.SITE_URL?.trim() ||
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        null,
      recommendedImage: "ghcr.io/bayla09/velorabeauty.frontend:latest",
      pinImageTag: shortSha !== "local" ? `ghcr.io/bayla09/velorabeauty.frontend:${shortSha}` : null,
      easypanel: {
        source: "docker-image",
        port: 3000,
        volume: "/app/data",
        registryAuth: "none (GHCR package is public)",
        /** Deploy <2s usually means Git/webhook — not a real image pull */
        expectDeployDuration: "1–3 minutes",
      },
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
