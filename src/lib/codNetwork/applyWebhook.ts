import {
  isOrderEligibleForInboundStatusUpdate,
  readInboundStatusCutoffIso,
} from "@/lib/inboundStatusCutoff";
import {
  mapCodNetworkLeadStatus,
  mapCodNetworkOrderStatus,
  type InternalCodStatus,
} from "@/lib/codNetwork/statusMapping";
import {
  extractStorefrontOrderIdFromInputs,
  type ParsedLeadWebhook,
  type ParsedOrderWebhook,
} from "@/lib/codNetwork/parseWebhook";
import { phonesMatch } from "@/lib/codNetwork/phoneMatch";
import {
  findCodOrderForCodNetworkMatch,
  linkCodNetworkIds,
  updateCodOrderStatusFromInbound,
} from "@/lib/ordersRepository";
import { getOrderById } from "@/lib/ordersRepository";

const DEFAULT_MATCH_WINDOW_MS = 72 * 60 * 60 * 1000;

function matchWindowMs(): number {
  const hours = Number.parseFloat(process.env.COD_NETWORK_MATCH_WINDOW_HOURS?.trim() ?? "72");
  return Number.isFinite(hours) && hours > 0 ? hours * 3600000 : DEFAULT_MATCH_WINDOW_MS;
}

function applyStatusToOrder(
  orderId: string,
  status: InternalCodStatus,
  detail: string,
  leadId?: string | null,
  orderRef?: string | null,
): { ok: boolean; reason?: string } {
  const order = getOrderById(orderId);
  if (!order) return { ok: false, reason: "not_found" };
  if (order.paymentMethod !== "cod") return { ok: false, reason: "not_cod" };

  const cutoff = readInboundStatusCutoffIso();
  if (!isOrderEligibleForInboundStatusUpdate(order.createdAt, cutoff)) {
    return { ok: false, reason: "before_cutoff" };
  }

  if (leadId || orderRef) {
    linkCodNetworkIds(orderId, leadId ?? null, orderRef ?? null);
  }

  const updated = updateCodOrderStatusFromInbound(orderId, status, detail);
  return updated.updated ? { ok: true } : { ok: false, reason: updated.reason };
}

export function processLeadWebhook(lead: ParsedLeadWebhook): {
  ok: boolean;
  reason?: string;
  orderId?: string;
} {
  const mapped = mapCodNetworkLeadStatus(lead.status);
  if (!mapped.status) return { ok: false, reason: "unmapped_status" };

  let order =
    findCodOrderForCodNetworkMatch({
      leadId: lead.leadId,
      orderReference: null,
      storefrontOrderId: extractStorefrontOrderIdFromInputs(lead.inputs),
      phone: lead.phone,
      eventTimeIso: lead.createdAtIso,
      windowMs: matchWindowMs(),
    }) ?? null;

  if (!order && lead.phone) {
    order = findCodOrderForCodNetworkMatch({
      leadId: null,
      orderReference: null,
      storefrontOrderId: null,
      phone: lead.phone,
      eventTimeIso: lead.createdAtIso,
      windowMs: matchWindowMs(),
    });
  }

  if (!order) return { ok: false, reason: "no_matching_order" };

  const result = applyStatusToOrder(
    order.id,
    mapped.status,
    `codnet:lead:${mapped.rawLabel}`,
    lead.leadId,
    null,
  );
  return result.ok ? { ok: true, orderId: order.id } : result;
}

export function processOrderWebhook(order: ParsedOrderWebhook): {
  ok: boolean;
  reason?: string;
  orderId?: string;
} {
  const mapped = mapCodNetworkOrderStatus(order.status);
  if (!mapped.status) return { ok: false, reason: "unmapped_status" };

  let match =
    findCodOrderForCodNetworkMatch({
      leadId: order.leadId,
      orderReference: order.orderReference,
      storefrontOrderId: null,
      phone: order.phone,
      eventTimeIso: order.createdAtIso,
      windowMs: matchWindowMs(),
    }) ?? null;

  if (!match && order.leadId) {
    match = findCodOrderForCodNetworkMatch({
      leadId: order.leadId,
      orderReference: null,
      storefrontOrderId: null,
      phone: order.phone,
      eventTimeIso: order.createdAtIso,
      windowMs: matchWindowMs(),
    });
  }

  if (!match && order.phone) {
    match = findCodOrderForCodNetworkMatch({
      leadId: null,
      orderReference: null,
      storefrontOrderId: null,
      phone: order.phone,
      eventTimeIso: order.createdAtIso,
      windowMs: matchWindowMs(),
    });
  }

  if (!match) return { ok: false, reason: "no_matching_order" };

  const result = applyStatusToOrder(
    match.id,
    mapped.status,
    `codnet:order:${mapped.rawLabel}`,
    order.leadId,
    order.orderReference,
  );
  return result.ok ? { ok: true, orderId: match.id } : result;
}

export function phoneMatchesOrder(orderPhone: string, webhookPhone: string): boolean {
  return phonesMatch(orderPhone, webhookPhone);
}
