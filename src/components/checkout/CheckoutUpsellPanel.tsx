"use client";

import Image from "next/image";
import { CartBundleProgress } from "@/components/cart/CartBundleProgress";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import {
  canAddMoreUnits,
  getBundleSavingsVsRetail,
  getUpsellOfferCopy,
  targetTotalAfterAddingSlug,
  getUpsellRecommendations,
} from "@/lib/cart/cartUpsell";
import type { PaymentMethod } from "@/config/pricing";

type Props = {
  lines: CartLine[];
  eligibleUnits: number;
  merchandiseAed: number;
  paymentMethod: PaymentMethod;
  onAdd: (slug: string) => void;
};

export function CheckoutUpsellPanel({
  lines,
  eligibleUnits,
  merchandiseAed,
  paymentMethod,
  onAdd,
}: Props) {
  const savedSoFar = getBundleSavingsVsRetail(eligibleUnits, merchandiseAed);
  const offer = getUpsellOfferCopy(lines);
  const recommendations = getUpsellRecommendations(lines);

  if (eligibleUnits >= 4) {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
        <p className="text-center text-[11px] font-bold uppercase tracking-wide text-emerald-800/80">
          روتينك + منتج إضافي — أقصى قيمة
        </p>
        <p className="mt-1 text-center text-2xl font-black tabular-nums text-emerald-800">
          وفّرتِ {savedSoFar} د.إ
        </p>
        <p className="mt-1 text-center text-xs leading-relaxed text-emerald-900/75">
          بدل {formatPrice(singleProductPrice * eligibleUnits)} بالتجزئة — دفعتي{" "}
          {formatPrice(merchandiseAed)}.
        </p>
      </div>
    );
  }

  if (!canAddMoreUnits(lines) || recommendations.length === 0 || !offer) {
    return null;
  }

  const retailNext = singleProductPrice * (eligibleUnits + 1);
  const payMethodHint =
    paymentMethod === "card" ? "الدفع بالبطاقة" : "الدفع عند الاستلام";

  return (
    <section
      className="mt-4 overflow-hidden rounded-2xl border-2 border-[#D6AD65]/45 bg-gradient-to-br from-[#FCE8E5] via-[#FFF9F5] to-white shadow-sm"
      aria-labelledby="checkout-upsell-title"
    >
      <div className="border-b border-[#650D20]/8 px-4 py-3">
        <CartBundleProgress eligibleUnits={eligibleUnits} />
      </div>

      <div className="px-4 py-3.5">
        <h3 id="checkout-upsell-title" className="text-sm font-extrabold text-[#650D20]">
          {offer.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[#291A1C]/75">{offer.body}</p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {offer.targetTotal ? (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#650D20] ring-1 ring-[#650D20]/15">
              المجموع {formatPrice(offer.targetTotal)}
            </span>
          ) : null}
          {offer.delta !== null ? (
            <span className="text-[11px] font-semibold text-[#650D20]/80">
              +{formatPrice(offer.delta)} للخطوة التالية
            </span>
          ) : null}
        </div>

        {eligibleUnits > 0 && savedSoFar > 0 ? (
          <p className="mt-2 text-center text-[11px] font-bold text-emerald-800">
            وفّرتِ بالفعل {savedSoFar} د.إ — كمّلي للتوفير الأقصى!
          </p>
        ) : null}

        <p className="mt-2 text-center text-[10px] text-[#291A1C]/50">
          تبقين على {payMethodHint} — بلا إعادة اختيار · بدل {formatPrice(retailNext)} بالتجزئة
        </p>
      </div>

      <ul className="space-y-2 border-t border-[#650D20]/8 bg-white/60 px-3 py-3">
        {recommendations.map((rec) => (
          <li key={rec.slug}>
            <button
              type="button"
              onClick={() => onAdd(rec.slug)}
              className="flex w-full items-center gap-3 rounded-xl border border-[#650D20]/10 bg-white p-2.5 text-right shadow-sm transition hover:border-[#650D20]/35 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6AD65]"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#FFF9F5] ring-1 ring-[#650D20]/8">
                <Image
                  src={rec.imageSrc}
                  alt={rec.imageAlt}
                  fill
                  className="object-contain p-0.5"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold text-[#D6AD65]">{rec.routineLabel}</p>
                <p className="text-[12px] font-extrabold leading-snug text-[#291A1C]">{rec.name}</p>
                {targetTotalAfterAddingSlug(lines, rec.slug) ? (
                  <p className="mt-0.5 text-[10px] font-bold text-[#650D20]">
                    المجموع بعد الإضافة:{" "}
                    {formatPrice(targetTotalAfterAddingSlug(lines, rec.slug)!)}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 rounded-full bg-[#650D20] px-2.5 py-1.5 text-[10px] font-extrabold text-white">
                + أضيفي
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
