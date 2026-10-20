import { checkoutEmirates } from "@/config/productCheckout";
import type { BundleQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { parseOrderAttributionFromBody } from "@/lib/attribution/orderAttribution";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import { validateUaeMobilePhone } from "@/lib/phone/uaePhone";
import {
  snapshotFromCheckoutFields,
  type PaymentIntentOrderSnapshotV1,
} from "@/lib/stripe/paymentIntentOrderMetadata";
function isBundleQuantity(n: unknown): n is BundleQuantity {
  return n === 1 || n === 2 || n === 3;
}

export type ParsedFinalizeCardOrder =
  | {
      ok: true;
      paymentIntentId: string;
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
      attribution: ReturnType<typeof parseOrderAttributionFromBody>;
      snapshot: PaymentIntentOrderSnapshotV1;
    }
  | { ok: false; error: string; status: number };

export function parseFinalizeCardOrderBody(body: Record<string, unknown>): ParsedFinalizeCardOrder {
  const paymentIntentId = String(body.paymentIntentId ?? "").trim();
  let productSlug = String(body.productSlug ?? "").trim();
  let productName = String(body.productName ?? "").trim();
  let eligibleUnits: number | undefined;
  const quantity = body.quantity;
  const rawCartLines = body.cartLines;
  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const emirate = String(body.emirate ?? "").trim();
  const address = String(body.address ?? "").trim();
  const email = String(body.email ?? "").trim();
  const marketingConsent = body.marketingConsent === true || body.marketingConsent === "true";
  const externalCheckoutId = String(body.externalCheckoutId ?? "").trim();
  let syncLines: CartLine[] | null = null;

  if (!paymentIntentId) {
    return { ok: false, error: "جلسة الدفع غير جاهزة.", status: 400 };
  }

  if (Array.isArray(rawCartLines) && rawCartLines.length > 0) {
    const lines: CartLine[] = rawCartLines
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const r = row as Record<string, unknown>;
        return {
          slug: String(r.slug ?? "").trim(),
          quantity: Number(r.quantity),
        };
      })
      .filter((l): l is CartLine => Boolean(l?.slug && l.quantity >= 1));
    syncLines = lines;
    const validated = validateCartForCheckout(lines);
    if (!validated.ok) {
      return { ok: false, error: validated.error, status: 400 };
    }
    if (!isBundleQuantity(quantity) || quantity !== validated.cart.bundleQuantity) {
      return { ok: false, error: "بيانات المنتج غير صالحة.", status: 400 };
    }
    productSlug = validated.cart.productSlug;
    productName = validated.cart.productName;
    eligibleUnits = validated.cart.eligibleUnits;
  }

  if (!productSlug || !productName || !isBundleQuantity(quantity)) {
    return { ok: false, error: "بيانات المنتج غير صالحة.", status: 400 };
  }
  if (!customerName || !phone || !address) {
    return { ok: false, error: "أكملي الاسم والهاتف وعنوان التوصيل.", status: 400 };
  }
  const phoneCheck = validateUaeMobilePhone(phone);
  if (!phoneCheck.ok) {
    return { ok: false, error: phoneCheck.error, status: 400 };
  }
  const resolvedPhone = phoneCheck.normalized;
  const resolvedEmirate =
    emirate && checkoutEmirates.includes(emirate as (typeof checkoutEmirates)[number])
      ? emirate
      : (checkoutEmirates[0] ?? "دبي");
  const attribution = parseOrderAttributionFromBody(body);

  const snapshot = snapshotFromCheckoutFields({
    productSlug,
    productName,
    quantity,
    eligibleUnits,
    cartLines: syncLines ?? undefined,
    customerName,
    phone: resolvedPhone,
    address,
    emirate: resolvedEmirate,
    email,
    marketingConsent,
    externalCheckoutId,
    attribution,
  });

  return {
    ok: true,
    paymentIntentId,
    productSlug,
    productName,
    quantity,
    eligibleUnits,
    cartLines: syncLines,
    customerName,
    phone: resolvedPhone,
    emirate: resolvedEmirate,
    address,
    email,
    marketingConsent,
    externalCheckoutId,
    attribution,
    snapshot,
  };
}

export type { ParsedCardOrderFields } from "@/lib/stripe/snapshotCardOrder";
