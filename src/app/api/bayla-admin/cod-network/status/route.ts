import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readCodNetworkWebhookSecret } from "@/lib/codNetwork/auth";
import { isCodNetworkApiConfigured } from "@/lib/codNetwork/sellerApi";
import { readLastCodNetworkWebhookAt } from "@/lib/codNetwork/webhookStore";
import { requireAdminSession } from "@/lib/profitAdmin/apiHelpers";
import { readInboundStatusCutoffIso } from "@/lib/inboundStatusCutoff";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;

  return NextResponse.json({
    ok: true,
    webhookSecretConfigured: Boolean(readCodNetworkWebhookSecret()),
    apiTokenConfigured: isCodNetworkApiConfigured(),
    lastWebhookAt: readLastCodNetworkWebhookAt(),
    statusCutoffIso: readInboundStatusCutoffIso(),
    webhookUrls: {
      lead: "https://www.velorabeauty.world/api/cod-network/webhook/lead",
      order: "https://www.velorabeauty.world/api/cod-network/webhook/order",
    },
  });
}
