"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { checkoutEmirates, productCheckoutCopy } from "@/config/productCheckout";
import {
  cardBundlePrices,
  codFee,
  currencyLabel,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { saveOrderDraft } from "@/lib/orderStorage";
import { orderChoiceHref, quantityLabels } from "@/lib/orderIntent";

type Props = {
  method: PaymentMethod;
  productSlug?: string;
  productName: string;
  quantity: BundleQuantity;
};

export function MethodCheckout({ method, productSlug, productName, quantity }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState(checkoutEmirates[0] ?? "دبي");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const offer = cardBundlePrices[quantity];
  const total = getCheckoutTotal(quantity, method);
  const isCard = method === "card";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !trimmedPhone || !trimmedAddress) {
      setError("عفواً — أكملي الاسم والهاتف والعنوان.");
      return;
    }
    saveOrderDraft({
      productSlug: productSlug ?? "velora-offer",
      productName,
      quantity,
      method,
      totalAed: total,
      customerName: trimmedName,
      phone: trimmedPhone,
      emirate,
      address: trimmedAddress,
      createdAt: new Date().toISOString(),
    });
    setDone(true);
  }

  if (done) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center sm:py-24">
        <p className="text-[11px] font-bold tracking-[0.28em] text-velora-champagne-dark">
          {isCard ? "CARD" : "CASH ON DELIVERY"}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold text-velora-burgundy-dark">طلبك وصلنا</h1>
        <p className="mt-4 text-base leading-relaxed text-velora-burgundy/75">
          {name.trim()}، فريق فيلورا يتصل بك على{" "}
          <span dir="ltr" className="font-semibold">
            {phone.trim()}
          </span>{" "}
          لتأكيد عنوان {productName}.
        </p>
        <div className="mt-8 rounded-[1.75rem] bg-white p-6 text-right shadow-lg">
          <p className="text-sm text-velora-burgundy/60">{quantityLabels[quantity]}</p>
          <p className="mt-2 text-3xl font-black text-velora-burgundy-dark">{formatPrice(total)}</p>
          <p className="mt-3 text-sm leading-relaxed text-velora-burgundy/70">
            {isCard
              ? "بعد المكالمة يصلك رابط دفع بالبطاقة. الشحن مجاني."
              : `تدفعين ${formatPrice(total)} للمندوب، ومنها ${codFee} ${currencyLabel} رسوم التوصيل.`}
          </p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-velora-burgundy px-6 py-3 text-sm font-bold text-velora-cream"
        >
          العودة للرئيسية
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
      <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-velora-burgundy/5 sm:p-8">
        <p className="text-[11px] font-bold tracking-[0.32em] text-velora-champagne-dark">
          {isCard ? "CARD · SHIPPING 0" : `COD · +${codFee} ${currencyLabel}`}
        </p>
        <div className="mt-4 h-px w-14 bg-velora-champagne" />
        <h1 className="mt-4 font-display text-4xl font-bold text-velora-burgundy-dark sm:text-5xl">
          {isCard ? "الدفع بالبطاقة" : "الدفع عند الاستلام"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-velora-burgundy/70">
          {productName} · {quantityLabels[quantity]}.{" "}
          {isCard ? productCheckoutCopy.cardNextStep : productCheckoutCopy.codNextStep}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-velora-burgundy/70">{productCheckoutCopy.fields.name}</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="mt-1.5 w-full border-0 border-b border-velora-burgundy/20 bg-transparent px-1 py-3 text-sm outline-none focus:border-velora-champagne-dark"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-velora-burgundy/70">{productCheckoutCopy.fields.phone}</span>
            <input
              required
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+971"
              autoComplete="tel"
              className="mt-1.5 w-full border-0 border-b border-velora-burgundy/20 bg-transparent px-1 py-3 text-sm outline-none focus:border-velora-champagne-dark"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-velora-burgundy/70">{productCheckoutCopy.fields.emirate}</span>
            <select
              value={emirate}
              onChange={(event) => setEmirate(event.target.value)}
              className="mt-1.5 w-full border-0 border-b border-velora-burgundy/20 bg-transparent px-1 py-3 text-sm outline-none focus:border-velora-champagne-dark"
            >
              {checkoutEmirates.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-velora-burgundy/70">{productCheckoutCopy.fields.address}</span>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-1.5 w-full resize-none border-0 border-b border-velora-burgundy/20 bg-transparent px-1 py-3 text-sm outline-none focus:border-velora-champagne-dark"
            />
          </label>
        </div>
        {error && (
          <p className="mt-3 text-sm font-semibold text-rose-700" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-velora-burgundy py-4 text-sm font-bold text-velora-cream transition hover:bg-velora-burgundy-light"
        >
          {isCard ? "تأكيد الطلب بالبطاقة" : "تأكيد الطلب عند الاستلام"}
        </button>
        <Link
          href={orderChoiceHref(productSlug, quantity)}
          className="mt-4 block text-center text-xs font-semibold text-velora-burgundy/60 underline-offset-4 hover:underline"
        >
          تغيير طريقة الدفع
        </Link>
      </form>

      <aside
        className={
          isCard
            ? "h-fit rounded-[2rem] bg-velora-burgundy-dark p-7 text-velora-cream shadow-2xl"
            : "h-fit rounded-[2rem] border border-velora-champagne/40 bg-white p-7 text-velora-burgundy-dark shadow-xl"
        }
      >
        <p className={`text-[11px] font-bold tracking-[0.28em] ${isCard ? "text-velora-champagne" : "text-velora-champagne-dark"}`}>
          الملخص
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold">{productName}</h2>
        <p className={`mt-2 text-sm ${isCard ? "text-velora-cream/70" : "text-velora-burgundy/65"}`}>
          {quantityLabels[quantity]}
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className={isCard ? "text-velora-cream/65" : "text-velora-burgundy/60"}>العرض</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(offer)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className={isCard ? "text-velora-cream/65" : "text-velora-burgundy/60"}>التوصيل</dt>
            <dd className="font-semibold tabular-nums">
              {isCard ? `مجاني · 0 ${currencyLabel}` : `+${codFee} ${currencyLabel}`}
            </dd>
          </div>
        </dl>
        {!isCard && (
          <p className="mt-5 border-y border-velora-champagne/70 py-4 text-sm font-semibold leading-relaxed text-velora-burgundy">
            رسوم التوصيل +{codFee} {currencyLabel} تُضاف على هذا الطلب فقط، لأنك اخترتِ الدفع عند الاستلام.
          </p>
        )}
        <div className={`mt-6 flex items-end justify-between border-t pt-5 ${isCard ? "border-white/15" : "border-velora-burgundy/10"}`}>
          <span className={isCard ? "text-velora-cream/65" : "text-velora-burgundy/60"}>المجموع</span>
          <span className="text-4xl font-black tabular-nums">{formatPrice(total)}</span>
        </div>
      </aside>
    </section>
  );
}
