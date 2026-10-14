"use client";

import { formatPrice, singleProductPrice } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { getMerchandiseAedForCart } from "@/lib/cart/cartPricing";
import {
  canAddMoreUnits,
  getBundleSavingsVsRetail,
  getUpsellOfferCopy,
  getUpsellRecommendations,
  targetTotalAfterAddingSlug,
} from "@/lib/cart/cartUpsell";
import type { PaymentMethod } from "@/config/pricing";
import { VeloraUpsellHero, VeloraUpsellProductCard } from "@/components/cart/VeloraUpsellUi";

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
  const currentTotal = getMerchandiseAedForCart(lines);

  if (eligibleUnits >= 4) {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/80 p-5 shadow-md">
        <p className="text-center text-xs font-extrabold uppercase tracking-wide text-emerald-800">
          روتينك مكتمل — أقصى قيمة
        </p>
        <p className="mt-2 text-center text-3xl font-black tabular-nums text-emerald-800">
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

  const payMethodHint =
    paymentMethod === "card" ? "الدفع بالبطاقة" : "الدفع عند الاستلام";

  return (
    <section className="mt-4" aria-labelledby="checkout-upsell-title">
      <p
        id="checkout-upsell-title"
        className="mb-2 text-center text-[11px] font-bold text-neutral-500"
      >
        قبل {payMethodHint} — ثوانٍ وتكمّلي
      </p>

      <VeloraUpsellHero offer={offer} currentTotal={currentTotal} />

      {eligibleUnits > 0 && savedSoFar > 0 ? (
        <p className="mt-2 text-center text-[11px] font-extrabold text-emerald-700">
          وفّرتِ {savedSoFar} د.إ بالفعل — كمّلي روتينك
        </p>
      ) : null}

      <ul className="mt-3 space-y-2">
        {recommendations.map((rec, index) => (
          <VeloraUpsellProductCard
            key={rec.slug}
            rec={rec}
            lines={lines}
            targetTotal={targetTotalAfterAddingSlug(lines, rec.slug)}
            featured={index === 0}
            onAdd={() => onAdd(rec.slug)}
          />
        ))}
      </ul>
    </section>
  );
}
