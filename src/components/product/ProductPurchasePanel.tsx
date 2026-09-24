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
  badge: { text: string; variant: "popular" | "bundle" } | null;
  compareAt: number | null;
  price: number;
  savingsAmount: number | null;
  perUnit: number | null;
};

function getOfferUi(form: ProductForm, qty: BundleQuantity, funnelOffers: boolean): OfferUi {
  const unit = form === "serum" ? "عبوة" : "علبة";
  const compareAt = qty > 1 ? singleProductPrice * qty : null;
  const cardPrice = qty === 1 ? 199 : qty === 2 ? 249 : 339;
  const savingsAmount = compareAt !== null ? compareAt - cardPrice : null;
  const perUnit = qty > 1 ? Math.round(cardPrice / qty) : null;

  if (funnelOffers) {
    if (qty === 1) {
      return {
        title: form === "serum" ? "عبوة واحدة" : "علبة وحدة",
        subtitle: form === "serum" ? "روتين شهر — استخدام يومي" : "شهر كامل — 60 علكة",
        badge: null,
        compareAt: null,
        price: cardPrice,
        savingsAmount: null,
        perUnit: null,
      };
    }
    if (qty === 2) {
      return {
        title: form === "serum" ? "عبواتين" : "علبتين",
        subtitle: form === "serum" ? "شهرين — ثبّتي النتيجة" : "شهرين — ثبّتي النتيجة",
        badge: { text: "الأكثر اختياراً", variant: "popular" },
        compareAt,
        price: cardPrice,
        savingsAmount,
        perUnit,
      };
    }
    return {
      title: form === "serum" ? "3 عبوات" : "3 علب",
      subtitle: form === "serum" ? "3 عبوات — أقوى توفير" : "3 علب — أقوى توفير",
      badge: { text: "الأكثر توفيراً", variant: "bundle" },
      compareAt,
      price: cardPrice,
      savingsAmount,
      perUnit,
    };
  }

  if (qty === 1) {
    return {
      title: "منتج واحد",
      subtitle: `بداية روتينك — ${unit} واحدة`,
      badge: null,
      compareAt: null,
      price: cardPrice,
      savingsAmount: null,
      perUnit: null,
    };
  }
  if (qty === 2) {
    return {
      title: "منتجان",
      subtitle: "نتيجة أفضل وقيمة أوضح",
      badge: { text: "الأكثر إختياراً", variant: "popular" },
      compareAt,
      price: cardPrice,
      savingsAmount,
      perUnit,
    };
  }
  return {
    title: "3 منتجات",
    subtitle: "عناية شاملة — أقوى توفير",
    badge: { text: "روتين VELORA الكامل", variant: "bundle" },
    compareAt,
    price: cardPrice,
    savingsAmount,
    perUnit,
  };
}

function OfferProductStack({
  src,
  alt,
  count,
}: {
  src?: string;
  alt: string;
  count: number;
}) {
  const showImage = Boolean(src);

  if (showImage && src && (count === 1 || count === 2 || count === 3)) {
    const slotClass =
      count === 1
        ? "relative h-[3.35rem] w-[2.65rem] shrink-0 sm:h-[3.65rem] sm:w-[2.85rem]"
        : count === 2
          ? "relative h-[3.35rem] w-[3.85rem] shrink-0 sm:h-[3.65rem] sm:w-[4.15rem]"
          : "relative h-[3.35rem] w-[4.65rem] shrink-0 sm:h-[3.65rem] sm:w-[5rem]";

    return (
      <div className={slotClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute bottom-0 left-1/2 h-[3.1rem] w-auto max-w-full -translate-x-1/2 object-contain object-bottom sm:h-[3.4rem]"
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-[3.35rem] shrink-0 sm:h-[3.65rem]"
      style={{ width: count === 1 ? "2.65rem" : count === 2 ? "3.85rem" : "4.65rem" }}
      aria-hidden={!showImage}
    />
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
  productName: string;
  upsellSlotSrc?: Partial<Record<BundleQuantity, string>>;
  quantity?: BundleQuantity;
  method?: PaymentMethod;
  onQuantityChange?: (q: BundleQuantity) => void;
  onMethodChange?: (m: PaymentMethod) => void;
  onChange?: (state: PurchaseState) => void;
  /** Lara-style bundle labels + payment block (Velora colors only) */
  funnelOffers?: boolean;
};

export function ProductPurchasePanel({
  form,
  productName,
  upsellSlotSrc,
  quantity: quantityProp,
  method: methodProp,
  onQuantityChange,
  onMethodChange,
  onChange,
  funnelOffers = false,
}: Props) {
  const [quantityInternal, setQuantityInternal] = useState<BundleQuantity>(2);
  const [methodInternal, setMethodInternal] = useState<PaymentMethod>("card");
  const quantity = quantityProp ?? quantityInternal;
  const method = methodProp ?? methodInternal;

  const setQuantity = (q: BundleQuantity) => {
    onQuantityChange?.(q);
    if (quantityProp === undefined) setQuantityInternal(q);
  };
  const setMethod = (m: PaymentMethod) => {
    onMethodChange?.(m);
    if (methodProp === undefined) setMethodInternal(m);
  };

  const total = getCheckoutTotal(quantity, method);
  const unitWord = form === "serum" ? "عبوة" : "علبة";
  const ctaLabel = useMemo(
    () =>
      funnelOffers
        ? `اطلبي الآن • ${formatPrice(total)}`
        : `ابدئي روتينك الآن • ${formatPrice(total)}`,
    [total, funnelOffers],
  );

  useEffect(() => {
    onChange?.({ quantity, method, total, ctaLabel });
  }, [quantity, method, total, ctaLabel, onChange]);

  return (
    <div className="space-y-4">
      <p className="text-lg font-extrabold text-velora-burgundy-dark">اختاري العرض:</p>

      <div className="space-y-3">
        {quantities.map((qty) => {
          const active = quantity === qty;
          const offer = getOfferUi(form, qty, funnelOffers);

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
                  {offer.badge.text}
                </span>
              )}

              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white ${
                    active ? "border-velora-burgundy" : "border-velora-burgundy/25"
                  }`}
                  aria-hidden
                >
                  {active && <span className="h-3 w-3 rounded-full bg-velora-burgundy" />}
                </span>

                <OfferProductStack src={upsellSlotSrc?.[qty]} alt={productName} count={qty} />

                <div className="min-w-0 flex-1 px-0.5">
                  <p className="text-[13px] font-extrabold leading-tight text-velora-burgundy-dark sm:text-sm">
                    {offer.title}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold leading-snug text-velora-burgundy/60 sm:text-[11px]">
                    {offer.subtitle}
                  </p>
                </div>

                <div className="shrink-0 text-left">
                  {offer.compareAt !== null && (
                    <p className="text-xs font-bold tabular-nums text-velora-burgundy/35 line-through sm:text-sm">
                      {offer.compareAt} د.إ
                    </p>
                  )}
                  <p className="text-xl font-black tabular-nums leading-none text-velora-burgundy-dark sm:text-2xl">
                    {offer.price} د.إ
                  </p>
                  {offer.perUnit !== null && (
                    <p className="mt-1 text-[10px] font-bold tabular-nums text-velora-burgundy/55">
                      {offer.perUnit} د.إ / {unitWord}
                    </p>
                  )}
                  {offer.savingsAmount !== null && offer.savingsAmount > 0 && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#f5e6d3] px-2 py-0.5 text-[10px] font-extrabold text-velora-burgundy-dark sm:text-[11px]">
                      وفّري {offer.savingsAmount} د.إ
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {funnelOffers && (
        <div className="space-y-2 pt-1">
          <p className="text-sm font-extrabold text-velora-burgundy-dark">طرق الدفع المتاحة</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod("card")}
              className={`rounded-2xl border-2 px-3 py-3 text-right transition ${
                method === "card"
                  ? "border-velora-burgundy bg-[#fdf2f4]"
                  : "border-velora-burgundy/15 bg-white"
              }`}
            >
              <p className="text-sm font-extrabold text-velora-burgundy-dark">الدفع بالبطاقة</p>
              <p className="mt-0.5 text-[11px] font-bold text-velora-burgundy">شحن مجاني</p>
            </button>
            <button
              type="button"
              onClick={() => setMethod("cod")}
              className={`rounded-2xl border-2 px-3 py-3 text-right transition ${
                method === "cod"
                  ? "border-velora-burgundy bg-[#fdf2f4]"
                  : "border-velora-burgundy/15 bg-white"
              }`}
            >
              <p className="text-sm font-extrabold text-velora-burgundy-dark">الدفع عند الاستلام</p>
              <p className="mt-0.5 text-[11px] font-bold text-velora-burgundy/70">+20 د.إ رسوم التوصيل</p>
            </button>
          </div>
          <p className="text-center text-[11px] font-semibold text-velora-burgundy/70">
            الدفع بالبطاقة (شحن مجاني) أو الدفع عند الاستلام
          </p>
        </div>
      )}

      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            document.getElementById("purchase")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full rounded-2xl bg-[#2c1318] py-4 text-base font-black text-white shadow-xl transition hover:bg-velora-burgundy active:scale-[0.99] sm:text-lg"
        >
          {ctaLabel}
        </button>
        {!funnelOffers && (
          <p className="mt-2 text-center text-xs font-bold text-velora-burgundy/70">
            الدفع عند الاستلام • الدفع بالبطاقة
          </p>
        )}
      </div>

      {!funnelOffers && (
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
      )}
    </div>
  );
}
