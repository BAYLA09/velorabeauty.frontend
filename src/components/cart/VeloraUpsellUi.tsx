"use client";

import Image from "next/image";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import type { UpsellProduct } from "@/lib/cart/cartUpsell";
import { upsellDeltaAddingProduct } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";

export type UpsellOfferDisplay = {
  title: string;
  body: string;
  targetTotal: number | null;
  delta: number | null;
};

type HeroProps = {
  offer: UpsellOfferDisplay;
  currentTotal: number | null;
};

export function VeloraUpsellHero({ offer, currentTotal }: HeroProps) {
  const deltaLabel =
    offer.delta !== null ? formatPrice(offer.delta) : formatPrice(singleProductPrice);

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[#D6AD65]/60 bg-gradient-to-br from-[#650D20] via-[#7a1528] to-[#291A1C] p-4 text-white shadow-[0_12px_32px_rgba(101,13,32,0.35)]">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#D6AD65]/25 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-right">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#FCE8E5] ring-1 ring-white/20">
            <span className="motion-safe:animate-pulse" aria-hidden>
              ●
            </span>
            عرض السلة — لحظي
          </span>
          <p className="mt-2 text-base font-black leading-snug text-white">{offer.title}</p>
          <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-white/85">
            {offer.body}
          </p>
        </div>
        <div className="shrink-0 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#D6AD65]">
            أضيفي بـ
          </p>
          <p className="text-2xl font-black tabular-nums leading-none text-[#FCE8E5]">
            {deltaLabel}
          </p>
          {offer.targetTotal !== null ? (
            <p className="mt-1 rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-white">
              المجموع {formatPrice(offer.targetTotal)}
            </p>
          ) : null}
        </div>
      </div>
      {currentTotal !== null && offer.targetTotal !== null ? (
        <p className="relative mt-3 text-center text-[10px] font-bold text-[#D6AD65]">
          {formatPrice(currentTotal)} ← {formatPrice(offer.targetTotal)} · ضغطة واحدة
        </p>
      ) : null}
    </div>
  );
}

type ProductCardProps = {
  rec: UpsellProduct;
  lines: CartLine[];
  targetTotal: number | null;
  onAdd: () => void;
  featured?: boolean;
};

export function VeloraUpsellProductCard({
  rec,
  lines,
  targetTotal,
  onAdd,
  featured = false,
}: ProductCardProps) {
  const addDelta = upsellDeltaAddingProduct(lines, rec.slug);
  const deltaText =
    addDelta !== null ? formatPrice(addDelta) : formatPrice(singleProductPrice);

  return (
    <li>
      <button
        type="button"
        onClick={onAdd}
        className={`group flex w-full items-stretch gap-3 overflow-hidden rounded-2xl border-2 p-3 text-right transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65] ${
          featured
            ? "border-[#650D20] bg-gradient-to-l from-[#FCE8E5] to-white shadow-md ring-2 ring-[#D6AD65]/40"
            : "border-[#650D20]/15 bg-white hover:border-[#650D20]/40 hover:shadow-lg"
        }`}
      >
        <div className="relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl bg-[#FFF9F5] ring-2 ring-[#650D20]/10">
          <Image
            src={rec.imageSrc}
            alt={rec.imageAlt}
            fill
            className="object-contain p-1 transition duration-200 group-hover:scale-105"
            sizes="68px"
          />
          <span className="absolute -left-0.5 -top-0.5 rounded-br-lg rounded-tl-lg bg-[#650D20] px-1.5 py-0.5 text-[9px] font-black text-white">
            {deltaText}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {featured ? (
            <span className="mb-0.5 inline-flex self-end rounded-full bg-[#650D20] px-2 py-0.5 text-[9px] font-extrabold text-[#FCE8E5]">
              ⭐ الأكثر اختياراً
            </span>
          ) : null}
          <p className="text-[10px] font-extrabold text-[#D6AD65]">{rec.routineLabel}</p>
          <p className="text-[14px] font-black leading-snug text-[#291A1C]">{rec.name}</p>
          <p className="mt-0.5 line-clamp-1 text-[10px] font-medium text-[#291A1C]/55">
            {rec.tagline}
          </p>
          {targetTotal !== null ? (
            <p className="mt-1 text-[11px] font-extrabold tabular-nums text-[#650D20]">
              المجموع بعد الإضافة: {formatPrice(targetTotal)}
            </p>
          ) : null}
        </div>
        <span className="flex shrink-0 flex-col items-center justify-center self-center">
          <span className="rounded-full bg-gradient-to-b from-[#650D20] to-[#291A1C] px-3 py-2 text-[11px] font-black text-white shadow-md transition group-hover:scale-105 group-active:scale-95">
            + أضيفي
          </span>
        </span>
      </button>
    </li>
  );
}
