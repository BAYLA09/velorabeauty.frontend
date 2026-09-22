"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductForm } from "@/config/productPages";
import {
  codBundlePrices,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { getBundleDisplay } from "@/lib/bundleDisplay";

const quantities: BundleQuantity[] = [1, 2, 3];

function offerMeta(form: ProductForm, qty: BundleQuantity) {
  if (qty === 1) {
    return {
      label: form === "serum" ? "سيروم واحد" : "منتج واحد",
      hint: form === "serum" ? "عناية محيط العين" : "علبة واحدة — روتينك",
      badge: undefined as string | undefined,
    };
  }
  if (qty === 2) {
    return {
      label: "منتجان",
      hint: "روتين أقوى — قيمة أوضح",
      badge: "الأكثر اختياراً",
    };
  }
  return {
    label: "3 منتجات",
    hint: "المجموعة الكاملة — أفضل توفير",
    badge: "أكثر توفيراً",
  };
}

export type PurchaseState = {
  quantity: BundleQuantity;
  method: PaymentMethod;
  total: number;
  ctaLabel: string;
};

type Props = {
  form: ProductForm;
  onChange?: (state: PurchaseState) => void;
};

export function ProductPurchasePanel({ form, onChange }: Props) {
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [method, setMethod] = useState<PaymentMethod>("card");

  const total = getCheckoutTotal(quantity, method);
  const ctaLabel = useMemo(
    () =>
      method === "card"
        ? `ابدئي روتينك الآن · ${formatPrice(total)}`
        : `اطلبي بالدفع عند الاستلام · ${formatPrice(total)}`,
    [method, total],
  );

  useEffect(() => {
    onChange?.({ quantity, method, total, ctaLabel });
  }, [quantity, method, total, ctaLabel, onChange]);

  return (
    <div className="space-y-4">
      <p className="text-sm font-extrabold text-velora-burgundy">اختاري العرض:</p>

      <div className="space-y-3">
        {quantities.map((qty) => {
          const active = quantity === qty;
          const meta = offerMeta(form, qty);
          const display = getBundleDisplay(qty);
          return (
            <button
              key={qty}
              type="button"
              onClick={() => setQuantity(qty)}
              className={`relative flex min-h-[4.75rem] w-full items-stretch gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
                active
                  ? "border-velora-burgundy bg-velora-cream-dark shadow-md"
                  : "border-velora-burgundy/10 bg-white hover:border-velora-burgundy/30"
              }`}
            >
              {meta.badge && (
                <span className="absolute left-4 top-0 -translate-y-1/2 rounded-full bg-velora-champagne px-2.5 py-0.5 text-[10px] font-bold text-velora-burgundy-dark">
                  {meta.badge}
                </span>
              )}
              <span
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-velora-burgundy bg-velora-burgundy" : "border-velora-burgundy/25 bg-white"
                }`}
              >
                {active && <span className="h-2 w-2 rounded-full bg-velora-cream" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-velora-burgundy">{meta.label}</p>
                <p className="mt-1 text-xs text-velora-burgundy/55">{meta.hint}</p>
                {display.showCompare && (
                  <p className="mt-1 text-xs font-medium text-velora-champagne-dark">
                    وفّري {formatPrice(display.savings)} · {formatPrice(display.perUnit)} / منتج
                  </p>
                )}
              </div>
              <div className="flex min-w-[5.5rem] flex-col items-end tabular-nums">
                {display.showCompare && (
                  <span className="text-xs text-velora-burgundy/40 line-through">
                    {formatPrice(display.compareAt)}
                  </span>
                )}
                <span className="text-xl font-extrabold text-velora-burgundy">
                  {formatPrice(display.price)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-sm font-extrabold text-velora-burgundy">طرق الدفع المتاحة</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`rounded-xl border-2 p-3 text-right text-sm ${
            method === "card" ? "border-velora-burgundy bg-velora-cream-dark" : "border-velora-burgundy/10 bg-white"
          }`}
        >
          <p className="font-bold text-velora-burgundy">الدفع بالبطاقة</p>
          <p className="mt-1 text-xs text-velora-burgundy/60">بدون رسوم إضافية</p>
        </button>
        <button
          type="button"
          onClick={() => setMethod("cod")}
          className={`rounded-xl border-2 p-3 text-right text-sm ${
            method === "cod" ? "border-velora-burgundy bg-velora-cream-dark" : "border-velora-burgundy/10 bg-white"
          }`}
        >
          <p className="font-bold text-velora-burgundy">الدفع عند الاستلام</p>
          <p className="mt-1 text-xs text-velora-burgundy/60">+20 د.إ رسوم التوصيل</p>
        </button>
      </div>

      <button
        type="button"
        className="w-full rounded-full bg-velora-burgundy py-4 text-sm font-extrabold text-velora-cream shadow-lg"
        data-payment-method={method}
        data-total={total}
        data-quantity={quantity}
      >
        {ctaLabel}
      </button>

      <p className="text-center text-xs text-velora-burgundy/60">
        الدفع بالبطاقة (بدون رسوم) أو الدفع عند الاستلام (+20 د.إ)
      </p>
      <p className="text-center text-xs text-velora-burgundy/50">
        عند الاستلام للعرض {quantity}: {formatPrice(codBundlePrices[quantity])}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {["توصيل الإمارات", "دفع آمن", "COD متاح", "دعم مخصص"].map((t) => (
          <div
            key={t}
            className="rounded-xl border border-velora-burgundy/10 bg-white px-2 py-2.5 text-center text-[10px] font-medium text-velora-burgundy/70 sm:text-xs"
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
