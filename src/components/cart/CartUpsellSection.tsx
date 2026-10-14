"use client";

import { formatPrice } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { getMerchandiseAedForCart } from "@/lib/cart/cartPricing";
import {
  canAddMoreUnits,
  getUpsellOfferCopy,
  getUpsellRecommendations,
  targetTotalAfterAddingSlug,
} from "@/lib/cart/cartUpsell";
import { cartDrawerCopy as t } from "@/components/cart/cartDrawerCopy";
import { VeloraUpsellHero, VeloraUpsellProductCard } from "@/components/cart/VeloraUpsellUi";

type Props = {
  lines: CartLine[];
  onAdd: (slug: string) => void;
};

export function CartUpsellSection({ lines, onAdd }: Props) {
  if (!canAddMoreUnits(lines)) return null;

  const offer = getUpsellOfferCopy(lines);
  const recommendations = getUpsellRecommendations(lines);
  const currentTotal = getMerchandiseAedForCart(lines);

  if (recommendations.length === 0 || !offer) return null;

  return (
    <section
      className="mt-6 border-t border-[#650D20]/10 pt-5"
      aria-labelledby="cart-upsell-title"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 id="cart-upsell-title" className="text-sm font-black text-[#650D20]">
          {t.upsellSection}
        </h3>
        <span className="rounded-full bg-[#FCE8E5] px-2 py-0.5 text-[9px] font-extrabold text-[#650D20]">
          {t.upsellBadge}
        </span>
      </div>
      <p className="mb-3 text-[10px] font-semibold leading-relaxed text-[#291A1C]/60">
        {t.upsellHint}
      </p>

      <VeloraUpsellHero offer={offer} currentTotal={currentTotal} />

      <ul className="mt-3 space-y-2.5">
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

      <p className="mt-3 text-center text-[9px] font-medium text-[#291A1C]/45">
        {t.upsellFootnote(formatPrice(currentTotal ?? 0))}
      </p>
    </section>
  );
}
