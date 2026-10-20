import { processLeadWebhook, processOrderWebhook } from "@/lib/codNetwork/applyWebhook";
import { parseLeadWebhookBody, parseOrderWebhookBody } from "@/lib/codNetwork/parseWebhook";
import { fetchSellerJson } from "@/lib/codNetwork/sellerApiClient";

export { createSellerLead, isCodNetworkApiConfigured } from "@/lib/codNetwork/sellerApiClient";
export type { SellerLeadCreatePayload } from "@/lib/codNetwork/sellerApiClient";

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
