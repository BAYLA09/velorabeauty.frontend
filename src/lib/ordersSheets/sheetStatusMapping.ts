export type CanonicalCodStatus =
  | "pending"
  | "no_answer"
  | "confirmed"
  | "delivered"
  | "returned"
  | "cancelled";

function parseEnvLabelMap<T extends string>(envName: string): Record<string, T> {
  const raw = process.env[envName]?.trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    const out: Record<string, T> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (key && value) out[normalizeLabel(key)] = value as T;
    }
    return out;
  } catch {
    return {};
  }
}

const DEFAULT_LABEL_MAP: Record<string, CanonicalCodStatus> = {
  pending: "pending",
  new: "pending",
  "": "pending",
  no_answer: "no_answer",
  noanswer: "no_answer",
  "no answer": "no_answer",
  "pas de reponse": "no_answer",
  "pas de réponse": "no_answer",
  "لا رد": "no_answer",
  "لم يرد": "no_answer",
  confirmed: "confirmed",
  confirm: "confirmed",
  confirmé: "confirmed",
  confirme: "confirmed",
  "مؤكد": "confirmed",
  preparing: "confirmed",
  packed: "confirmed",
  processing: "confirmed",
  shipped: "confirmed",
  out_for_delivery: "confirmed",
  delivered: "delivered",
  livre: "delivered",
  livré: "delivered",
  "تم التوصيل": "delivered",
  returned: "returned",
  return: "returned",
  retour: "returned",
  "مرتجع": "returned",
  cancelled: "cancelled",
  canceled: "cancelled",
  cancel: "cancelled",
  "ملغى": "cancelled",
  "ملغي": "cancelled",
};

function normalizeLabel(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function codLabelMap(): Record<string, CanonicalCodStatus> {
  return { ...DEFAULT_LABEL_MAP, ...parseEnvLabelMap<CanonicalCodStatus>("ORDERS_SHEETS_COD_STATUS_LABELS_JSON") };
}

/** Map a Sheet status cell to a canonical COD order status. */
export function mapSheetStatusLabel(raw: string | null | undefined): CanonicalCodStatus | null {
  const label = normalizeLabel(String(raw ?? ""));
  if (!label) return null;
  const map = codLabelMap();
  if (map[label]) return map[label];
  for (const [key, value] of Object.entries(map)) {
    if (key && label.includes(key)) return value;
  }
  return null;
}

export function parseNotesField(notes: string, key: string): string | null {
  const parts = notes.split(/[;\n]/);
  const prefix = `${key}=`;
  for (const part of parts) {
    const t = part.trim();
    if (t.toLowerCase().startsWith(prefix.toLowerCase())) {
      return t.slice(prefix.length).trim() || null;
    }
  }
  return null;
}

export function extractOrderIdFromNotes(notes: string): string | null {
  const id = parseNotesField(notes, "orderId");
  return id?.trim() || null;
}

export type CanonicalCardStatus = "delivered" | "returned" | "refunded" | "cancelled";

const CARD_LABEL_MAP: Record<string, CanonicalCardStatus> = {
  delivered: "delivered",
  livre: "delivered",
  livré: "delivered",
  "تم التوصيل": "delivered",
  paid: "delivered",
  complete: "delivered",
  completed: "delivered",
  returned: "returned",
  return: "returned",
  retour: "returned",
  "مرتجع": "returned",
  refunded: "refunded",
  refund: "refunded",
  "مسترد": "refunded",
  "تم الاسترجاع": "refunded",
  cancelled: "cancelled",
  canceled: "cancelled",
  cancel: "cancelled",
  "ملغى": "cancelled",
  "ملغي": "cancelled",
};

function cardLabelMap(): Record<string, CanonicalCardStatus> {
  return { ...CARD_LABEL_MAP, ...parseEnvLabelMap<CanonicalCardStatus>("ORDERS_SHEETS_CARD_STATUS_LABELS_JSON") };
}

/** Map a Sheet status cell to a canonical card fulfillment status. */
export function mapCardSheetStatusLabel(
  raw: string | null | undefined,
): CanonicalCardStatus | null {
  const label = normalizeLabel(String(raw ?? ""));
  if (!label) return null;
  const map = cardLabelMap();
  if (map[label]) return map[label];
  for (const [key, value] of Object.entries(map)) {
    if (key && label.includes(key)) return value;
  }
  return null;
}
