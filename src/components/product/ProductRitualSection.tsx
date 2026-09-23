"use client";

import { ProductPageImage } from "@/components/product/ProductPageImage";
import { productProblemOverlayById } from "@/config/productRitualSection";
import type { ProductId } from "@/config/products";

export function ProductRitualSection({
  productId,
  imageSrc,
}: {
  productId: ProductId;
  imageSrc: string;
}) {
  const data = productProblemOverlayById[productId];
  if (!data) return null;

  return (
    <section className="bg-velora-cream py-8 sm:py-12">
      <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-[0_12px_40px_rgba(58,24,32,0.08)]">
          <div className="relative w-full overflow-hidden bg-velora-cream-dark">
            <ProductPageImage src={imageSrc} alt={data.headline} className="h-auto w-full object-cover" />
          </div>
          <div className="bg-[#2c1318] px-6 py-8 text-center sm:px-10 sm:py-10">
            <p className="text-[11px] font-bold tracking-[0.28em] text-velora-champagne">{data.kicker}</p>
            <p className="mt-4 text-lg font-extrabold leading-[1.55] text-velora-cream sm:text-xl">
              {data.headline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-velora-cream/70">{data.subline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
