import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { processLeadWebhook } from "@/lib/codNetwork/applyWebhook";
import { verifyCodNetworkWebhookSecret } from "@/lib/codNetwork/auth";
import { parseLeadWebhookBody } from "@/lib/codNetwork/parseWebhook";
import {
  insertWebhookEventIfNew,
  markWebhookEventProcessed,
} from "@/lib/codNetwork/webhookStore";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("seller-secret-key");
  if (!verifyCodNetworkWebhookSecret(secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { inserted, eventKey } = insertWebhookEventIfNew("lead", body);
  if (!inserted) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const parsed = parseLeadWebhookBody(body);
  if (!parsed) {
    markWebhookEventProcessed(eventKey, { ok: false, error: "unparseable_payload" });
    return NextResponse.json({ ok: false, error: "unparseable_payload" }, { status: 422 });
  }

  const result = processLeadWebhook(parsed);
  markWebhookEventProcessed(eventKey, result);
  return NextResponse.json({ ...result, ok: result.ok });
}
