import Link from "next/link";
import { productSection } from "@/config/content";
import { getAllProductsWithPages, getProductPath } from "@/lib/productCatalog";
import { VeloraImage } from "./ui/VeloraImage";

export function ProductIntroSection() {
  const products = getAllProductsWithPages();
  return (
    <section className="bg-velora-cream px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-velora-burgundy md:text-3xl">
          {productSection.introTitle}
        </h2>

        <ul className="mt-10 space-y-4 md:mt-14">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={getProductPath(product.slug)}
                className="group flex items-center gap-4 rounded-3xl border border-velora-burgundy/8 bg-white p-4 shadow-sm shadow-velora-burgundy/5 transition hover:border-velora-champagne/40 md:gap-6 md:p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-velora-champagne/25 text-sm font-semibold text-velora-burgundy">
                  {product.number}
                </span>
                <VeloraImage
                  src={product.image.src}
                  alt={product.name}
                  placeholder={product.image.placeholder}
                  className="h-20 w-20 shrink-0 rounded-2xl border border-velora-burgundy/8 md:h-24 md:w-24"
                  sizes="96px"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-velora-burgundy md:text-lg">
                    {product.name}
                  </p>
                  <p className="text-sm text-velora-burgundy/60">{product.ingredient}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-velora-burgundy/15 text-velora-burgundy transition group-hover:bg-velora-burgundy group-hover:text-velora-cream">
                  ←
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
