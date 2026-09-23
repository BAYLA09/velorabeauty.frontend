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
          منتجات أخرى من فيلورا
        </h2>
        <div className="mt-6 space-y-4">
          {others.map((p) => (
            <Link
              key={p.id}
              href={getProductPath(p.slug)}
              className="group flex overflow-hidden rounded-[1.5rem] border border-velora-burgundy/10 bg-white shadow-sm transition hover:border-velora-champagne/40"
            >
              <div className="flex min-w-0 flex-1 flex-col justify-center p-4 text-right sm:p-5">
                <p className="text-sm font-extrabold leading-snug text-velora-burgundy-dark group-hover:text-velora-burgundy">
                  {p.page.subhook.slice(0, 72)}
                  {p.page.subhook.length > 72 ? "…" : ""}
                </p>
                <p className="mt-2 text-xs text-velora-burgundy/60">{p.ingredient}</p>
                <p className="mt-3 text-sm font-black text-velora-champagne-dark">
                  يبدأ من {formatPrice(singleProductPrice)}
                </p>
              </div>
              <div className="relative h-28 w-28 shrink-0 bg-velora-cream-dark sm:h-32 sm:w-32">
                <ProductPageImage
                  src={p.pageImage.src}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-contain p-2"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
