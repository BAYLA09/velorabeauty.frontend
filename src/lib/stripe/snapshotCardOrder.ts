import { checkoutEmirates } from "@/config/productCheckout";
import type { CartLine } from "@/lib/cart/cartTypes";
import { validateUaeMobilePhone } from "@/lib/phone/uaePhone";
import {
  cartLinesFromSnapshot,
  type PaymentIntentOrderSnapshotV1,
} from "@/lib/stripe/paymentIntentOrderMetadata";
import type { OrderAttribution } from "@/lib/attribution/orderAttribution";
import type { BundleQuantity } from "@/config/pricing";

export type ParsedCardOrderFields = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits?: number;
  cartLines: CartLine[] | null;
  customerName: string;
  phone: string;
  emirate: string;
  address: string;
  email: string;
  marketingConsent: boolean;
  externalCheckoutId: string;
  attribution: OrderAttribution | null;
  snapshot: PaymentIntentOrderSnapshotV1;
};

export function parseFinalizeCardOrderFromSnapshot(
  snapshot: PaymentIntentOrderSnapshotV1,
): ParsedCardOrderFields | null {
  if (!snapshot.customerName || !snapshot.phone || !snapshot.address) {
    return null;
  }
  const phoneCheck = validateUaeMobilePhone(snapshot.phone);
  if (!phoneCheck.ok) {
    return null;
  }
  const emirate =
    snapshot.emirate &&
    checkoutEmirates.includes(snapshot.emirate as (typeof checkoutEmirates)[number])
      ? snapshot.emirate
      : (checkoutEmirates[0] ?? "دبي");
  const cartLines = cartLinesFromSnapshot(snapshot) ?? null;
  return {
    productSlug: snapshot.productSlug,
    productName: snapshot.productName,
    quantity: snapshot.quantity,
    eligibleUnits: snapshot.eligibleUnits,
    cartLines,
    customerName: snapshot.customerName,
    phone: phoneCheck.normalized,
    emirate,
    address: snapshot.address,
    email: snapshot.email ?? "",
    marketingConsent: snapshot.mc === 1,
    externalCheckoutId: snapshot.extId ?? "",
    attribution: snapshot.attr ?? null,
    snapshot,
  };
}
