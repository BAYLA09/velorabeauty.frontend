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
    <section className="bg-velora-cream py-6 sm:py-10">
      <div className="mx-auto max-w-lg px-4 sm:max-w-4xl sm:px-6 lg:max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-[0_12px_40px_rgba(58,24,32,0.1)] sm:rounded-[2.5rem]">
          <div className="relative w-full overflow-hidden bg-velora-cream-dark">
            <ProductPageImage
              src={imageSrc}
              alt={data.headline}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Nama-style bottom bar: badge على اليمين، النص على اليسار (RTL) */}
          <div className="bg-[#2c1318] px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-stretch gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-velora-champagne sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-2xl">
                <span className="text-2xl font-black tabular-nums text-[#2c1318] sm:text-3xl">
                  {data.badge}
                </span>
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-[13px] font-extrabold leading-[1.55] text-white sm:text-[15px]">
                  {data.headline}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-velora-cream/70 sm:text-xs">
                  {data.subline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
