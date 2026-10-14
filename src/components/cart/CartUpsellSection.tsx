"use client";

import Image from "next/image";
import { formatPrice } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import {
  canAddMoreUnits,
  getNextTierSavings,
  getUpsellOfferCopy,
  getUpsellRecommendations,
  type UpsellProduct,
} from "@/lib/cart/cartUpsell";
import { cartDrawerCopy as t } from "@/components/cart/cartDrawerCopy";

function UpsellProductRow({
  rec,
  onAdd,
  targetTotal,
}: {
  rec: UpsellProduct;
  onAdd: () => void;
  targetTotal: number | null;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center gap-3 rounded-2xl border border-[#650D20]/10 bg-[#FFF9F5]/80 p-3 text-right transition hover:border-[#650D20]/30 hover:bg-white hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65]"
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-[#650D20]/8">
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
          <p className="text-[13px] font-extrabold leading-snug text-[#291A1C]">{rec.name}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[#291A1C]/55">
            {rec.tagline}
          </p>
          {targetTotal ? (
            <p className="mt-1 text-[10px] font-semibold text-[#650D20]">
              {t.afterAddTotal(formatPrice(targetTotal))}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-[11px] font-extrabold text-[#650D20]">{t.addPlus}</span>
      </button>
    </li>
  );
}

type Props = {
  lines: CartLine[];
  eligibleUnits: number;
  onAdd: (slug: string) => void;
};

export function CartUpsellSection({
  lines,
  eligibleUnits,
  onAdd,
}: Props) {
  if (!canAddMoreUnits(lines)) return null;

  const offer = getUpsellOfferCopy(lines, eligibleUnits);
  const recommendations = getUpsellRecommendations(lines);
  const savings = getNextTierSavings(eligibleUnits);

  if (recommendations.length === 0) return null;

  return (
    <section className="mt-6 border-t border-[#650D20]/10 pt-6" aria-labelledby="cart-upsell-title">
      <h3 id="cart-upsell-title" className="text-xs font-extrabold text-[#291A1C]">
        {t.upsellSection}
      </h3>
      <p className="mt-1 text-[10px] leading-relaxed text-[#291A1C]/55">{t.upsellHint}</p>

      {offer ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-[#D6AD65]/35 bg-gradient-to-br from-[#FCE8E5] to-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-[#650D20]">{offer.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#291A1C]/75">{offer.body}</p>
            </div>
            {savings !== null && savings > 0 ? (
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 ring-1 ring-emerald-200/80">
                {t.saveAmount(savings)}
              </span>
            ) : null}
          </div>
          {offer.delta !== null ? (
            <p className="mt-2 text-[11px] font-bold text-[#650D20]/85">
              {t.addForDelta(formatPrice(offer.delta))}
            </p>
          ) : null}
        </div>
      ) : null}

      <ul className="mt-3 space-y-2">
        {recommendations.map((rec) => (
          <UpsellProductRow
            key={rec.slug}
            rec={rec}
            targetTotal={
              eligibleUnits > 0 && offer?.targetTotal ? offer.targetTotal : null
            }
            onAdd={() => onAdd(rec.slug)}
          />
        ))}
      </ul>
    </section>
  );
}
