import { hero } from "@/config/content";
import { images } from "@/config/images";
import { ButtonLink } from "./ui/ButtonLink";
import { VeloraImage } from "./ui/VeloraImage";
import { WaveDivider } from "./ui/WaveDivider";

function TrustIcon({ type }: { type: "leaf" | "diamond" | "spark" }) {
  const className = "h-7 w-7 text-velora-champagne";
  if (type === "leaf") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 21c-4-4-6-8-6-12a6 6 0 0112 0c0 4-2 8-6 12z" />
        <path d="M12 11c-2-3-2-5 0-7" />
      </svg>
    );
  }
  if (type === "diamond") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 3l8 7-8 11L4 10l8-7z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-velora-cream">
      {/* Scene background (marble + burgundy — from brand mockup) */}
      <div
        className="absolute inset-0 bg-velora-burgundy bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${images.hero.sceneBackground}')` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-velora-burgundy-dark/55 via-velora-burgundy/25 to-velora-burgundy-dark/70 md:from-velora-burgundy/35 md:via-transparent md:to-velora-burgundy/50"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 pb-6 pt-24 sm:pt-28 md:grid-cols-2 md:items-center md:gap-10 md:px-6 md:pb-10 md:pt-32 lg:gap-14">
        {/* RTL: عمود يمين — النص */}
        <div className="order-2 space-y-6 text-center md:order-1 md:text-right">
          <p className="text-xs tracking-[0.35em] text-velora-champagne/95">VELORA BEAUTY</p>
          <h1 className="font-display text-4xl font-bold leading-[1.22] md:text-5xl lg:text-[3.15rem]">
            {hero.headline}
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-velora-cream/88 md:mx-0 md:text-lg">
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

          <ul className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-6 border-t border-white/15 pt-6 md:mx-0 md:justify-start">
            {hero.trustBadges.map((badge) => (
              <li key={badge.label} className="flex flex-col items-center gap-2 md:items-end">
                <TrustIcon type={badge.icon} />
                <span className="text-[11px] font-medium text-velora-cream/85">{badge.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RTL: عمود يسار — صورة الحملة */}
        <div className="order-1 md:order-2">
          <div className="mx-auto max-w-md md:mx-0 md:max-w-none md:ps-2 lg:ps-6">
            <VeloraImage
              src={images.hero.src}
              alt={images.hero.placeholder}
              placeholder={images.hero.placeholder}
              className="aspect-[4/5] rounded-[1.75rem] border-4 border-white/90 bg-velora-cream shadow-[0_24px_60px_rgba(26,10,14,0.35)] ring-1 ring-black/5"
              priority
              sizes="(max-width: 768px) 90vw, 480px"
            />
          </div>
        </div>
      </div>

      <WaveDivider className="relative z-10 text-velora-cream" />
    </section>
  );
}
