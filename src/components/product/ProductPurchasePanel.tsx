"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductForm } from "@/config/productPages";
import {
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";

const quantities: BundleQuantity[] = [1, 2, 3];

function getOfferDetails(form: ProductForm, qty: BundleQuantity) {
  const isSerum = form === "serum";

  if (qty === 1) {
    return {
      title: isSerum ? "عبوة واحدة" : "علبة واحدة",
      subtitle: isSerum ? "30 مل • شهر كامل" : "60 علكة • شهر كامل",
      badge: "✨ نتيجة من العلبة الأولى",
      badgeColor: "bg-velora-cream-dark text-velora-burgundy/80 border border-velora-burgundy/15",
      price: 199,
      savings: null,
    };
  }
  if (qty === 2) {
    return {
      title: isSerum ? "عبوتان • ثبّتي النتيجة" : "علبتان • ثبّتي النتيجة",
      subtitle: isSerum
        ? "60 مل • شهر النتيجة + شهر التثبيت"
        : "120 علكة • شهر النتيجة + شهر التثبيت",
      badge: "الأكثر اختياراً",
      badgeColor: "bg-velora-champagne text-velora-burgundy-dark font-extrabold shadow-sm",
      price: 249,
      savings: "وفّري 149 د.إ",
    };
  }
  return {
    title: isSerum ? "ثلاث عبوات • النتيجة الكاملة" : "ثلاث علب • النتيجة الكاملة",
    subtitle: isSerum
      ? "90 مل • نتيجة + تثبيت + شحن مجاني"
      : "180 علكة • نتيجة + تثبيت + هدية",
    badge: "الأكثر توفيراً",
    badgeColor: "bg-[#e8d7b8] text-velora-burgundy-dark font-extrabold",
    price: 339,
    savings: "وفّري 258 د.إ",
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
  const [method, setMethod] = useState<PaymentMethod>("cod");

  const total = getCheckoutTotal(quantity, method);
  const ctaLabel = useMemo(
    () => `ابدئي روتينك الآن • ${formatPrice(total)}`,
    [total],
  );

  useEffect(() => {
    onChange?.({ quantity, method, total, ctaLabel });
  }, [quantity, method, total, ctaLabel, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-extrabold text-velora-burgundy-dark">اختاري العرض:</p>
      </div>

      {/* Offer Cards Stack */}
      <div className="space-y-3.5">
        {quantities.map((qty) => {
          const active = quantity === qty;
          const offer = getOfferDetails(form, qty);

          return (
            <div
              key={qty}
              onClick={() => setQuantity(qty)}
              className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 select-none ${
                active
                  ? "border-velora-burgundy bg-white shadow-md ring-1 ring-velora-burgundy/15"
                  : "border-velora-burgundy/15 bg-white hover:border-velora-burgundy/35"
              }`}
            >
              {/* Badge above card */}
              {offer.badge && (
                <span
                  className={`absolute -top-3 right-4 rounded-full px-3 py-0.5 text-[11px] ${offer.badgeColor}`}
                >
                  {offer.badge}
                </span>
              )}

              <div className="flex items-center justify-between gap-3">
                {/* Radio + Info */}
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active
                        ? "border-velora-burgundy bg-velora-burgundy"
                        : "border-velora-burgundy/25 bg-white"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>

                  <div>
                    <p className="text-base font-extrabold text-velora-burgundy-dark">
                      {offer.title}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-velora-burgundy/65">
                      {offer.subtitle}
                    </p>
                  </div>
                </div>

                {/* Price + Savings */}
                <div className="text-left shrink-0">
                  <p className="text-xl font-black tabular-nums text-velora-burgundy-dark">
                    {offer.price} د.إ
                  </p>
                  {offer.savings && (
                    <p className="mt-0.5 text-xs font-extrabold text-emerald-800">
                      {offer.savings}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            const checkoutEl = document.getElementById("checkout");
            if (checkoutEl) {
              checkoutEl.scrollIntoView({ behavior: "smooth" });
            } else {
              window.location.href = `/#checkout`;
            }
          }}
          className="w-full rounded-2xl bg-[#2c1318] py-4 text-base font-black tracking-wide text-white shadow-xl transition-transform duration-150 hover:bg-velora-burgundy active:scale-[0.99] sm:text-lg"
        >
          {ctaLabel}
        </button>

        <p className="mt-2 text-center text-xs font-bold text-velora-burgundy/70">
          الدفع عند الاستلام • بدون دفع أونلاين
        </p>
      </div>

      {/* Payment Method Switcher */}
      <div className="flex items-center justify-center gap-3 pt-1 text-xs">
        <button
          type="button"
          onClick={() => setMethod("cod")}
          className={`rounded-full px-3 py-1 font-bold transition ${
            method === "cod"
              ? "bg-velora-burgundy text-velora-cream"
              : "bg-velora-cream-dark text-velora-burgundy/70"
          }`}
        >
          الدفع عند الاستلام (COD)
        </button>
        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`rounded-full px-3 py-1 font-bold transition ${
            method === "card"
              ? "bg-velora-burgundy text-velora-cream"
              : "bg-velora-cream-dark text-velora-burgundy/70"
          }`}
        >
          الدفع بالبطاقة
        </button>
      </div>

      {/* Bottom Mini Trust Bar (from screenshot 2) */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-[#2c1318] p-3.5 text-velora-cream">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-velora-champagne">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold leading-tight">توصيل 1-3 أيام</p>
            <p className="text-[10px] text-velora-cream/60">كل مدن الإمارات</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-velora-champagne">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold leading-tight">الدفع عند الاستلام</p>
            <p className="text-[10px] text-velora-cream/60">بدون دفع أونلاين</p>
          </div>
        </div>
      </div>
    </div>
  );
}
