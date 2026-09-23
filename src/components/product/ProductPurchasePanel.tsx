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
  const compareAt = qty > 1 ? singleProductPrice * qty : null;
  const cardPrice = qty === 1 ? 199 : qty === 2 ? 249 : 339;
  const savingsAmount = compareAt !== null ? compareAt - cardPrice : null;

  if (qty === 1) {
    return {
      title: "منتج واحد",
      subtitle:
        form === "serum"
          ? "بداية روتينك — عبوة واحدة"
          : "بداية روتينك — منتج واحد",
      footnote:
        form === "serum"
          ? "ابدئي روتينك بعبوة واحدة"
          : "ابدئي روتينك بمنتج واحد",
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
      footnote: "لناعم جمالك أكثر",
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
  /** Reserved — wire upsell card image URL here when assets are ready */
  src: string;
  alt: string;
  count: number;
}) {
  void _upsellImageSrc;
  void _upsellImageAlt;

  if (count === 1) {
    return (
      <div
        className="relative flex h-[6.25rem] w-[5rem] shrink-0 items-end justify-center sm:h-[6.75rem] sm:w-[5.5rem]"
        aria-hidden
      />
    );
  }

  const width = count === 2 ? "6.75rem" : "7.75rem";
  const bottleW = count === 2 ? "3.85rem" : "3.55rem";
  const bottleH = count === 2 ? "5.35rem" : "5rem";

  return (
    <div
      className="relative shrink-0"
      style={{ width, height: "6.5rem" }}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => {
        const offset =
          count === 2
            ? i * 26
            : i === 0
              ? 0
              : i === 1
                ? 24
                : 48;
        const bottom = count === 3 && i === 2 ? 0 : count === 3 && i === 1 ? 6 : 0;

        return (
          <div
            key={i}
            className="absolute bottom-0 flex items-end justify-center"
            style={{
              right: offset,
              zIndex: count - i,
              width: bottleW,
              height: bottleH,
              bottom,
            }}
          />
        );
      })}
    </div>
  );
}

function UpsellTrustStrip() {
  const items = [
    {
      label: "توصيل سريع في جميع أنحاء الإمارات",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      ),
    },
    {
      label: "دفع آمن ومضمون",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      ),
    },
    {
      label: "إرجاع سهل خلال 14 يوم",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      ),
    },
    {
      label: "دعم عملاء مميز دائماً معك",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-velora-burgundy/10 bg-white/85 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-velora-burgundy/10">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 border-b border-velora-burgundy/8 px-3 py-3 last:border-b-0 sm:border-b-0 sm:px-3 sm:py-3.5 odd:border-s sm:odd:border-s-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4b896]/55 bg-[#faf6ef] text-[#9a7348]">
              <svg
                className="h-[1.15rem] w-[1.15rem]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                {item.icon}
              </svg>
            </div>
            <p className="min-w-0 text-[9px] font-bold leading-snug text-velora-burgundy/72 sm:text-[10px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
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

export function ProductPurchasePanel({
  form,
  productImageSrc,
  productName,
  onChange,
}: Props) {
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
      <p className="text-lg font-extrabold text-velora-burgundy-dark">اختاري العرض:</p>

      <div className="space-y-3.5 rounded-[1.75rem] bg-gradient-to-b from-[#faf3f4] via-[#f8eef0] to-[#f5ebe8] p-3.5 sm:space-y-4 sm:p-4">
      <div className="space-y-3.5 sm:space-y-4">
        {quantities.map((qty) => {
          const active = quantity === qty;
          const offer = getOfferUi(form, qty);

          return (
            <button
              key={qty}
              type="button"
              onClick={() => setQuantity(qty)}
              className={`relative w-full min-h-[6.75rem] cursor-pointer rounded-[1.35rem] px-3 py-4 text-right transition-all duration-200 sm:min-h-[7.25rem] sm:px-5 sm:py-5 ${
                offer.badge ? "mt-3" : ""
              } ${
                active
                  ? "border-[3px] border-velora-burgundy bg-[#fdf2f4] shadow-[0_8px_24px_rgba(58,24,32,0.08)]"
                  : "border-2 border-[#e8dfe1] bg-white hover:border-velora-burgundy/25"
              }`}
            >
              {offer.badge && (
                <span
                  className={`absolute -top-3.5 left-4 flex items-center gap-1 rounded-lg px-3 py-1 text-[10px] font-extrabold shadow-md sm:text-[11px] ${
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

              <div
                className="grid items-center gap-x-2 gap-y-2 sm:gap-x-3"
                style={{
                  gridTemplateColumns:
                    "auto auto minmax(0, 1fr) minmax(6.25rem, 7.25rem)",
                }}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    active
                      ? "border-velora-burgundy bg-white"
                      : "border-velora-burgundy/25 bg-white"
                  }`}
                  aria-hidden
                >
                  {active && (
                    <span className="h-3.5 w-3.5 rounded-full bg-velora-burgundy" />
                  )}
                </span>

                <OfferProductStack
                  src={productImageSrc}
                  alt={productName}
                  count={qty}
                />

                <div className="min-w-0 px-0.5 text-center sm:px-1">
                  <p className="text-base font-extrabold text-velora-burgundy-dark sm:text-[1.05rem]">
                    {offer.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold leading-snug text-velora-burgundy/55 sm:text-xs">
                    {offer.subtitle}
                  </p>
                </div>

                <div className="min-w-0 text-left">
                  {offer.compareAt !== null && (
                    <p className="text-xs font-bold tabular-nums text-velora-burgundy/35 line-through sm:text-sm">
                      {offer.compareAt} د.إ
                    </p>
                  )}
                  <p className="text-[1.35rem] font-black tabular-nums leading-none text-velora-burgundy-dark sm:text-[1.65rem]">
                    {offer.price} د.إ
                  </p>
                  {offer.savingsAmount !== null && offer.savingsAmount > 0 && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#f5e6d3] px-2.5 py-0.5 text-[10px] font-extrabold text-velora-burgundy-dark sm:text-[11px]">
                      <span aria-hidden>🏷️</span>
                      وفّري {offer.savingsAmount} د.إ
                    </span>
                  )}
                  <p className="mt-1.5 text-[9px] font-semibold leading-tight text-velora-burgundy/50 sm:text-[10px]">
                    {offer.footnote}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <UpsellTrustStrip />
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

      <div className="flex flex-wrap items-center justify-center gap-1 pt-1 text-[10px] sm:text-[11px]">
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
