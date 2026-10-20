import { buildSellerLeadBodyFromOrder } from "@/lib/codNetwork/buildSellerLead";
import { createSellerLead, isCodNetworkApiConfigured } from "@/lib/codNetwork/sellerApiClient";
import {
  getOrderById,
  getOrderCartLines,
  getOrderCodNetworkPushState,
  linkCodNetworkIds,
  recordCodNetworkPushAttempt,
} from "@/lib/ordersRepository";

export function isCodNetworkPushEnabled(): boolean {
  return process.env.COD_NETWORK_PUSH_ENABLED?.trim().toLowerCase() === "true";
}

function isRetryableHttpError(message: string): boolean {
  return /^cod_network_api_5\d\d:/.test(message) || message.includes("TimeoutError");
}

export type PushCodOrderResult =
  | { ok: true; leadId: string; skipped?: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string; retryable: boolean };

export async function pushCodOrderToNetwork(
  orderId: string,
  options?: { manual?: boolean; allowWhenDisabled?: boolean },
): Promise<PushCodOrderResult> {
  const manual = options?.manual === true;
  if (!manual && !isCodNetworkPushEnabled()) {
    return { ok: true, skipped: true, reason: "push_disabled" };
  }

  if (!isCodNetworkApiConfigured()) {
    const error = "missing_api_token";
    recordCodNetworkPushAttempt(orderId, { status: "failed", error });
    return { ok: false, error, retryable: false };
  }

  const order = getOrderById(orderId);
  if (!order) {
    return { ok: false, error: "not_found", retryable: false };
  }
  if (order.paymentMethod !== "cod") {
    return { ok: false, error: "not_cod", retryable: false };
  }

  const state = getOrderCodNetworkPushState(orderId);
  if (state.leadId) {
    return { ok: true, skipped: true, reason: "already_pushed" };
  }

  const cartLines = getOrderCartLines(orderId);
  const built = buildSellerLeadBodyFromOrder(order, cartLines);
  if ("skip" in built) {
    recordCodNetworkPushAttempt(orderId, { status: "skipped", error: built.skip });
    console.info("[codNetwork/push] skipped", { orderId, reason: built.skip });
    return { ok: true, skipped: true, reason: built.skip };
  }

  try {
    const { leadId } = await createSellerLead(built.body);
    linkCodNetworkIds(orderId, leadId, null);
    recordCodNetworkPushAttempt(orderId, { status: "sent", error: null, leadId });
    return { ok: true, leadId };
  } catch (err) {
    const error = err instanceof Error ? err.message : "push_failed";
    const retryable = isRetryableHttpError(error);
    recordCodNetworkPushAttempt(orderId, { status: "failed", error });
    console.error("[codNetwork/push] failed", { orderId, error, retryable });
    return { ok: false, error, retryable };
  }
}

export function canManualRetryCodNetworkPush(orderId: string): boolean {
  const order = getOrderById(orderId);
  if (!order || order.paymentMethod !== "cod") return false;
  const state = getOrderCodNetworkPushState(orderId);
  if (state.leadId) return false;
  return state.pushStatus === null || state.pushStatus === "failed";
}
