"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cardBundlePrices, formatPrice, singleProductPrice } from "@/config/pricing";
import { encodeCartItemsParam } from "@/lib/cart/cartSerialization";
import { getUpsellRecommendations } from "@/lib/cart/cartUpsell";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";

type Props = {
  productSlug: string;
};

/** Cross-SKU upsell on PDP — same bundle math as checkout upsell, without multi-qty on one SKU. */
export function ProductPdpCrossSell({ productSlug }: Props) {
  const router = useRouter();
  const recommendations = getUpsellRecommendations([{ slug: productSlug, quantity: 1 }]);
  if (recommendations.length === 0) return null;

  const pairTotal = cardBundlePrices[2];
  const pairSave = singleProductPrice * 2 - pairTotal;

  function goWithComplement(addSlug: string) {
    const lines = [
      { slug: productSlug, quantity: 1 },
      { slug: addSlug, quantity: 1 },
    ];
    const validated = validateCartForCheckout(lines);
    if (!validated.ok) return;
    router.push(
      buildCheckoutPaymentStepPath({
        product: productSlug,
        quantity: validated.cart.bundleQuantity,
        items: encodeCartItemsParam(lines),
      }),
    );
  }

  return (
    <section
      className="rounded-2xl border-2 border-velora-champagne/50 bg-gradient-to-br from-[#fdf2f4] to-white p-4 shadow-sm"
      aria-labelledby="pdp-cross-sell-title"
    >
      <h2 id="pdp-cross-sell-title" className="text-sm font-extrabold text-velora-burgundy-dark">
        كمّلي روتين VELORA — عرض لمرة واحدة
      </h2>
      <p className="mt-1 text-[11px] leading-relaxed font-semibold text-velora-burgundy/70">
        أضيفي منتجاً ثانياً (شعر، بشرة، أو عين) — منتجان بـ {formatPrice(pairTotal)} بدل{" "}
        {formatPrice(singleProductPrice * 2)} · وفّري {pairSave} د.إ. ثلاثة منتجات مختلفة{" "}
        {formatPrice(cardBundlePrices[3])}.
      </p>
      <ul className="mt-3 space-y-2">
        {recommendations.map((rec) => (
          <li key={rec.slug}>
            <button
              type="button"
              onClick={() => goWithComplement(rec.slug)}
              className="flex w-full items-center gap-3 rounded-xl border border-velora-burgundy/12 bg-white p-2.5 text-right transition hover:border-velora-burgundy/35 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-velora-champagne"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-velora-cream ring-1 ring-velora-burgundy/8">
                <Image
                  src={rec.imageSrc}
                  alt={rec.imageAlt}
                  fill
                  className="object-contain p-0.5"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold text-velora-champagne">{rec.routineLabel}</p>
                <p className="text-[12px] font-extrabold leading-snug text-velora-burgundy-dark">
                  {rec.name}
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-velora-burgundy/75">
                  مع طلبك — المجموع {formatPrice(pairTotal)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-velora-burgundy px-2.5 py-1.5 text-[10px] font-extrabold text-velora-cream">
                + أضيفي
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
