import { processLeadWebhook, processOrderWebhook } from "@/lib/codNetwork/applyWebhook";
import { parseLeadWebhookBody, parseOrderWebhookBody } from "@/lib/codNetwork/parseWebhook";

const DEFAULT_API_BASE = "https://api.cod.network";

function apiBase(): string {
  return process.env.COD_NETWORK_API_BASE?.trim().replace(/\/$/, "") || DEFAULT_API_BASE;
}

function apiToken(): string | null {
  return process.env.COD_NETWORK_API_TOKEN?.trim() || null;
}

async function fetchSellerJson(path: string): Promise<unknown> {
  const token = apiToken();
  if (!token) throw new Error("missing_api_token");
  const res = await fetch(`${apiBase()}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(25_000),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`cod_network_api_${res.status}:${text.slice(0, 200)}`);
  }
  return JSON.parse(text) as unknown;
}

/** Best-effort poll — paths may vary; see COD Network Seller API docs. */
export async function refreshStatusesFromCodNetworkApi(): Promise<{
  leadsProcessed: number;
  ordersProcessed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let leadsProcessed = 0;
  let ordersProcessed = 0;

  try {
    const leads = await fetchSellerJson("/v2/seller/leads?limit=100");
    const leadList = Array.isArray(leads)
      ? leads
      : Array.isArray((leads as { data?: unknown }).data)
        ? (leads as { data: unknown[] }).data
        : [];
    for (const item of leadList) {
      const parsed = parseLeadWebhookBody({ data: { lead: item } });
      if (!parsed) continue;
      const r = processLeadWebhook(parsed);
      if (r.ok) leadsProcessed += 1;
      else if (r.reason) errors.push(`lead:${parsed.leadId}:${r.reason}`);
    }
  } catch (e) {
    errors.push(e instanceof Error ? e.message : "leads_fetch_failed");
  }

  try {
    const orders = await fetchSellerJson("/v2/seller/orders?limit=100");
    const orderList = Array.isArray(orders)
      ? orders
      : Array.isArray((orders as { data?: unknown }).data)
        ? (orders as { data: unknown[] }).data
        : [];
    for (const item of orderList) {
      const parsed = parseOrderWebhookBody({ data: { order: item } });
      if (!parsed) continue;
      const r = processOrderWebhook(parsed);
      if (r.ok) ordersProcessed += 1;
      else if (r.reason) errors.push(`order:${parsed.orderReference}:${r.reason}`);
    }
  } catch (e) {
    errors.push(e instanceof Error ? e.message : "orders_fetch_failed");
  }

  return { leadsProcessed, ordersProcessed, errors };
}

export function isCodNetworkApiConfigured(): boolean {
  return Boolean(apiToken());
}
