import { NextResponse } from "next/server";
import { isAppsScriptWebhookSuccess } from "@/lib/ordersSheets/webhookResponse";
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

  const getRes = await fetch(url, {
    method: "GET",
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  const getLocation = getRes.headers.get("location");
  const getText = await getRes.text().catch(() => "");

  const postRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: config.webhookSecret,
      channel: "cod",
      orderId: "ping-test",
      rows: [],
    }),
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  const postLocation = postRes.headers.get("location");
  const postText = await postRes.text().catch(() => "");

  const getOk = isAppsScriptWebhookSuccess(getRes, getText);
  const postOk = isAppsScriptWebhookSuccess(postRes, postText);

  return NextResponse.json({
    ok: getOk && postOk,
    webhookUrl: url.replace(/\/u\/\d+\//, "/"),
    get: {
      status: getRes.status,
      ok: getOk,
      redirectToLogin: Boolean(getLocation?.includes("accounts.google.com")),
      bodyPreview: getText.slice(0, 120),
    },
    post: {
      status: postRes.status,
      ok: postOk,
      redirectToLogin: Boolean(postLocation?.includes("accounts.google.com")),
      bodyPreview: postText.slice(0, 120),
    },
    hint:
      getRes.status === 302 || postRes.status === 401
        ? "Redeploy Apps Script Web app: Execute as Me, Who has access = Anyone (anonymous). Test /exec in incognito without Google login."
        : undefined,
  });
}
