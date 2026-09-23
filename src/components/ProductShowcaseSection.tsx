import { productSection } from "@/config/content";
import { getAllProductsWithPages, getProductPath } from "@/lib/productCatalog";
import { ButtonLink } from "./ui/ButtonLink";
import { VeloraImage } from "./ui/VeloraImage";

export function ProductShowcaseSection() {
  const products = getAllProductsWithPages();
  return (
    <section id="products" className="bg-velora-cream px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-velora-burgundy md:text-4xl">
          {productSection.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-base text-velora-burgundy/65">
          {productSection.introTitle}
        </p>

        <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
          {products.map((product) => (
            <article
              key={product.id}
              id={`product-${product.id}`}
              className="scroll-mt-28"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm font-semibold tracking-widest text-velora-champagne">
                  {product.number}
                </span>
                <span className="h-px flex-1 bg-velora-burgundy/10" />
              </div>

              <div className="rounded-[2rem] border border-velora-burgundy/8 bg-white p-6 shadow-lg shadow-velora-burgundy/5 md:p-10">
                <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
                  <VeloraImage
                    src={product.image.src}
                    alt={product.name}
                    placeholder={product.image.placeholder}
                    className="aspect-square rounded-[1.75rem] border border-velora-burgundy/8"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                  <div className="space-y-5 text-right">
                    <h3 className="text-2xl font-bold leading-snug text-velora-burgundy md:text-3xl">
                      {product.name}
                    </h3>
                    <p className="text-lg text-velora-champagne-dark">{product.ingredient}</p>
                    <p className="leading-relaxed text-velora-burgundy/70">{product.description}</p>
                    <p className="text-3xl font-bold text-velora-burgundy">{product.priceLabel}</p>
                    <ButtonLink href={getProductPath(product.slug)} variant="burgundy">
                      {product.cta}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
