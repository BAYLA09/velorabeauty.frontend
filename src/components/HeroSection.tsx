import { hero } from "@/config/content";
import { images } from "@/config/images";
import { ButtonLink } from "./ui/ButtonLink";
import { VeloraImage } from "./ui/VeloraImage";
import { WaveDivider } from "./ui/WaveDivider";

export function HeroSection() {
  return (
    <section className="relative bg-velora-burgundy text-velora-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-4 pt-8 md:grid-cols-2 md:items-center md:gap-12 md:px-6 md:pb-8 md:pt-14">
        <div className="order-2 space-y-6 text-center md:order-1 md:text-right">
          <p className="text-xs tracking-[0.35em] text-velora-champagne/90">VELORA BEAUTY</p>
          <h1 className="text-4xl font-bold leading-[1.25] md:text-5xl lg:text-[3.25rem]">
            {hero.headline}
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-velora-cream/80 md:mx-0 md:text-lg">
            {hero.subheadline}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
            <ButtonLink href={hero.primaryHref} variant="gold">
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href={hero.secondaryHref} variant="outline">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <VeloraImage
            src={images.hero.src}
            alt={images.hero.placeholder}
            placeholder={images.hero.placeholder}
            className="aspect-[4/5] rounded-[2rem] border border-white/10 shadow-2xl shadow-black/25"
            priority
            sizes="(max-width: 768px) 90vw, 480px"
          />
        </div>
      </div>

      <WaveDivider className="text-velora-cream" />
    </section>
  );
}
