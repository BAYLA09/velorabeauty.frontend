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

  const pct = Math.min(100, Math.max(0, data.statPercent));

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

          <div className="bg-lara-green px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-stretch gap-3 sm:gap-4">
              <div className="flex h-16 w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-xl bg-velora-champagne px-1 sm:h-[4.75rem] sm:w-[5rem] sm:rounded-2xl">
                <span className="text-[1.35rem] font-black tabular-nums leading-none text-lara-green-dark sm:text-[1.65rem]">
                  {data.statValue}
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

            {/* خط النسبة — يظهر دائماً تحت الصورة */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-bold text-velora-cream/75 sm:text-[11px]">
                <span>تعاني من المشكلة</span>
                <span className="tabular-nums text-velora-champagne">{data.statValue}</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-white/10 sm:h-3"
                role="img"
                aria-label={`${data.statValue} من النساء يعانين من هذه المشكلة`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-l from-velora-champagne to-velora-champagne/75 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {data.statSource ? (
                <p className="mt-2 text-[9px] leading-relaxed text-velora-cream/45 sm:text-[10px]">
                  {data.statSource}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
