import { readBackendCheckoutConfig } from "@/lib/backendCheckout/config";
import { startBackendCheckoutWorker } from "@/lib/backendCheckout/worker";
import { readOrdersSheetsConfig } from "@/lib/ordersSheets/exportOrder";
import {
  getStripePublishableKey,
  isStripeCardCheckoutEnabled,
} from "@/lib/stripeServer";

export const runtime = "nodejs";

export async function GET() {
  startBackendCheckoutWorker();
  const stripeSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const cardEnabled = isStripeCardCheckoutEnabled();

  const buildSha = process.env.BUILD_SHA?.trim() || "local";
  const shortSha = buildSha.length >= 7 ? buildSha.slice(0, 7) : buildSha;
  const backendCheckout = readBackendCheckoutConfig();
  const ordersSheets = readOrdersSheetsConfig();

  return Response.json({
    ok: true,
    service: "velorabeauty-frontend",
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
      pinImageTag:
        shortSha !== "local"
          ? `ghcr.io/bayla09/velorabeauty.frontend:${shortSha}`
          : null,
      easypanel: {
        /** Use App → Docker Image OR Compose with docker-compose.yml — never Git Dockerfile build */
        source: "docker-image",
        composeFile: "docker-compose.yml",
        envTemplate: "deploy/easypanel.env.example",
        quickGuide: "docs/EASYPANEL-AUTO-DEPLOY-AR.md",
        deployOneSecondFix: "docs/EASYPANEL-DEPLOY-1-SECONDE-AR.md",
        port: 3000,
        volume: "/app/data",
        registryAuth: "none (public GHCR) — or BAYLA09 + read:packages token if unauthorized",
        deployTooFastHint:
          "Deploy <2s = Git/webhook failed — switch Source to Docker Image",
        expectDeployDuration: "1–3 minutes",
        stepsAfterMerge: [
          "GitHub Actions → Publish container ✅",
          "Easypanel → Docker Image → Deploy (1–3 min, pull layers in logs)",
          "curl /api/health → version matches main SHA",
        ],
      },
    },
    backendCheckout: backendCheckout.enabled
      ? { enabled: true, baseUrl: backendCheckout.baseUrl }
      : { enabled: false, reason: backendCheckout.reason },
    payments: {
      stripeSecretConfigured: stripeSecret,
      stripePublishableConfigured: Boolean(getStripePublishableKey()),
      cardCheckoutEnabled: cardEnabled,
      embeddedPaymentElement: cardEnabled && Boolean(getStripePublishableKey()),
      webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
    },
    ordersSheets: ordersSheets.enabled
      ? {
          enabled: true,
          codWebhookConfigured: Boolean(ordersSheets.codWebhookUrl),
          cardWebhookConfigured: Boolean(ordersSheets.cardWebhookUrl),
          secretConfigured: Boolean(ordersSheets.webhookSecret),
        }
      : {
          enabled: false,
          reason: ordersSheets.reason ?? "disabled",
          codWebhookConfigured: Boolean(ordersSheets.codWebhookUrl),
          secretConfigured: Boolean(ordersSheets.webhookSecret),
        },
  });
}
