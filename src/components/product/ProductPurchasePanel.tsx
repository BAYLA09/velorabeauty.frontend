"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductForm } from "@/config/productPages";
import {
  formatPrice,
  getCheckoutTotal,
  singleProductPrice,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";

const quantities: BundleQuantity[] = [1, 2, 3];

type OfferUi = {
  title: string;
  subtitle: string;
  footnote: string;
  badge: { text: string; variant: "popular" | "bundle" } | null;
  compareAt: number | null;
  price: number;
  savingsAmount: number | null;
};

function getOfferUi(form: ProductForm, qty: BundleQuantity): OfferUi {
  const unit = form === "serum" ? "عبوة" : "علبة";
  const compareAt = qty > 1 ? singleProductPrice * qty : null;
  const cardPrice = qty === 1 ? 199 : qty === 2 ? 249 : 339;
  const savingsAmount =
    compareAt !== null ? compareAt - cardPrice : null;

  if (qty === 1) {
    return {
      title: "منتج واحد",
      subtitle: `بداية روتينك — ${unit} واحدة`,
      footnote: `ابدئي روتينك ب${unit} واحدة`,
      badge: null,
      compareAt: null,
      price: cardPrice,
      savingsAmount: null,
    };
  }
  if (qty === 2) {
    return {
      title: "منتجان",
      subtitle: "نتيجة أفضل وقيمة أوضح",
      footnote: "لنعم جمالك أكثر",
      badge: { text: "الأكثر إختياراً", variant: "popular" },
      compareAt,
      price: cardPrice,
      savingsAmount,
    };
  }
  return {
    title: "3 منتجات",
    subtitle: "عناية شاملة — أقوى توفير",
    footnote: "عناية متكاملة لإشراقة تدوم",
    badge: { text: "روتين VELORA الكامل", variant: "bundle" },
    compareAt,
    price: cardPrice,
    savingsAmount,
  };
}

function OfferProductStack({
  src: _upsellImageSrc,
  alt: _upsellImageAlt,
  count,
}: {
  /** Wire URL here when upsell assets are ready */
  src: string;
  alt: string;
  count: number;
}) {
  void _upsellImageSrc;
  void _upsellImageAlt;

  const width = count === 1 ? "3.5rem" : count === 2 ? "4.75rem" : "5.75rem";

  return (
    <div
      className="relative h-[4.25rem] shrink-0 sm:h-[4.75rem]"
      style={{ width }}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            right: i * 16,
            zIndex: count - i,
            width: "3.25rem",
            height: "3.75rem",
          }}
        />
      ))}
    </div>
  );
}

export type PurchaseState = {
  quantity: BundleQuantity;
  method: PaymentMethod;
  total: number;
  ctaLabel: string;
};

type Props = {
  form: ProductForm;
  productImageSrc: string;
  productName: string;
  onChange?: (state: PurchaseState) => void;
};

export function ProductPurchasePanel({ form, productImageSrc, productName, onChange }: Props) {
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [method, setMethod] = useState<PaymentMethod>("card");

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
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-extrabold text-velora-burgundy-dark">اختاري العرض:</p>
      </div>

      <div className="space-y-4">
        {quantities.map((qty) => {
          const active = quantity === qty;
          const offer = getOfferUi(form, qty);

          return (
            <button
              key={qty}
              type="button"
              onClick={() => setQuantity(qty)}
              className={`relative w-full cursor-pointer rounded-2xl border-2 px-3 py-3.5 text-right transition-all duration-200 sm:px-4 sm:py-4 ${
                active
                  ? "border-velora-burgundy bg-[#fdf2f4] shadow-md"
                  : "border-velora-burgundy/12 bg-white hover:border-velora-burgundy/30"
              }`}
            >
              {offer.badge && (
                <span
                  className={`absolute -top-3 left-3 flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-extrabold shadow-sm sm:text-[11px] ${
                    offer.badge.variant === "popular"
                      ? "bg-velora-burgundy text-velora-cream"
                      : "bg-[#e8d7b8] text-velora-burgundy-dark"
                  }`}
                >
                  {offer.badge.variant === "popular" && <span aria-hidden>👑</span>}
                  {offer.badge.variant === "bundle" && <span aria-hidden>✨</span>}
                  {offer.badge.text}
                </span>
              )}

              <div className="flex items-center gap-2 sm:gap-3">
                {/* يمين: radio + صور */}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    active
                      ? "border-velora-burgundy bg-white"
                      : "border-velora-burgundy/25 bg-white"
                  }`}
                  aria-hidden
                >
                  {active && (
                    <span className="h-3 w-3 rounded-full bg-velora-burgundy" />
                  )}
                </span>

                <OfferProductStack src={productImageSrc} alt={productName} count={qty} />

                {/* وسط: عنوان */}
                <div className="min-w-0 flex-1">
                  <p className="text-base font-extrabold text-velora-burgundy-dark sm:text-lg">
                    {offer.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold leading-snug text-velora-burgundy/60 sm:text-xs">
                    {offer.subtitle}
                  </p>
                </div>

                {/* يسار: أسعار */}
                <div className="shrink-0 text-left">
                  {offer.compareAt !== null && (
                    <p className="text-xs font-bold tabular-nums text-velora-burgundy/35 line-through sm:text-sm">
                      {offer.compareAt} د.إ
                    </p>
                  )}
                  <p className="text-xl font-black tabular-nums leading-none text-velora-burgundy-dark sm:text-2xl">
                    {offer.price} د.إ
                  </p>
                  {offer.savingsAmount !== null && offer.savingsAmount > 0 && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#f5e6d3] px-2 py-0.5 text-[10px] font-extrabold text-velora-burgundy-dark sm:text-[11px]">
                      <span aria-hidden>🏷️</span>
                      وفّري {offer.savingsAmount} د.إ
                    </span>
                  )}
                  <p className="mt-1 max-w-[7rem] text-[9px] font-semibold leading-tight text-velora-burgundy/50 sm:text-[10px]">
                    {offer.footnote}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            const checkoutEl = document.getElementById("checkout");
            if (checkoutEl) {
              checkoutEl.scrollIntoView({ behavior: "smooth" });
            } else {
              window.location.href = "/#checkout";
            }
          }}
          className="w-full rounded-2xl bg-[#2c1318] py-4 text-base font-black text-white shadow-xl transition hover:bg-velora-burgundy active:scale-[0.99] sm:text-lg"
        >
          {ctaLabel}
        </button>
        <p className="mt-2 text-center text-xs font-bold text-velora-burgundy/70">
          الدفع عند الاستلام • الدفع بالبطاقة
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1 pt-2 text-[10px] sm:text-[11px]">
        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`rounded-full px-3 py-1 font-bold ${
            method === "card"
              ? "bg-velora-burgundy text-velora-cream"
              : "bg-white text-velora-burgundy/65 ring-1 ring-velora-burgundy/15"
          }`}
        >
          بطاقة
        </button>
        <button
          type="button"
          onClick={() => setMethod("cod")}
          className={`rounded-full px-3 py-1 font-bold ${
            method === "cod"
              ? "bg-velora-burgundy text-velora-cream"
              : "bg-white text-velora-burgundy/65 ring-1 ring-velora-burgundy/15"
          }`}
        >
          COD (+20 د.إ)
        </button>
      </div>

    </div>
  );
}
