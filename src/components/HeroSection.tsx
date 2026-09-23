import { hero } from "@/config/content";
import { images } from "@/config/images";
import { ButtonLink } from "./ui/ButtonLink";
import { VeloraImage } from "./ui/VeloraImage";
import { WaveDivider } from "./ui/WaveDivider";

function TrustIcon({ type }: { type: (typeof hero.trustBadges)[number]["icon"] }) {
  const className = "h-7 w-7 text-velora-champagne";
  switch (type) {
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M12 21c-4-4-6-8-6-12a6 6 0 0112 0c0 4-2 8-6 12z" />
          <path d="M12 11c-2-3-2-5 0-7" />
        </svg>
      );
    case "routine":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "delivery":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M3 7h11v8H3z" />
          <path d="M14 10h4l3 3v2h-7" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="18" cy="17" r="2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M12 3l8 7-8 11L4 10l8-7z" />
        </svg>
      );
  }
}

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[520px] overflow-hidden bg-velora-burgundy text-velora-cream sm:min-h-[580px] lg:min-h-[620px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${images.hero.background}')` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-velora-burgundy-dark/50 via-velora-burgundy/15 to-velora-burgundy-dark/55 md:bg-gradient-to-l md:from-velora-burgundy/25 md:via-transparent md:to-velora-burgundy/35"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 pb-6 pt-24 sm:pt-28 md:grid-cols-2 md:items-center md:gap-12 md:px-6 md:pb-10 md:pt-28 lg:gap-14">
        <div className="order-2 space-y-6 text-center md:order-1 md:text-right">
          <p className="text-xs tracking-[0.35em] text-velora-champagne/95">VELORA BEAUTY</p>
          <h1 className="font-display text-4xl font-bold leading-[1.22] drop-shadow-sm md:text-5xl lg:text-[3.15rem]">
            {hero.headline}
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-velora-cream/92 md:mx-0 md:text-lg">
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

          <ul className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/15 pt-6 md:mx-0 md:justify-start">
            {hero.trustBadges.map((badge) => (
              <li key={badge.label} className="flex flex-col items-center gap-2 md:items-end">
                <TrustIcon type={badge.icon} />
                <span className="text-[11px] font-medium text-velora-cream/88">{badge.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 md:order-2">
          <div className="mx-auto w-full max-w-[min(100%,22rem)] sm:max-w-[24rem] md:mx-0 md:max-w-[26rem] lg:max-w-[28rem]">
            <VeloraImage
              src={images.hero.src}
              alt={images.hero.placeholder}
              placeholder={images.hero.placeholder}
              fit="contain"
              className="aspect-[941/1672] w-full rounded-[1.75rem] border-4 border-white/95 bg-velora-cream/90 shadow-[0_24px_60px_rgba(26,10,14,0.35)]"
              priority
              sizes="(max-width: 768px) 88vw, 448px"
            />
          </div>
        </div>
      </div>

      <WaveDivider className="relative z-10 text-velora-cream" />
    </section>
  );
}
