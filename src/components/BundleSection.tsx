import { bundle } from "@/config/products";
import { ButtonLink } from "./ui/ButtonLink";
import { VeloraImage } from "./ui/VeloraImage";

export function BundleSection() {
  return (
    <section id="bundle" className="bg-velora-burgundy px-4 py-16 text-velora-cream md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">{bundle.title}</h2>
        <p className="mt-3 text-lg text-velora-cream/80">{bundle.subtitle}</p>
        <p className="mt-2 text-sm text-velora-champagne">{bundle.savingsLine}</p>

        <div className="mx-auto mt-10 max-w-2xl">
          <VeloraImage
            src={bundle.image.src}
            alt={bundle.image.placeholder}
            placeholder={bundle.image.placeholder}
            className="aspect-[16/10] rounded-[2rem] border border-white/10 shadow-2xl shadow-black/20"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>

        <p className="mt-8 text-4xl font-bold text-velora-champagne">{bundle.priceLabel}</p>
        <div className="mt-8">
          <ButtonLink href="#checkout" variant="gold">
            {bundle.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
