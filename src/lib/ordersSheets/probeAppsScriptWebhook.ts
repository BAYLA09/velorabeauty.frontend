import type { OrdersSheetChannel } from "@/lib/ordersSheets/buildSheetRow";
import { isAppsScriptWebhookSuccess } from "@/lib/ordersSheets/webhookResponse";

export function normalizeAppsScriptWebhookUrl(url: string): string {
  return url.trim().replace(/\/macros\/u\/\d+\/s\//, "/macros/s/");
}

export type AppsScriptWebhookProbe = {
  status: number;
  ok: boolean;
  redirectToLogin: boolean;
  bodyPreview: string;
};

async function probeOnce(
  url: string,
  init: RequestInit,
): Promise<{ res: Response; text: string }> {
  const res = await fetch(url, { ...init, redirect: "manual", signal: AbortSignal.timeout(15_000) });
  let text = await res.text().catch(() => "");
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    if (location?.includes("script.googleusercontent.com")) {
      const follow = await fetch(location, {
        method: init.method === "POST" ? "GET" : "GET",
        signal: AbortSignal.timeout(15_000),
      });
      text = await follow.text().catch(() => "");
      return { res: follow, text };
    }
  }
  return { res, text };
}

export async function probeAppsScriptWebhook(
  url: string,
  webhookSecret: string,
  channel: OrdersSheetChannel = "cod",
): Promise<{ get: AppsScriptWebhookProbe; post: AppsScriptWebhookProbe; webhookUrl: string }> {
  const webhookUrl = normalizeAppsScriptWebhookUrl(url);

  const getAttempt = await probeOnce(webhookUrl, { method: "GET" });
  const postAttempt = await probeOnce(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: webhookSecret,
      channel,
      orderId: "probe-test",
      rows: [],
    }),
  });

  const getLocation = getAttempt.res.headers.get("location");
  const postLocation = postAttempt.res.headers.get("location");

  return {
    webhookUrl,
    get: {
      status: getAttempt.res.status,
      ok: isAppsScriptWebhookSuccess(getAttempt.res, getAttempt.text),
      redirectToLogin: Boolean(getLocation?.includes("accounts.google.com")),
      bodyPreview: getAttempt.text.slice(0, 160),
    },
    post: {
      status: postAttempt.res.status,
      ok: isAppsScriptWebhookSuccess(postAttempt.res, postAttempt.text),
      redirectToLogin: Boolean(postLocation?.includes("accounts.google.com")),
      bodyPreview: postAttempt.text.slice(0, 160),
    },
  };
}

export function appsScriptProbeHint(probe: {
  get: AppsScriptWebhookProbe;
  post: AppsScriptWebhookProbe;
}): string | undefined {
  if (probe.get.status === 404 || probe.post.status === 404) {
    return "Apps Script URL is dead (404). Deploy → Manage deployments → New deployment → Web app → copy the NEW /exec URL into Easypanel ORDERS_SHEETS_COD_WEBHOOK_URL.";
  }
  if (probe.get.redirectToLogin || probe.post.redirectToLogin || probe.post.status === 401) {
    return "Apps Script: Deploy → Web app → Execute as Me + Who has access = Anyone. Test /exec in incognito (no Google login).";
  }
  if (probe.post.bodyPreview.includes("WEBHOOK_SECRET not configured")) {
    return "Apps Script → Project settings → Script properties → WEBHOOK_SECRET = same as ORDERS_SHEETS_WEBHOOK_SECRET in Easypanel.";
  }
  if (!probe.get.ok || !probe.post.ok) {
    return "Webhook reachable but response not ok — check WEBHOOK_SECRET in Apps Script properties matches Easypanel.";
  }
  return undefined;
}
