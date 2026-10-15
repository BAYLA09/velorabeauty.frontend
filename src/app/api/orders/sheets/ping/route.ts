import { NextResponse } from "next/server";
import {
  appsScriptProbeHint,
  probeAppsScriptWebhook,
} from "@/lib/ordersSheets/probeAppsScriptWebhook";
import { readOrdersSheetsConfig } from "@/lib/ordersSheets/exportOrder";

export const runtime = "nodejs";

/** Debug COD webhook from production (same network as real orders). */
export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret")?.trim();
  const config = readOrdersSheetsConfig();
  if (!config.webhookSecret || secret !== config.webhookSecret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = config.codWebhookUrl;
  if (!url) {
    return NextResponse.json({ ok: false, error: "missing_cod_webhook_url" }, { status: 503 });
  }

  const probe = await probeAppsScriptWebhook(url, config.webhookSecret);

  return NextResponse.json({
    ok: probe.get.ok && probe.post.ok,
    webhookUrl: probe.webhookUrl,
    get: probe.get,
    post: probe.post,
    hint: appsScriptProbeHint(probe),
  });
}
