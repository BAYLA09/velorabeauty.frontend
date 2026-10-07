"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckoutBackActions } from "@/components/checkout/CheckoutBackActions";
import { CheckoutCardPaymentBlock } from "@/components/checkout/CheckoutCardPaymentBlock";
import { CheckoutFunnelShell } from "@/components/checkout/CheckoutFunnelShell";
import { CheckoutSummarySidebar } from "@/components/checkout/CheckoutSummarySidebar";
import { checkoutEmirates } from "@/config/productCheckout";
import { formatPrice, getCheckoutTotal, type BundleQuantity } from "@/config/pricing";
import { IconCard, IconTruck } from "@/components/product/ProductFunnelIcons";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";

const inputClass =
  "mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50/80 px-4 py-3.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-200/80";

type Props = {
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
};

export function CheckoutCardConfirmClient({
  productSlug,
  productName,
  productImageSrc,
  quantity,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = getCheckoutTotal(quantity, "card");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !trimmedPhone || !trimmedAddress || !emirate) {
      setError("أكملي الاسم والهاتف والإمارة وعنوان التوصيل.");
      return;
    }

    const buildingPart = building.trim();
    const fullAddress = buildingPart
      ? `${trimmedAddress} — ${buildingPart}`
      : trimmedAddress;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          quantity,
          paymentMethod: "card",
          customerName: trimmedName,
          phone: trimmedPhone,
          email: email.trim() || undefined,
          emirate,
          address: fullAddress,
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

  return (
    <CheckoutFunnelShell currentStep={3}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-velora-burgundy/8 bg-white p-6 shadow-sm sm:p-8">
          <CheckoutBackActions
            productSlug={productSlug}
            quantity={quantity}
            paymentMethod="card"
          />

          <header className="border-b border-velora-burgundy/8 pb-5">
            <h1 className="text-2xl font-black text-velora-burgundy-dark sm:text-3xl">إتمام الطلب</h1>
            <p className="mt-2 text-sm text-velora-burgundy/65">
              أكملي معلومات التوصيل — ثم نرسل لك رابط الدفع الآمن بالبطاقة.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            <fieldset className="space-y-4">
              <legend className="text-base font-black text-velora-burgundy-dark">
                معلومات التواصل
              </legend>
              <p className="text-xs text-velora-burgundy/50">لإرسال تأكيد الطلب وتحديثات التوصيل</p>
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
                  className={inputClass}
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-velora-burgundy-dark">الاسم الكامل</span>
                <input
                  required
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder="مثال: نورة العتيبي"
                  className={inputClass}
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
                  className={inputClass}
                  autoComplete="tel"
                />
              </label>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-base font-black text-velora-burgundy-dark">عنوان التوصيل</legend>
              <label className="block">
                <span className="text-sm font-bold text-velora-burgundy-dark">المنطقة</span>
                <select
                  required
                  value={emirate}
                  onChange={(ev) => setEmirate(ev.target.value)}
                  className={inputClass}
                >
                  <option value="">اختاري الإمارة</option>
                  {checkoutEmirates.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-velora-burgundy-dark">
                  العنوان / تفاصيل التوصيل
                </span>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                  placeholder="مثال: دبي مارينا، برج …"
                  className={`${inputClass} resize-none`}
                  autoComplete="street-address"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-velora-burgundy-dark">
                  رقم المبنى / الشقة{" "}
                  <span className="font-normal text-velora-burgundy/45">(اختياري)</span>
                </span>
                <input
                  value={building}
                  onChange={(ev) => setBuilding(ev.target.value)}
                  placeholder="Apt 1204"
                  className={inputClass}
                />
              </label>
            </fieldset>

            <CheckoutCardPaymentBlock />

            {error && (
              <p className="text-sm font-bold text-rose-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-velora-burgundy to-[#2c1318] py-4 text-base font-black text-velora-cream shadow-lg transition hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "جاري التأكيد…" : `الدفع بالبطاقة — ${formatPrice(total)}`}
              <span aria-hidden>←</span>
            </button>

            <CheckoutBackActions
              productSlug={productSlug}
              quantity={quantity}
              paymentMethod="card"
              variant="stacked"
            />
          </form>
        </section>

        <CheckoutSummarySidebar
          productName={productName}
          productImageSrc={productImageSrc}
          quantity={quantity}
          paymentMethod="card"
          totalLabel="المجموع الكلي"
          footer={
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#e8f5e9] px-3 py-3 text-center text-xs font-bold text-emerald-900">
              <IconTruck className="h-4 w-4 shrink-0" />
              <span>شحن مجاني مع الدفع بالبطاقة</span>
              <IconCard className="h-4 w-4 shrink-0" />
            </div>
          }
        />
      </div>
    </CheckoutFunnelShell>
  );
}
