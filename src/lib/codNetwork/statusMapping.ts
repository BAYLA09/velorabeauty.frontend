export type InternalCodStatus =
  | "pending"
  | "no_answer"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

const DEFAULT_LEAD_MAP: Record<string, InternalCodStatus> = {
  new: "pending",
  confirmed: "confirmed",
  "call later": "no_answer",
  "call later scheduled": "no_answer",
  "no reply": "no_answer",
  cancelled: "cancelled",
  wrong: "no_answer",
  expired: "no_answer",
  processing: "pending",
  delayed: "pending",
  "cancelled price": "cancelled",
  "black listed": "cancelled",
  blacklisted: "cancelled",
};

const DEFAULT_ORDER_MAP: Record<string, InternalCodStatus> = {
  new: "pending",
  assigned: "shipped",
  shipped: "shipped",
  delivered: "delivered",
  return: "returned",
  cancel: "cancelled",
  "out of stock": "pending",
  pending: "pending",
  "return on process": "returned",
  processing: "shipped",
};

function normalizeLabel(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseEnvMap(envName: string): Record<string, InternalCodStatus> {
  const raw = process.env[envName]?.trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    const out: Record<string, InternalCodStatus> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (k && v) out[normalizeLabel(k)] = v as InternalCodStatus;
    }
    return out;
  } catch {
    return {};
  }
}

function mapWithDefaults(
  raw: string | null | undefined,
  defaults: Record<string, InternalCodStatus>,
  envName: string,
): { status: InternalCodStatus | null; rawLabel: string } {
  const label = normalizeLabel(String(raw ?? ""));
  if (!label) return { status: null, rawLabel: "" };
  const map = { ...defaults, ...parseEnvMap(envName) };
  if (map[label]) return { status: map[label], rawLabel: label };
  for (const [key, value] of Object.entries(map)) {
    if (key && label.includes(key)) return { status: value, rawLabel: label };
  }
  return { status: null, rawLabel: label };
}

export function mapCodNetworkLeadStatus(raw: string | null | undefined) {
  return mapWithDefaults(raw, DEFAULT_LEAD_MAP, "COD_NETWORK_LEAD_STATUS_MAP_JSON");
}

export function mapCodNetworkOrderStatus(raw: string | null | undefined) {
  return mapWithDefaults(raw, DEFAULT_ORDER_MAP, "COD_NETWORK_ORDER_STATUS_MAP_JSON");
}
