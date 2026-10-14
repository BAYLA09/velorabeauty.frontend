"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  captureCheckoutAttribution,
  getCheckoutAttributionForOrder,
} from "@/lib/attribution/checkoutAttributionClient";
import { CheckoutBackActions } from "@/components/checkout/CheckoutBackActions";
import { CheckoutEmailMarketingFields } from "@/components/checkout/CheckoutEmailMarketingFields";
import {
  clearStoredCheckoutExternalId,
  resolveCheckoutExternalId,
  useCaptureBackendCheckout,
} from "@/components/checkout/useCaptureBackendCheckout";
import { CheckoutFunnelShell } from "@/components/checkout/CheckoutFunnelShell";
import { CheckoutSummarySidebar } from "@/components/checkout/CheckoutSummarySidebar";
import {
  checkoutInputClass,
  checkoutLabelClass,
} from "@/components/checkout/checkoutFieldStyles";
import {
  codFee,
  currencyLabel,
  formatPrice,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { resolveCheckoutTotalAed } from "@/lib/checkoutTotals";
import { parseCheckoutLines } from "@/lib/checkoutUpsell";
import {
  sanitizeUaePhoneTyping,
  uaePhoneHint,
  uaePhonePlaceholder,
  validateUaeMobilePhone,
} from "@/lib/phone/uaePhone";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";

type Props = {
  paymentMethod: PaymentMethod;
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
};

export function CheckoutConfirmClient({
  paymentMethod,
  productSlug,
  productName,
  productImageSrc,
  quantity,
  eligibleUnits,
}: Props) {
  const searchParams = useSearchParams();
  const cartItemsParam = searchParams.get("items") ?? undefined;
  const cartLines = parseCheckoutLines(cartItemsParam, productSlug, quantity);
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { externalCheckoutId, syncNow } = useCaptureBackendCheckout({
    email,
    marketingConsent,
    customerName: name,
    phone,
    paymentMethod,
    productSlug,
    quantity,
    cartLines,
    sendCartLines: Boolean(cartItemsParam),
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    captureCheckoutAttribution();
  }, []);

  const total = resolveCheckoutTotalAed(
    quantity,
    paymentMethod,
    eligibleUnits,
    cartLines,
  );
  const isCod = paymentMethod === "cod";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !trimmedPhone) {
      setError("أكملي الاسم ورقم الهاتف.");
      return;
    }
    const phoneCheck = validateUaeMobilePhone(trimmedPhone);
    if (!phoneCheck.ok) {
      setError(phoneCheck.error);
      return;
    }
    if (isCod && !trimmedAddress) {
      setError("أدخلي عنوان التوصيل.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          quantity,
          paymentMethod,
          customerName: trimmedName,
          phone: phoneCheck.normalized,
          email: email.trim() || undefined,
          marketingConsent,
          externalCheckoutId: resolveCheckoutExternalId(externalCheckoutId),
          emirate: "دبي",
          address: isCod ? trimmedAddress : "يُؤكَّد بعد التواصل",
          ...(cartItemsParam ? { cartLines } : {}),
          attribution: getCheckoutAttributionForOrder(),
        }),
      });

      const data = (await res.json()) as { order?: OrderRecord; error?: string };
      if (!res.ok || !data.order) {
        setError(data.error ?? "تعذّر حفظ الطلب.");
        return;
      }

      const order = data.order;
      clearStoredCheckoutExternalId();
      saveOrderDraft({
        orderId: order.id,
        productSlug: order.productSlug,
        productName: order.productName,
        quantity: order.quantity,
        method: order.paymentMethod,
        totalAed: order.totalAed,
        deliveryFeeAed: order.deliveryFeeAed,
        subtotalAed: order.subtotalAed,
        status: order.status,
        customerName: order.customerName,
        phone: order.phone,
        emirate: order.emirate,
        address: order.address,
        createdAt: order.createdAt,
        ...(order.cartLines?.length
          ? { cartLines: order.cartLines }
          : cartItemsParam
            ? { cartLines }
            : {}),
      });
      router.push(`/order/thank-you?id=${encodeURIComponent(order.id)}`);
    } catch {
      setError("تعذّر الاتصال. حاولي مجدداً.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CheckoutFunnelShell currentStep={3}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
          <CheckoutBackActions
            productSlug={productSlug}
            quantity={quantity}
            backTo="payment"
            className="mb-6"
          />

          <header className="border-b border-neutral-100 pb-5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.65rem]">
              إتمام الطلب
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {isCod
                ? "الاسم، الهاتف، والعنوان — الدفع عند الاستلام."
                : "أدخلي بياناتك — نرسل لك رابط الدفع الآمن بعد التأكيد."}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className={checkoutLabelClass}>الاسم الكامل</span>
              <input
                required
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="مثال: نورة العتيبي"
                className={checkoutInputClass}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className={checkoutLabelClass}>رقم الهاتف</span>
              <input
                required
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(ev) => setPhone(sanitizeUaePhoneTyping(ev.target.value))}
                placeholder={uaePhonePlaceholder}
                className={`${checkoutInputClass} text-left`}
                autoComplete="tel"
                inputMode="tel"
                maxLength={18}
                aria-describedby="checkout-phone-hint"
              />
              <p id="checkout-phone-hint" className="mt-1.5 text-[11px] text-neutral-500">
                {uaePhoneHint}
              </p>
            </label>
            {isCod && (
              <label className="block">
                <span className={checkoutLabelClass}>العنوان</span>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                  placeholder="الإمارة، المنطقة، الشارع، رقم المبنى / الشقة…"
                  className={`${checkoutInputClass} resize-none`}
                  autoComplete="street-address"
                />
              </label>
            )}

            {isCod && (
              <CheckoutEmailMarketingFields
                email={email}
                setEmail={setEmail}
                marketingConsent={marketingConsent}
                setMarketingConsent={setMarketingConsent}
                onEmailBlur={syncNow}
              />
            )}

            {error && (
              <p className="text-sm font-medium text-rose-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-4 text-base font-bold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {submitting
                ? "جاري التأكيد…"
                : isCod
                  ? `تأكيد الطلب — ${formatPrice(total)}`
                  : `تأكيد والدفع بالبطاقة — ${formatPrice(total)}`}
            </button>
            {isCod && (
              <p className="text-center text-[11px] text-neutral-500">
                رسوم التوصيل {codFee} {currencyLabel} · الدفع عند الاستلام
              </p>
            )}
          </form>
        </section>

        <CheckoutSummarySidebar
          productSlug={productSlug}
          productName={productName}
          productImageSrc={productImageSrc}
          quantity={quantity}
          paymentMethod={paymentMethod}
          totalLabel="المجموع الكلي"
          editableBasket
        />
      </div>
    </CheckoutFunnelShell>
  );
}
