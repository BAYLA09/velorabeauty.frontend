"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckoutBackActions } from "@/components/checkout/CheckoutBackActions";
import { CheckoutFunnelShell } from "@/components/checkout/CheckoutFunnelShell";
import { CheckoutSummarySidebar } from "@/components/checkout/CheckoutSummarySidebar";
import { checkoutExperience } from "@/config/checkoutExperience";
import {
  codFee,
  currencyLabel,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";

type Props = {
  paymentMethod: PaymentMethod;
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
};

export function CheckoutConfirmClient({
  paymentMethod,
  productSlug,
  productName,
  productImageSrc,
  quantity,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = getCheckoutTotal(quantity, paymentMethod);
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
          phone: trimmedPhone,
          email: isCod ? undefined : email.trim() || undefined,
          emirate: "دبي",
          address: isCod ? trimmedAddress : "يُؤكَّد بعد التواصل",
        }),
      });

      const data = (await res.json()) as { order?: OrderRecord; error?: string };
      if (!res.ok || !data.order) {
        setError(data.error ?? "تعذّر حفظ الطلب.");
        return;
      }

      const order = data.order;
      saveOrderDraft({
        orderId: order.id,
        productSlug: order.productSlug,
        productName: order.productName,
        quantity: order.quantity,
        method: order.paymentMethod,
        totalAed: order.totalAed,
        deliveryFeeAed: order.deliveryFeeAed,
        customerName: order.customerName,
        phone: order.phone,
        emirate: order.emirate,
        address: order.address,
        createdAt: order.createdAt,
      });
      router.push(`/order/thank-you?id=${encodeURIComponent(order.id)}`);
    } catch {
      setError("تعذّر الاتصال. حاولي مجدداً.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = isCod ? "إتمام الطلب" : checkoutExperience.card.title;
  const lead = isCod
    ? "الاسم، الهاتف، والعنوان — ونوصّل طلبك بالدفع عند الاستلام (+20 د.إ توصيل)."
    : "أدخلي بياناتك — نرسل لك رابط الدفع الآمن بعد التأكيد السريع.";

  return (
    <CheckoutFunnelShell currentStep={3}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-velora-burgundy/8 bg-white p-6 shadow-sm sm:p-8">
          <CheckoutBackActions
            productSlug={productSlug}
            quantity={quantity}
            paymentMethod={paymentMethod}
          />
          <div>
            <h1 className="text-2xl font-black text-velora-burgundy-dark sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/65">{lead}</p>
          </div>

          {!isCod && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/90 px-4 py-3 text-sm text-sky-950/85">
              <span className="text-lg" aria-hidden>
                📞
              </span>
              <p className="leading-relaxed">
                <span className="font-bold">تأكيد سريع</span> — نتصل بك قبل إرسال رابط الدفع الآمن.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {!isCod && (
              <label className="block">
                <span className="text-sm font-bold text-velora-burgundy-dark">
                  البريد الإلكتروني{" "}
                  <span className="font-normal text-velora-burgundy/45">(اختياري)</span>
                </span>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="name@email.com"
                  className="mt-2 w-full rounded-xl border border-velora-burgundy/15 bg-[#fafafa] px-4 py-3.5 text-sm text-velora-burgundy-dark outline-none focus:border-velora-burgundy/40 focus:ring-2 focus:ring-velora-burgundy/10"
                  autoComplete="email"
                />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-bold text-velora-burgundy-dark">الاسم الكامل</span>
              <input
                required
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="مثال: نورة العتيبي"
                className="mt-2 w-full rounded-xl border border-velora-burgundy/15 bg-[#fafafa] px-4 py-3.5 text-sm text-velora-burgundy-dark outline-none focus:border-velora-burgundy/40 focus:ring-2 focus:ring-velora-burgundy/10"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-velora-burgundy-dark">رقم الهاتف</span>
              <input
                required
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                placeholder="0501234567"
                className="mt-2 w-full rounded-xl border border-velora-burgundy/15 bg-[#fafafa] px-4 py-3.5 text-sm text-velora-burgundy-dark outline-none focus:border-velora-burgundy/40 focus:ring-2 focus:ring-velora-burgundy/10"
                autoComplete="tel"
              />
            </label>
            {isCod && (
              <label className="block">
                <span className="text-sm font-bold text-velora-burgundy-dark">العنوان</span>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                  placeholder="الإمارة، المنطقة، الشارع، رقم المبنى / الشقة…"
                  className="mt-2 w-full resize-none rounded-xl border border-velora-burgundy/15 bg-[#fafafa] px-4 py-3.5 text-sm text-velora-burgundy-dark outline-none focus:border-velora-burgundy/40 focus:ring-2 focus:ring-velora-burgundy/10"
                  autoComplete="street-address"
                />
              </label>
            )}

            {error && (
              <p className="text-sm font-bold text-rose-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-velora-burgundy py-4 text-base font-black text-velora-cream shadow-lg transition hover:bg-velora-burgundy-light disabled:opacity-60"
            >
              {submitting
                ? "جاري التأكيد…"
                : isCod
                  ? `تأكيد الطلب — ${formatPrice(total)}`
                  : `تأكيد والدفع بالبطاقة — ${formatPrice(total)}`}
              <span aria-hidden>←</span>
            </button>
            {isCod && (
              <p className="text-center text-[11px] font-semibold text-velora-burgundy/50">
                رسوم التوصيل {codFee} {currencyLabel} · الدفع عند الاستلام
              </p>
            )}
            {!isCod && (
              <p className="text-center text-[11px] text-velora-burgundy/50">
                شحن مجاني — رابط دفع آمن بعد التأكيد
              </p>
            )}

            <CheckoutBackActions
              productSlug={productSlug}
              quantity={quantity}
              paymentMethod={paymentMethod}
              variant="stacked"
            />
          </form>
        </section>

        <CheckoutSummarySidebar
          productName={productName}
          productImageSrc={productImageSrc}
          quantity={quantity}
          paymentMethod={paymentMethod}
        />
      </div>
    </CheckoutFunnelShell>
  );
}
