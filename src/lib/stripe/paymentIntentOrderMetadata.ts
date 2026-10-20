import type { OrderAttribution } from "@/lib/attribution/orderAttribution";
import type { BundleQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";

const MAX_METADATA_VALUE_LEN = 500;
const MAX_METADATA_KEYS = 50;
const CHUNK_PREFIX = "op";
const CHUNK_COUNT_KEY = "opN";

export type PaymentIntentOrderSnapshotV1 = {
  v: 1;
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits?: number;
  cartLines?: { slug: string; q: number }[];
  customerName?: string;
  phone?: string;
  address?: string;
  emirate?: string;
  email?: string;
  mc?: 0 | 1;
  extId?: string;
  attr?: OrderAttribution;
};

function compactCartLines(lines: CartLine[] | undefined): { slug: string; q: number }[] | undefined {
  if (!lines?.length) return undefined;
  return lines.map((l) => ({ slug: l.slug, q: l.quantity }));
}

function expandCartLines(
  lines: { slug: string; q: number }[] | undefined,
): CartLine[] | undefined {
  if (!lines?.length) return undefined;
  return lines.map((l) => ({ slug: l.slug, quantity: l.q }));
}

export function snapshotFromCheckoutFields(input: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits?: number;
  cartLines?: CartLine[];
  customerName?: string;
  phone?: string;
  address?: string;
  emirate?: string;
  email?: string;
  marketingConsent?: boolean;
  externalCheckoutId?: string;
  attribution?: OrderAttribution | null;
}): PaymentIntentOrderSnapshotV1 {
  const snap: PaymentIntentOrderSnapshotV1 = {
    v: 1,
    productSlug: input.productSlug,
    productName: input.productName,
    quantity: input.quantity,
  };
  if (input.eligibleUnits !== undefined) snap.eligibleUnits = input.eligibleUnits;
  const cart = compactCartLines(input.cartLines);
  if (cart?.length) snap.cartLines = cart;
  if (input.customerName?.trim()) snap.customerName = input.customerName.trim();
  if (input.phone?.trim()) snap.phone = input.phone.trim();
  if (input.address?.trim()) snap.address = input.address.trim();
  if (input.emirate?.trim()) snap.emirate = input.emirate.trim();
  if (input.email?.trim()) snap.email = input.email.trim();
  if (input.marketingConsent === true) snap.mc = 1;
  if (input.externalCheckoutId?.trim()) snap.extId = input.externalCheckoutId.trim();
  if (input.attribution && Object.keys(input.attribution).length > 0) {
    snap.attr = input.attribution;
  }
  return snap;
}

function encodePayloadChunks(json: string): Record<string, string> {
  const out: Record<string, string> = { opV: "1" };
  if (json.length <= MAX_METADATA_VALUE_LEN) {
    out.op = json;
    return out;
  }
  const chunks: string[] = [];
  for (let off = 0; off < json.length; off += MAX_METADATA_VALUE_LEN) {
    chunks.push(json.slice(off, off + MAX_METADATA_VALUE_LEN));
  }
  const reserved = 6;
  const maxChunks = Math.max(1, MAX_METADATA_KEYS - reserved);
  const used = chunks.slice(0, maxChunks);
  if (used.length < chunks.length) {
    throw new Error("payment_intent_metadata_too_large");
  }
  used.forEach((part, i) => {
    out[`${CHUNK_PREFIX}${i}`] = part;
  });
  out[CHUNK_COUNT_KEY] = String(used.length);
  return out;
}

export function stripeMetadataFromOrderSnapshot(
  snapshot: PaymentIntentOrderSnapshotV1,
  extra?: Record<string, string>,
): Record<string, string> {
  const json = JSON.stringify(snapshot);
  const encoded = encodePayloadChunks(json);
  const flat: Record<string, string> = {
    productSlug: snapshot.productSlug,
    productName: snapshot.productName,
    quantity: String(snapshot.quantity),
  };
  if (snapshot.customerName) flat.customerName = snapshot.customerName.slice(0, 500);
  if (snapshot.phone) flat.phone = snapshot.phone.slice(0, 500);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) flat[k] = v.slice(0, 500);
    }
  }
  const merged = { ...flat, ...encoded };
  if (Object.keys(merged).length > MAX_METADATA_KEYS) {
    throw new Error("payment_intent_metadata_too_many_keys");
  }
  return merged;
}

function decodePayloadJson(metadata: Record<string, string>): string | null {
  if (metadata.op?.trim()) return metadata.op;
  const countRaw = metadata[CHUNK_COUNT_KEY];
  const count = countRaw ? Number(countRaw) : 0;
  if (!Number.isFinite(count) || count < 1) return null;
  let json = "";
  for (let i = 0; i < count; i += 1) {
    const part = metadata[`${CHUNK_PREFIX}${i}`];
    if (!part) return null;
    json += part;
  }
  return json || null;
}

export function parsePaymentIntentOrderSnapshot(
  metadata: Record<string, string> | null | undefined,
): PaymentIntentOrderSnapshotV1 | null {
  if (!metadata) return null;
  const asRecord: Record<string, string> = {};
  for (const [k, v] of Object.entries(metadata)) {
    if (typeof v === "string") asRecord[k] = v;
  }
  const json = decodePayloadJson(asRecord);
  if (json) {
    try {
      const parsed = JSON.parse(json) as PaymentIntentOrderSnapshotV1;
      if (parsed?.v === 1 && parsed.productSlug && parsed.productName && parsed.quantity) {
        return parsed;
      }
    } catch {
      return null;
    }
  }
  const quantity = Number(asRecord.quantity);
  if (!asRecord.productSlug || !asRecord.productName || quantity !== 1 && quantity !== 2 && quantity !== 3) {
    return null;
  }
  return snapshotFromCheckoutFields({
    productSlug: asRecord.productSlug,
    productName: asRecord.productName,
    quantity: quantity as BundleQuantity,
    customerName: asRecord.customerName,
    phone: asRecord.phone,
    address: asRecord.address,
    emirate: asRecord.emirate,
    email: asRecord.email,
  });
}

export function cartLinesFromSnapshot(snapshot: PaymentIntentOrderSnapshotV1): CartLine[] | undefined {
  return expandCartLines(snapshot.cartLines);
}
