export type CanonicalCodStatus =
  | "pending"
  | "no_answer"
  | "confirmed"
  | "delivered"
  | "returned"
  | "cancelled";

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

/** Map a Sheet status cell to a canonical COD order status. */
export function mapSheetStatusLabel(raw: string | null | undefined): CanonicalCodStatus | null {
  const label = normalizeLabel(String(raw ?? ""));
  if (!label) return null;
  if (DEFAULT_LABEL_MAP[label]) return DEFAULT_LABEL_MAP[label];
  for (const [key, value] of Object.entries(DEFAULT_LABEL_MAP)) {
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

/** Map a Sheet status cell to a canonical card fulfillment status. */
export function mapCardSheetStatusLabel(
  raw: string | null | undefined,
): CanonicalCardStatus | null {
  const label = normalizeLabel(String(raw ?? ""));
  if (!label) return null;
  if (CARD_LABEL_MAP[label]) return CARD_LABEL_MAP[label];
  for (const [key, value] of Object.entries(CARD_LABEL_MAP)) {
    if (key && label.includes(key)) return value;
  }
  return null;
}
