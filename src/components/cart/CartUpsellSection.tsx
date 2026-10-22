"use client";

import Image from "next/image";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { canAddMoreUnits, getUpsellRecommendations } from "@/lib/cart/cartUpsell";
import { cartDrawerCopy as t } from "@/components/cart/cartDrawerCopy";

type Props = {
  lines: CartLine[];
  onAdd: (slug: string) => void;
};

export function CartUpsellSection({ lines, onAdd }: Props) {
  if (!canAddMoreUnits(lines)) return null;

  const recommendations = getUpsellRecommendations(lines);
  if (recommendations.length === 0) return null;

  const displayPrice = formatPrice(singleProductPrice);

  return (
    <section
      className="mt-6 border-t border-[#650D20]/10 pt-5"
      aria-labelledby="cart-upsell-title"
    >
      <h3 id="cart-upsell-title" className="text-base font-black text-[#650D20]">
        {t.upsellAlsoLike}
      </h3>
      <p className="mt-1 text-xs font-medium text-[#291A1C]/55">
        منتجات فيلورا الأخرى — اضغطي «أضيفي» لإضافتها للسلة.
      </p>

      <ul className="mt-4 space-y-3">
        {recommendations.map((rec) => (
          <li key={rec.slug}>
            <div
              className="flex items-center gap-3 rounded-2xl border border-[#650D20]/12 bg-white p-3 shadow-sm"
            >
              <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[#FCE8E5]">
                <Image
                  src={rec.imageSrc}
                  alt={rec.imageAlt}
                  fill
                  className="object-contain p-1"
                  sizes="72px"
                />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-sm font-bold leading-snug text-[#291A1C]">{rec.name}</p>
                <p className="mt-0.5 text-lg font-black tabular-nums text-[#650D20]">
                  {t.upsellPriceFrom(displayPrice)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAdd(rec.slug)}
                className="shrink-0 rounded-full bg-[#650D20] px-4 py-2.5 text-sm font-black text-[#FFF9F5] shadow-md transition hover:bg-[#291A1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65]"
              >
                {t.add}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
