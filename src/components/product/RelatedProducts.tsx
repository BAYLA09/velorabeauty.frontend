import Link from "next/link";
import { ProductPageImage } from "@/components/product/ProductPageImage";
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
    <section className="border-t border-velora-burgundy/10 bg-velora-cream-dark px-4 py-16 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-velora-burgundy">اكتشفي أيضاً</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {others.map((p) => (
            <Link
              key={p.id}
              href={getProductPath(p.slug)}
              className="group flex gap-4 rounded-3xl border border-velora-burgundy/8 bg-white p-4 shadow-sm transition hover:border-velora-champagne/50"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-velora-burgundy/10 bg-white p-1">
                <ProductPageImage
                  src={p.image.src}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 text-right">
                <p className="font-semibold text-velora-burgundy group-hover:text-velora-burgundy-light">
                  {p.name}
                </p>
                <p className="text-sm text-velora-burgundy/60">{p.ingredient}</p>
                <p className="mt-2 font-bold text-velora-burgundy">{p.priceLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
