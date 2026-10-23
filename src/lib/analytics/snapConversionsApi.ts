import { createHash } from "node:crypto";
import { VELORA_SNAP_PIXEL_ID } from "@/config/snapPixel";
import { snapContentIdsFromOrder, snapItemCount } from "@/lib/analytics/snapContentIds";
import type { OrderRecord } from "@/lib/ordersRepository";
import { uaePhoneMatchKey } from "@/lib/codNetwork/phoneMatch";

const CAPI_URL = "https://tr.snapchat.com/v2/conversion";
const CAPI_TIMEOUT_MS = 4000;

export function hashPhoneForSnapCapi(phone: string): string | null {
  const key = uaePhoneMatchKey(phone);
  if (!key) return null;
  const normalized = key.replace(/\D/g, "");
  if (!normalized) return null;
  return createHash("sha256").update(normalized).digest("hex");
}

function readSnapCapiToken(): string | null {
  const token = process.env.SNAP_CAPI_TOKEN?.trim();
  return token || null;
}

function readSnapCapiPixelId(): string {
  const fromEnv = process.env.SNAP_CAPI_PIXEL_ID?.trim();
  if (fromEnv) return fromEnv;
  return VELORA_SNAP_PIXEL_ID;
}

export type SnapCapiPurchaseContext = {
  userAgent?: string | null;
  clientIp?: string | null;
};

export function buildSnapCapiPurchaseBody(
  order: OrderRecord,
  ctx: SnapCapiPurchaseContext,
): Record<string, unknown> | null {
  const contentIds = snapContentIdsFromOrder({
    productSlug: order.productSlug,
    cartLines: order.cartLines,
  });
  if (contentIds.length === 0) return null;

  const hashedPhone = hashPhoneForSnapCapi(order.phone);
  const timestamp = Math.floor(new Date(order.createdAt).getTime() / 1000);

  const body: Record<string, unknown> = {
    pixel_id: readSnapCapiPixelId(),
    event_type: "PURCHASE",
    event_conversion_type: "WEB",
    event_tag: "purchase",
    timestamp: String(timestamp),
    event_id: order.id,
    client_dedup_id: order.id,
    price: order.totalAed,
    currency: "AED",
    item_ids: contentIds,
    number_items: String(
      snapItemCount({
        quantity: order.quantity,
        cartLines: order.cartLines,
      }),
    ),
  };

  if (hashedPhone) body.hashed_phone_number = hashedPhone;
  if (ctx.userAgent?.trim()) body.user_agent = ctx.userAgent.trim();
  if (ctx.clientIp?.trim()) body.ip_address = ctx.clientIp.trim();

  return body;
}

/** Fire-and-forget; never throws; skips when token missing. */
export function sendSnapCapiPurchaseAsync(
  order: OrderRecord,
  ctx: SnapCapiPurchaseContext,
): void {
  const token = readSnapCapiToken();
  if (!token) return;

  const body = buildSnapCapiPurchaseBody(order, ctx);
  if (!body) return;

  void (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CAPI_TIMEOUT_MS);
    try {
      await fetch(CAPI_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      /* silent */
    } finally {
      clearTimeout(timer);
    }
  })();
}
