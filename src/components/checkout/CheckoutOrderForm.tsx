"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { checkoutExperience } from "@/config/checkoutExperience";
import { checkoutEmirates } from "@/config/productCheckout";
import type { BundleQuantity, PaymentMethod } from "@/config/pricing";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";

type Props = {
  paymentMethod: PaymentMethod;
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  accent: "gold" | "burgundy";
};

export function CheckoutOrderForm({
  paymentMethod,
  productSlug,
  productName,
  quantity,
  accent,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState(checkoutEmirates[0] ?? "دبي");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const copy = checkoutExperience[paymentMethod];
  const productLine = useMemo(
    () => (
      <p className="mb-6 rounded-2xl border border-velora-burgundy/10 bg-velora-cream-dark/80 px-4 py-3 text-sm">
        <span className="font-bold text-velora-burgundy">{productName}</span>
        <span className="text-velora-burgundy/60"> · عرض {quantity}</span>
      </p>
    ),
    [productName, quantity],
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !trimmedPhone || !trimmedAddress) {
      setError("عفواً — أكملي الاسم والهاتف والعنوان.");
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
          emirate,
          address: trimmedAddress,
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
      setError("تعذّر الاتصال. تحققي من الشبكة وحاولي مجدداً.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {productLine}

      <div>
        <h2 className="text-lg font-black text-velora-burgundy-dark">بيانات التوصيل</h2>
        <p className="mt-1 text-xs text-velora-burgundy/55">{checkoutExperience.trustLine}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-velora-burgundy/70">
              {checkoutExperience.fields.name}
            </span>
            <input
              required
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className="mt-1.5 w-full rounded-xl border border-velora-burgundy/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-velora-burgundy/70">
              {checkoutExperience.fields.phone}
            </span>
            <input
              required
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              className="mt-1.5 w-full rounded-xl border border-velora-burgundy/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
              autoComplete="tel"
              placeholder="+971"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-velora-burgundy/70">
              {checkoutExperience.fields.emirate}
            </span>
            <select
              value={emirate}
              onChange={(ev) => setEmirate(ev.target.value)}
              className="mt-1.5 w-full rounded-xl border border-velora-burgundy/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
            >
              {checkoutEmirates.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-velora-burgundy/70">
              {checkoutExperience.fields.address}
            </span>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              className="mt-1.5 w-full resize-none rounded-xl border border-velora-burgundy/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
            />
          </label>
        </div>
        {error && (
          <p className="mt-3 text-sm font-semibold text-rose-700" role="alert">
            {error}
          </p>
        )}
      </div>

      <CheckoutSummary
        quantity={quantity}
        method={paymentMethod}
        submitLabel={submitting ? "جاري الحفظ…" : copy.submit}
        submitType="submit"
        variant="light"
        disabled={submitting}
      />

      {accent === "gold" && (
        <p className="text-center text-[11px] leading-relaxed text-velora-burgundy/50">
          الدفع بالبطاقة يتم عبر رابط آمن بعد تأكيد الطلب — لا نخزّن بيانات البطاقة على
          الموقع.
        </p>
      )}
    </form>
  );
}
