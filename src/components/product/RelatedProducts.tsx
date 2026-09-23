import Link from "next/link";
import { ProductPageImage } from "@/components/product/ProductPageImage";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import type { ProductWithPage } from "@/lib/productCatalog";
import { getProductPath } from "@/lib/productCatalog";

export function RelatedProducts({
  currentSlug,
  products,
}: {
  currentSlug: string;
  products: ProductWithPage[];
}) {
  const others = products.filter((p) => p.slug !== currentSlug).slice(0, 2);
  if (others.length === 0) return null;

  return (
    <section className="border-t border-velora-burgundy/10 bg-velora-cream px-4 py-12 md:px-6 md:py-14">
      <div className="mx-auto max-w-lg sm:max-w-3xl">
        <h2 className="text-right text-2xl font-extrabold text-velora-burgundy-dark">
          تكمّلي روتينك
        </h2>
        <div className="mt-6 space-y-4">
          {others.map((p) => (
            <Link
              key={p.id}
              href={getProductPath(p.slug)}
              className="group flex overflow-hidden rounded-[1.5rem] border border-velora-burgundy/10 bg-white shadow-sm transition hover:border-velora-champagne/40"
            >
              <div className="flex min-w-0 flex-1 flex-col justify-center p-4 text-right sm:p-5">
                <p className="text-base font-extrabold leading-snug text-velora-burgundy-dark group-hover:text-velora-burgundy">
                  {p.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-velora-champagne-dark">{p.ingredient}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-velora-burgundy/65">
                  {p.description}
                </p>
                <p className="mt-3 text-sm font-black text-velora-burgundy-dark">
                  يبدأ من {formatPrice(singleProductPrice)}
                </p>
              </div>
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center bg-white sm:h-36 sm:w-36">
                <ProductPageImage
                  src={p.image.src}
                  alt={p.name}
                  className="max-h-[85%] max-w-[85%] object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
