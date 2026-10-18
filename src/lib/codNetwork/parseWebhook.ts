/** Flexible parsers for COD Network webhook V1/V2 payloads (see developer.cod.network). */

export type ParsedLeadWebhook = {
  leadId: string;
  phone: string | null;
  sku: string | null;
  status: string | null;
  inputs: unknown;
  createdAtIso: string | null;
  rawStatusLabel: string;
};

export type ParsedOrderWebhook = {
  orderReference: string;
  leadId: string | null;
  phone: string | null;
  customerName: string | null;
  city: string | null;
  status: string | null;
  total: number | null;
  createdAtIso: string | null;
  rawStatusLabel: string;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const v = obj[key];
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return null;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const v = obj[key];
    if (v === null || v === undefined) continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function unwrapEntity(body: Record<string, unknown>, kinds: string[]): Record<string, unknown> {
  const data = asRecord(body.data) ?? body;
  for (const kind of kinds) {
    const nested = asRecord(data[kind]);
    if (nested) return nested;
  }
  return data;
}

function parseDateToIso(raw: string | null): string | null {
  if (!raw) return null;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

export function parseLeadWebhookBody(body: unknown): ParsedLeadWebhook | null {
  const root = asRecord(body);
  if (!root) return null;
  const lead = unwrapEntity(root, ["lead", "Lead"]);

  const leadId =
    pickString(lead, ["id", "lead_id", "leadId", "ID"]) ??
    pickString(root, ["lead_id", "leadId"]);
  if (!leadId) return null;

  const status =
    pickString(lead, ["status", "Status", "lead_status", "leadStatus"]) ??
    pickString(root, ["status", "Status"]);

  return {
    leadId,
    phone: pickString(lead, ["phone", "Phone", "mobile", "customer_phone"]),
    sku: pickString(lead, ["sku", "SKU", "product_sku", "productSku"]),
    status,
    inputs: lead.inputs ?? lead.Inputs ?? lead.form_inputs ?? lead.notes,
    createdAtIso: parseDateToIso(
      pickString(lead, ["created_at", "createdAt", "CreatedAt", "date"]),
    ),
    rawStatusLabel: status ?? "",
  };
}

export function parseOrderWebhookBody(body: unknown): ParsedOrderWebhook | null {
  const root = asRecord(body);
  if (!root) return null;
  const order = unwrapEntity(root, ["order", "Order"]);

  const orderReference =
    pickString(order, ["reference", "Reference", "order_reference", "orderReference"]) ??
    pickString(root, ["reference", "Reference"]);
  if (!orderReference) return null;

  const status =
    pickString(order, ["status", "Status", "order_status", "orderStatus"]) ??
    pickString(root, ["status", "Status"]);

  return {
    orderReference,
    leadId: pickString(order, ["lead_id", "leadId", "Lead ID", "leadID"]),
    phone: pickString(order, ["phone", "Phone", "customer_phone", "customerPhone"]),
    customerName: pickString(order, ["name", "customer_name", "customerName", "Name"]),
    city: pickString(order, ["city", "City", "emirate"]),
    status,
    total: pickNumber(order, ["total", "Total", "order_total", "total_amount"]),
    createdAtIso: parseDateToIso(
      pickString(order, ["created_at", "createdAt", "CreatedAt", "date"]),
    ),
    rawStatusLabel: status ?? "",
  };
}

const ORDER_ID_RE = /orderId=([0-9a-f-]{8,})/i;

export function extractStorefrontOrderIdFromInputs(inputs: unknown): string | null {
  if (inputs === null || inputs === undefined) return null;
  if (typeof inputs === "string") {
    const m = inputs.match(ORDER_ID_RE);
    return m?.[1] ?? null;
  }
  const rec = asRecord(inputs);
  if (rec) {
    for (const v of Object.values(rec)) {
      if (typeof v === "string") {
        const m = v.match(ORDER_ID_RE);
        if (m?.[1]) return m[1];
      }
    }
    const direct = pickString(rec, ["orderId", "order_id", "orderID"]);
    if (direct) return direct;
  }
  if (Array.isArray(inputs)) {
    for (const item of inputs) {
      const id = extractStorefrontOrderIdFromInputs(item);
      if (id) return id;
    }
  }
  const blob = JSON.stringify(inputs);
  const m = blob.match(ORDER_ID_RE);
  return m?.[1] ?? null;
}
