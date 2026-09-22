import { finalCta } from "@/config/content";
import { ButtonLink } from "./ui/ButtonLink";

export function FinalCtaSection() {
  return (
    <section className="bg-velora-burgundy px-4 py-20 text-center text-velora-cream md:px-6 md:py-28">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold md:text-4xl">{finalCta.title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-velora-cream/80">{finalCta.text}</p>
        <div className="mt-8">
          <ButtonLink href={finalCta.href} variant="gold">
            {finalCta.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
