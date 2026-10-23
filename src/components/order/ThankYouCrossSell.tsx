"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import { getUpsellRecommendations } from "@/lib/cart/cartUpsell";
import { getProductPath } from "@/lib/productCatalog";

type Props = {
  purchasedSlug: string;
};

/** Post-COD thank-you — other Velora products (not cart drawer / PDP offers). */
export function ThankYouCrossSell({ purchasedSlug }: Props) {
  const lines = [{ slug: purchasedSlug, quantity: 1 }];
  const recommendations = getUpsellRecommendations(lines);
  if (recommendations.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-velora-burgundy/10 bg-white p-4 shadow-sm"
      aria-labelledby="thank-you-cross-sell"
    >
      <h2 id="thank-you-cross-sell" className="text-base font-black text-velora-burgundy-dark">
        قد يعجبك أيضاً
      </h2>
      <ul className="mt-3 space-y-3">
        {recommendations.map((rec) => (
          <li key={rec.slug}>
            <Link
              href={getProductPath(rec.slug)}
              className="flex items-center gap-3 rounded-xl border border-velora-burgundy/10 p-2.5 transition hover:border-velora-burgundy/25"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-velora-cream">
                <Image
                  src={rec.imageSrc}
                  alt={rec.imageAlt}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-sm font-bold text-velora-burgundy-dark">{rec.name}</p>
                <p className="text-sm font-black tabular-nums text-velora-burgundy">
                  من {formatPrice(singleProductPrice)}
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-velora-burgundy">تسوقي</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
