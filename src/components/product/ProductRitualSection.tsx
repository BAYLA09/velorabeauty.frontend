"use client";

import { ProductPageImage } from "@/components/product/ProductPageImage";
import type { ProductId } from "@/config/products";

type ProblemHeroData = {
  number: string;
  headline: string;
  source: string;
};

const problemHeroByProduct: Record<ProductId, ProblemHeroData> = {
  hair: {
    number: "01",
    headline:
      "متوسط ظهور أول علامات تساقط وضعف الشعر عند نساء الخليج بسبب حرارة الجو، التكييف، ونقص التغذية الأساسية",
    source: "المصدر: أبحاث إقليمية للعناية، 2024",
  },
  skin: {
    number: "02",
    headline:
      "متوسط ظهور بهتان وشحوب البشرة عند نساء الخليج بسبب أشعة الشمس، الجفاف، وأكسدة الكولاجين اليومية",
    source: "المصدر: أبحاث جلدية إقليمية، 2024",
  },
  eye: {
    number: "03",
    headline:
      "متوسط ظهور الهالات ومظهر الإجهاد حول العينين بسبب الشاشات، جفاف التكييف، والسهر المتكرر",
    source: "المصدر: دراسات العناية اليومية، 2024",
  },
};

export function ProductRitualSection({
  productId,
  imageSrc,
}: {
  productId: ProductId;
  imageSrc: string;
}) {
  const data = problemHeroByProduct[productId];
  if (!data) return null;

  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Nama-style Problem Hero Card with Bottom Overlay Bar */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-velora-burgundy/10 bg-white shadow-xl">
          {/* Main Story Photo */}
          <div className="relative w-full overflow-hidden bg-velora-cream-dark">
            <ProductPageImage
              src={imageSrc}
              alt={data.headline}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Bottom Overlay Bar (dark burgundy with gold stat badge) */}
          <div className="bg-[#2c1318] p-5 sm:p-6 text-velora-cream">
            <div className="flex items-center justify-between gap-4">
              {/* Problem text + source */}
              <div className="min-w-0 flex-1 text-right">
                <p className="text-sm font-extrabold leading-relaxed text-white sm:text-base">
                  {data.headline}
                </p>
                <p className="mt-1 text-[11px] text-velora-champagne-light/75 sm:text-xs">
                  {data.source}
                </p>
              </div>

              {/* Number Badge (Olive/Gold block matching nama screenshot) */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-velora-champagne/90 text-center shadow-md sm:h-20 sm:w-20">
                <span className="text-2xl font-black text-[#2c1318] sm:text-3xl">
                  {data.number}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
