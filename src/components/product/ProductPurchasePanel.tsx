"use client";

import { useMemo, useState } from "react";
import {
  cardBundlePrices,
  codBundlePrices,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";

const offers: {
  qty: BundleQuantity;
  label: string;
  hint: string;
  badge?: string;
}[] = [
  { qty: 1, label: "منتج واحد", hint: "علبة واحدة" },
  { qty: 2, label: "منتجان", hint: "الأكثر اختياراً", badge: "الأكثر اختياراً" },
  { qty: 3, label: "المجموعة الكاملة", hint: "3 منتجات — أفضل قيمة", badge: "أكثر توفيراً" },
];

type Props = {
  productName: string;
};

export function ProductPurchasePanel({ productName }: Props) {
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [method, setMethod] = useState<PaymentMethod>("card");

  const total = getCheckoutTotal(quantity, method);
  const ctaLabel = useMemo(() => {
    if (method === "card") {
      return `ادفعي بالبطاقة · ${formatPrice(total)}`;
    }
    return `اطلبي بالدفع عند الاستلام · ${formatPrice(total)}`;
  }, [method, total]);

  return (
    <div className="rounded-[2rem] border border-velora-burgundy/10 bg-white p-6 shadow-xl shadow-velora-burgundy/5 md:p-8">
      <p className="text-sm font-medium text-velora-champagne-dark">اختاري العرض</p>
      <p className="mt-1 text-xs text-velora-burgundy/55">{productName}</p>

      <div className="mt-5 space-y-3">
        {offers.map((offer) => {
          const active = quantity === offer.qty;
          const cardPrice = cardBundlePrices[offer.qty];
          const codPrice = codBundlePrices[offer.qty];
          return (
            <button
              key={offer.qty}
              type="button"
              onClick={() => setQuantity(offer.qty)}
              className={`relative w-full rounded-2xl border-2 p-4 text-right transition-all ${
                active
                  ? "border-velora-burgundy bg-velora-cream-dark shadow-md"
                  : "border-velora-burgundy/10 hover:border-velora-champagne/50"
              }`}
            >
              {offer.badge && (
                <span className="absolute left-4 top-0 -translate-y-1/2 rounded-full bg-velora-champagne px-2.5 py-0.5 text-[10px] font-bold text-velora-burgundy-dark">
                  {offer.badge}
                </span>
              )}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-velora-burgundy">{offer.label}</p>
                  <p className="mt-0.5 text-xs text-velora-burgundy/55">{offer.hint}</p>
                </div>
                <p className="text-xl font-bold text-velora-burgundy">{formatPrice(cardPrice)}</p>
              </div>
              <p className="mt-2 text-xs text-velora-burgundy/50">
                عند الاستلام: {formatPrice(codPrice)}
              </p>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm font-semibold text-velora-burgundy">طرق الدفع</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`rounded-xl border-2 p-3 text-right text-sm transition ${
            method === "card"
              ? "border-velora-burgundy bg-velora-cream-dark"
              : "border-velora-burgundy/10"
          }`}
        >
          <p className="font-semibold text-velora-burgundy">الدفع بالبطاقة</p>
          <p className="mt-1 text-xs text-velora-burgundy/60">بدون رسوم إضافية</p>
        </button>
        <button
          type="button"
          onClick={() => setMethod("cod")}
          className={`rounded-xl border-2 p-3 text-right text-sm transition ${
            method === "cod"
              ? "border-velora-burgundy bg-velora-cream-dark"
              : "border-velora-burgundy/10"
          }`}
        >
          <p className="font-semibold text-velora-burgundy">الدفع عند الاستلام</p>
          <p className="mt-1 text-xs text-velora-burgundy/60">+20 د.إ رسوم</p>
        </button>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-velora-burgundy py-4 text-sm font-bold text-velora-cream shadow-lg shadow-velora-burgundy/25 transition hover:bg-velora-burgundy-light"
        data-payment-method={method}
        data-total={total}
        data-quantity={quantity}
      >
        {ctaLabel}
      </button>

      <p className="mt-3 text-center text-xs leading-relaxed text-velora-burgundy/55">
        {method === "card"
          ? "الدفع بالبطاقة — بدون رسوم إضافية"
          : "الدفع عند الاستلام — +20 د.إ رسوم الشحن"}
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-2 text-center text-[11px] text-velora-burgundy/70 sm:text-xs">
        <li className="rounded-xl bg-velora-cream-dark px-2 py-2">توصيل الإمارات</li>
        <li className="rounded-xl bg-velora-cream-dark px-2 py-2">دعم مخصص</li>
        <li className="rounded-xl bg-velora-cream-dark px-2 py-2">دفع آمن بالبطاقة</li>
        <li className="rounded-xl bg-velora-cream-dark px-2 py-2">COD متاح</li>
      </ul>
    </div>
  );
}
