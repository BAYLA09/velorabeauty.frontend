import { readBackendCheckoutConfig } from "@/lib/backendCheckout/config";
import { startBackendCheckoutWorker } from "@/lib/backendCheckout/worker";
import {
  isStripeLiveTestCheckoutEnabled,
  STRIPE_LIVE_TEST_PRICE_AED,
  STRIPE_LIVE_TEST_USD,
  stripeLiveTestCheckoutUrl,
  stripeLiveTestShortcutUrl,
} from "@/config/stripeLiveTestCheckout";
import { getSiteUrl } from "@/lib/siteUrl";
import { readOrdersSheetsExportStatus } from "@/lib/ordersSheets/exportOrder";
import {
  buildShaPrefix,
  fetchGithubMainShaPrefix,
} from "@/lib/deploy/githubMainHead";
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
  const shortSha = buildShaPrefix(buildSha);
  const githubMainPrefix = await fetchGithubMainShaPrefix();
  const inSyncWithMain =
    githubMainPrefix !== null &&
    shortSha !== "local" &&
    shortSha === githubMainPrefix;
  const backendCheckout = readBackendCheckoutConfig();
  const ordersSheets = readOrdersSheetsExportStatus();

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
      githubMainPrefix,
      inSyncWithMain,
      statusMessageAr:
        githubMainPrefix === null
          ? null
          : inSyncWithMain
            ? "الموقع محدّث مع GitHub main."
            : `الموقع قديم (${shortSha}) — GitHub main هو ${githubMainPrefix}. Easypanel → Source: Docker Image → ghcr.io/bayla09/velorabeauty.frontend:latest → Deploy (1–3 دقائق، ماشي 1 ثانية).`,
      autoDeployNoteAr:
        "Deploy أوتوماتيكي: GitHub → Secret EASYPANEL_DEPLOY_WEBHOOK (URL من Easypanel → Deployments → Webhook). بلا secret، Deploy يدوي فقط.",
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
      stripeLiveTestCheckoutEnabled: isStripeLiveTestCheckoutEnabled(),
      ...(isStripeLiveTestCheckoutEnabled()
        ? {
            stripeLiveTestUsd: STRIPE_LIVE_TEST_USD,
            stripeLiveTestPriceAed: STRIPE_LIVE_TEST_PRICE_AED,
            stripeLiveTestShortcut: stripeLiveTestShortcutUrl(getSiteUrl()),
            stripeLiveTestCardCheckout: stripeLiveTestCheckoutUrl(getSiteUrl()),
          }
        : {}),
    },
    ordersSheets: {
      enabled: ordersSheets.enabled,
      mode: ordersSheets.mode,
      direct: {
        enabled: ordersSheets.direct.enabled,
        reason: ordersSheets.direct.reason,
        spreadsheetConfigured: Boolean(ordersSheets.direct.spreadsheetId),
        serviceAccountConfigured: Boolean(ordersSheets.direct.clientEmail),
      },
      webhook: {
        codUrlConfigured: Boolean(ordersSheets.webhook.codWebhookUrl),
        cardUrlConfigured: Boolean(ordersSheets.webhook.cardWebhookUrl),
        secretConfigured: Boolean(ordersSheets.webhook.webhookSecret),
      },
      cardSheetGidConfigured: Boolean(ordersSheets.direct.cardSheetGid),
    },
  });
}
