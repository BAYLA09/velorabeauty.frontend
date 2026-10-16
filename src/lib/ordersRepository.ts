import { randomUUID } from "node:crypto";
import { isStorefrontOrderId } from "@/lib/backendCheckout/contract";
import {
  getCheckoutTotalForUnits,
  getMerchandiseAedForUnits,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import type { OrderAttribution } from "@/lib/attribution/orderAttribution";
import { parseStoredOrderAttribution } from "@/lib/attribution/orderAttribution";
import type { CartLine } from "@/lib/cart/cartTypes";
import { getCheckoutTotalForCart, getMerchandiseAedForCart } from "@/lib/cart/cartPricing";
import {
  isStripeLiveTestCheckoutEnabled,
  isStripeLiveTestProductSlug,
} from "@/config/stripeLiveTestCheckout";
import {
  resolveCheckoutMerchandiseAed,
  resolveCheckoutTotalAed,
} from "@/lib/checkoutTotals";
import { getDb } from "@/lib/db";

export type OrderRecord = {
  id: string;
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
  subtotalAed: number;
  deliveryFeeAed: number;
  totalAed: number;
  customerName: string;
  phone: string;
  emirate: string;
  address: string;
  status: string;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  customerEmail: string | null;
  marketingConsent: boolean;
  backendExternalCheckoutId: string | null;
  createdAt: string;
  cartLines: CartLine[];
};

export type CreateOrderInput = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  emirate: string;
  address: string;
  customerEmail?: string;
  marketingConsent?: boolean;
  backendExternalCheckoutId?: string;
  /** When this is a fresh UUID, it becomes the order id and the backend external id. */
  id?: string;
  attribution?: OrderAttribution | null;
};

type OrderRow = {
  id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  payment_method: PaymentMethod;
  subtotal_aed: number;
  delivery_fee_aed: number;
  total_aed: number;
  customer_name: string;
  phone: string;
  emirate: string;
  address: string;
  status: string;
  stripe_checkout_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  customer_email?: string | null;
  marketing_consent?: number | null;
  backend_external_checkout_id?: string | null;
  created_at: string;
  order_lines_json?: string | null;
};

function parseOrderLinesJson(raw: string | null | undefined): CartLine[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const r = row as Record<string, unknown>;
        const slug = String(r.slug ?? "").trim();
        const quantity = Number(r.quantity);
        if (!slug || quantity < 1) return null;
        return { slug, quantity };
      })
      .filter((l): l is CartLine => Boolean(l));
  } catch {
    return [];
  }
}

function rowToRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    productSlug: row.product_slug,
    productName: row.product_name,
    quantity: row.quantity as BundleQuantity,
    paymentMethod: row.payment_method,
    subtotalAed: row.subtotal_aed,
    deliveryFeeAed: row.delivery_fee_aed,
    totalAed: row.total_aed,
    customerName: row.customer_name,
    phone: row.phone,
    emirate: row.emirate,
    address: row.address,
    status: row.status,
    stripeCheckoutSessionId: row.stripe_checkout_session_id ?? null,
    stripePaymentIntentId: row.stripe_payment_intent_id ?? null,
    customerEmail: row.customer_email ?? null,
    marketingConsent: row.marketing_consent === 1,
    backendExternalCheckoutId: row.backend_external_checkout_id ?? null,
    createdAt: row.created_at,
    cartLines: parseOrderLinesJson(row.order_lines_json),
  };
}

export function computeOrderAmounts(
  quantity: BundleQuantity,
  paymentMethod: PaymentMethod,
): { subtotalAed: number; deliveryFeeAed: number; totalAed: number } {
  return computeOrderAmountsForUnits(quantity, paymentMethod);
}

export function computeOrderAmountsForUnits(
  eligibleUnits: number,
  paymentMethod: PaymentMethod,
): { subtotalAed: number; deliveryFeeAed: number; totalAed: number } {
  const subtotalAed = getMerchandiseAedForUnits(eligibleUnits) ?? 0;
  const totalAed = getCheckoutTotalForUnits(eligibleUnits, paymentMethod) ?? subtotalAed;
  const deliveryFeeAed = totalAed - subtotalAed;
  return { subtotalAed, deliveryFeeAed, totalAed };
}

export function computeOrderAmountsForCart(
  lines: CartLine[],
  paymentMethod: PaymentMethod,
): { subtotalAed: number; deliveryFeeAed: number; totalAed: number } {
  const subtotalAed = getMerchandiseAedForCart(lines) ?? 0;
  const totalAed = getCheckoutTotalForCart(lines, paymentMethod) ?? subtotalAed;
  const deliveryFeeAed = totalAed - subtotalAed;
  return { subtotalAed, deliveryFeeAed, totalAed };
}

function resolveCreateOrderAmounts(
  input: CreateOrderInput & { eligibleUnits?: number; cartLines?: CartLine[] },
): { subtotalAed: number; deliveryFeeAed: number; totalAed: number } {
  if (
    isStripeLiveTestCheckoutEnabled() &&
    isStripeLiveTestProductSlug(input.productSlug) &&
    (!input.cartLines || input.cartLines.length === 0)
  ) {
    const totalAed = resolveCheckoutTotalAed(
      input.quantity,
      input.paymentMethod,
      input.eligibleUnits,
      input.cartLines,
      input.productSlug,
    );
    const subtotalAed = resolveCheckoutMerchandiseAed(
      input.quantity,
      input.eligibleUnits,
      input.cartLines,
      input.productSlug,
    );
    return { subtotalAed, deliveryFeeAed: totalAed - subtotalAed, totalAed };
  }
  return input.cartLines && input.cartLines.length > 0
    ? computeOrderAmountsForCart(input.cartLines, input.paymentMethod)
    : computeOrderAmountsForUnits(input.eligibleUnits ?? input.quantity, input.paymentMethod);
}

export function createOrder(
  input: CreateOrderInput & { eligibleUnits?: number; cartLines?: CartLine[] },
): OrderRecord {
  const { subtotalAed, deliveryFeeAed, totalAed } = resolveCreateOrderAmounts(input);

  const requestedId = input.id?.trim() ?? "";
  const id =
    isStorefrontOrderId(requestedId) && !getOrderById(requestedId) ? requestedId : randomUUID();
  const createdAt = new Date().toISOString();

  const orderLinesJson =
    input.cartLines && input.cartLines.length > 0
      ? JSON.stringify(
          input.cartLines.map((line) => ({
            slug: line.slug,
            quantity: line.quantity,
          })),
        )
      : null;

  const orderAttributionJson =
    input.attribution && Object.keys(input.attribution).length > 0
      ? JSON.stringify(input.attribution)
      : null;

  getDb()
    .prepare(
      `INSERT INTO orders (
        id, product_slug, product_name, quantity, payment_method,
        subtotal_aed, delivery_fee_aed, total_aed,
        customer_name, phone, emirate, address, status, created_at,
        customer_email, marketing_consent, backend_external_checkout_id,
        order_lines_json, order_attribution_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.productSlug,
      input.productName,
      input.quantity,
      input.paymentMethod,
      subtotalAed,
      deliveryFeeAed,
      totalAed,
      input.customerName.trim(),
      input.phone.trim(),
      input.emirate.trim(),
      input.address.trim(),
      createdAt,
      input.customerEmail?.trim() || null,
      input.marketingConsent ? 1 : 0,
      input.backendExternalCheckoutId?.trim() || id,
      orderLinesJson,
      orderAttributionJson,
    );

  const row = getDb()
    .prepare(`SELECT * FROM orders WHERE id = ?`)
    .get(id) as OrderRow;

  return rowToRecord(row);
}

export function getOrderById(id: string): OrderRecord | null {
  const row = getDb().prepare(`SELECT * FROM orders WHERE id = ?`).get(id) as
    | OrderRow
    | undefined;
  return row ? rowToRecord(row) : null;
}

/** COD orders not yet marked exported to Google Sheets (for manual reconcile). */
export function listOrdersPendingCodSheetExport(limit = 50): OrderRecord[] {
  const capped = Math.min(Math.max(1, limit), 200);
  const rows = getDb()
    .prepare(
      `SELECT * FROM orders
       WHERE payment_method = 'cod'
         AND (sheet_cod_exported_at IS NULL OR TRIM(sheet_cod_exported_at) = '')
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(capped) as OrderRow[];
  return rows.map(rowToRecord);
}

/** Paid card orders not yet exported to the card Google Sheet tab. */
export function listOrdersPendingCardSheetExport(limit = 50): OrderRecord[] {
  const capped = Math.min(Math.max(1, limit), 200);
  const rows = getDb()
    .prepare(
      `SELECT * FROM orders
       WHERE payment_method = 'card'
         AND status = 'paid'
         AND (sheet_card_exported_at IS NULL OR TRIM(sheet_card_exported_at) = '')
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(capped) as OrderRow[];
  return rows.map(rowToRecord);
}

export function setOrderStripeSession(orderId: string, sessionId: string): void {
  getDb()
    .prepare(
      `UPDATE orders SET stripe_checkout_session_id = ?, status = 'awaiting_payment' WHERE id = ?`,
    )
    .run(sessionId, orderId);
}

export function markOrderPaid(orderId: string): void {
  getDb().prepare(`UPDATE orders SET status = 'paid' WHERE id = ?`).run(orderId);
}

export function getOrderByStripeSessionId(sessionId: string): OrderRecord | null {
  const row = getDb()
    .prepare(`SELECT * FROM orders WHERE stripe_checkout_session_id = ?`)
    .get(sessionId) as OrderRow | undefined;
  return row ? rowToRecord(row) : null;
}

export function setOrderStripePaymentIntent(orderId: string, paymentIntentId: string): void {
  getDb()
    .prepare(
      `UPDATE orders SET stripe_payment_intent_id = NULL
       WHERE stripe_payment_intent_id = ? AND id != ?`,
    )
    .run(paymentIntentId, orderId);
  getDb()
    .prepare(
      `UPDATE orders SET stripe_payment_intent_id = ?, status = 'awaiting_payment' WHERE id = ?`,
    )
    .run(paymentIntentId, orderId);
}

export function updateOrderCardCustomerDetails(
  orderId: string,
  input: {
    customerName: string;
    phone: string;
    emirate: string;
    address: string;
    customerEmail?: string;
    marketingConsent?: boolean;
  },
): OrderRecord | null {
  const existing = getOrderById(orderId);
  if (!existing || existing.paymentMethod !== "card") return null;
  getDb()
    .prepare(
      `UPDATE orders SET
        customer_name = ?,
        phone = ?,
        emirate = ?,
        address = ?,
        customer_email = ?,
        marketing_consent = ?
       WHERE id = ?`,
    )
    .run(
      input.customerName.trim(),
      input.phone.trim(),
      input.emirate.trim(),
      input.address.trim(),
      input.customerEmail?.trim() || null,
      input.marketingConsent === true ? 1 : 0,
      orderId,
    );
  return getOrderById(orderId);
}

export function getOrderByStripePaymentIntentId(paymentIntentId: string): OrderRecord | null {
  const row = getDb()
    .prepare(`SELECT * FROM orders WHERE stripe_payment_intent_id = ?`)
    .get(paymentIntentId) as OrderRow | undefined;
  return row ? rowToRecord(row) : null;
}

export function getOrderAttribution(orderId: string): OrderAttribution | null {
  const row = getDb()
    .prepare(`SELECT order_attribution_json FROM orders WHERE id = ?`)
    .get(orderId) as { order_attribution_json?: string | null } | undefined;
  return parseStoredOrderAttribution(row?.order_attribution_json);
}

export function getOrderCartLines(orderId: string): CartLine[] | null {
  const row = getDb()
    .prepare(`SELECT order_lines_json FROM orders WHERE id = ?`)
    .get(orderId) as { order_lines_json?: string | null } | undefined;
  if (!row?.order_lines_json) return null;
  try {
    const parsed = JSON.parse(row.order_lines_json) as unknown;
    if (!Array.isArray(parsed)) return null;
    const lines: CartLine[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const r = item as Record<string, unknown>;
      const slug = String(r.slug ?? "").trim();
      const quantity = Number(r.quantity);
      if (slug && quantity >= 1) lines.push({ slug, quantity });
    }
    return lines.length > 0 ? lines : null;
  } catch {
    return null;
  }
}

export function wasOrderSheetExported(
  orderId: string,
  channel: "cod" | "card",
): boolean {
  const column = channel === "cod" ? "sheet_cod_exported_at" : "sheet_card_exported_at";
  const row = getDb()
    .prepare(`SELECT ${column} AS exported_at FROM orders WHERE id = ?`)
    .get(orderId) as { exported_at?: string | null } | undefined;
  return Boolean(row?.exported_at);
}

export function markOrderSheetExported(orderId: string, channel: "cod" | "card"): void {
  const column = channel === "cod" ? "sheet_cod_exported_at" : "sheet_card_exported_at";
  const at = new Date().toISOString();
  if (channel === "card") {
    getDb()
      .prepare(`UPDATE orders SET ${column} = ?, sheet_card_export_last_error = NULL WHERE id = ?`)
      .run(at, orderId);
  } else {
    getDb()
      .prepare(`UPDATE orders SET ${column} = ? WHERE id = ?`)
      .run(at, orderId);
  }
}

export function recordCardSheetExportAttempt(orderId: string, error: string | null): void {
  const at = new Date().toISOString();
  getDb()
    .prepare(
      `UPDATE orders SET sheet_card_export_last_attempt_at = ?, sheet_card_export_last_error = ? WHERE id = ?`,
    )
    .run(at, error, orderId);
}

export type CardSheetOrderDiagnostic = {
  id: string;
  status: string;
  createdAt: string;
  totalAed: number;
  stripePaymentIntentId: string | null;
  sheetCardExportedAt: string | null;
  sheetCardExportLastError: string | null;
  sheetCardExportLastAttemptAt: string | null;
};

export function listRecentCardOrdersForDiagnostics(limit = 15): CardSheetOrderDiagnostic[] {
  const capped = Math.min(Math.max(1, limit), 50);
  const rows = getDb()
    .prepare(
      `SELECT id, status, created_at, total_aed, stripe_payment_intent_id,
              sheet_card_exported_at, sheet_card_export_last_error, sheet_card_export_last_attempt_at
       FROM orders
       WHERE payment_method = 'card'
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(capped) as {
    id: string;
    status: string;
    created_at: string;
    total_aed: number;
    stripe_payment_intent_id?: string | null;
    sheet_card_exported_at?: string | null;
    sheet_card_export_last_error?: string | null;
    sheet_card_export_last_attempt_at?: string | null;
  }[];
  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.created_at,
    totalAed: r.total_aed,
    stripePaymentIntentId: r.stripe_payment_intent_id ?? null,
    sheetCardExportedAt: r.sheet_card_exported_at ?? null,
    sheetCardExportLastError: r.sheet_card_export_last_error ?? null,
    sheetCardExportLastAttemptAt: r.sheet_card_export_last_attempt_at ?? null,
  }));
}

export function countCardOrdersPaidNotExported(): number {
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS n FROM orders
       WHERE payment_method = 'card' AND status = 'paid'
         AND (sheet_card_exported_at IS NULL OR TRIM(sheet_card_exported_at) = '')`,
    )
    .get() as { n: number };
  return row.n;
}

export function countCardOrdersAwaitingPaymentWithPi(): number {
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS n FROM orders
       WHERE payment_method = 'card'
         AND status IN ('awaiting_payment', 'pending')
         AND stripe_payment_intent_id IS NOT NULL
         AND TRIM(stripe_payment_intent_id) != ''`,
    )
    .get() as { n: number };
  return row.n;
}
