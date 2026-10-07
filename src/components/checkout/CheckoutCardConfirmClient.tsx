"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckoutBackActions } from "@/components/checkout/CheckoutBackActions";
import { CheckoutCardPaymentBlock } from "@/components/checkout/CheckoutCardPaymentBlock";
import { CheckoutFunnelShell } from "@/components/checkout/CheckoutFunnelShell";
import { CheckoutSummarySidebar } from "@/components/checkout/CheckoutSummarySidebar";
import {
  checkoutInputClass,
  checkoutLabelClass,
  checkoutSectionTitleClass,
} from "@/components/checkout/checkoutFieldStyles";
import { checkoutEmirates } from "@/config/productCheckout";
import { formatPrice, getCheckoutTotal, type BundleQuantity } from "@/config/pricing";
import { IconCard, IconTruck } from "@/components/product/ProductFunnelIcons";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";

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
              أكملي معلومات التوصيل — ثم نرسل لك رابط الدفع الآمن بالبطاقة.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            <fieldset className="space-y-4">
              <legend className={checkoutSectionTitleClass}>معلومات التواصل</legend>
              <p className="text-xs text-neutral-500">لإرسال تأكيد الطلب وتحديثات التوصيل</p>
              <label className="block">
                <span className={checkoutLabelClass}>
                  البريد الإلكتروني{" "}
                  <span className="font-normal text-neutral-400">(اختياري)</span>
                </span>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="name@email.com"
                  className={checkoutInputClass}
                  autoComplete="email"
                />
              </label>
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
                  onChange={(ev) => setPhone(ev.target.value)}
                  placeholder="0501234567"
                  className={checkoutInputClass}
                  autoComplete="tel"
                />
              </label>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className={checkoutSectionTitleClass}>عنوان التوصيل</legend>
              <label className="block">
                <span className={checkoutLabelClass}>المنطقة</span>
                <select
                  required
                  value={emirate}
                  onChange={(ev) => setEmirate(ev.target.value)}
                  className={checkoutInputClass}
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
                <span className={checkoutLabelClass}>العنوان / تفاصيل التوصيل</span>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                  placeholder="مثال: دبي مارينا، برج …"
                  className={`${checkoutInputClass} resize-none`}
                  autoComplete="street-address"
                />
              </label>
              <label className="block">
                <span className={checkoutLabelClass}>
                  رقم المبنى / الشقة{" "}
                  <span className="font-normal text-neutral-400">(اختياري)</span>
                </span>
                <input
                  value={building}
                  onChange={(ev) => setBuilding(ev.target.value)}
                  placeholder="Apt 1204"
                  className={checkoutInputClass}
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-4 text-base font-bold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {submitting ? "جاري التأكيد…" : `الدفع بالبطاقة — ${formatPrice(total)}`}
            </button>
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
