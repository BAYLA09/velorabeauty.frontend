import Link from "next/link";
import { brand } from "@/config/brand";
import { footer, trustStrip } from "@/config/content";
import { VeloraLogo } from "@/components/ui/VeloraLogo";

export default function BrandLandingPage() {
  return (
    <div className="min-h-screen bg-velora-cream text-velora-burgundy-dark">
      <header className="border-b border-velora-burgundy/10 bg-velora-cream/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/lp" className="shrink-0" aria-label={brand.nameEn}>
            <VeloraLogo variant="header" />
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-velora-burgundy/80 hover:text-velora-burgundy">
              Main store
            </Link>
            <Link
              href="/#contact"
              className="rounded-full bg-velora-burgundy px-4 py-2 text-velora-cream hover:bg-velora-burgundy-light"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-velora-champagne-light)_0%,_transparent_55%)] opacity-40" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-velora-burgundy/60">
              United Arab Emirates
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-el-messiri)] text-4xl font-bold leading-tight text-velora-burgundy md:text-5xl">
              {brand.nameEn}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-velora-burgundy/75 md:text-xl">
              A calm, modern approach to everyday beauty — routines you can actually keep, priced in
              AED and delivered across the UAE.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="rounded-full bg-velora-burgundy px-6 py-3 text-sm font-semibold text-velora-cream shadow-md hover:bg-velora-burgundy-light"
              >
                Explore the store
              </Link>
              <Link
                href="/#faq"
                className="rounded-full border border-velora-burgundy/25 px-6 py-3 text-sm font-semibold text-velora-burgundy hover:border-velora-burgundy/50"
              >
                FAQs
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-velora-burgundy/10 bg-velora-cream-dark px-4 py-12 md:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <article className="rounded-2xl bg-white/60 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-velora-burgundy">Designed for real routines</h2>
              <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/70">
                We focus on simple steps you can repeat — not overwhelming lists. Every formula is
                chosen to fit busy days in the UAE.
              </p>
            </article>
            <article className="rounded-2xl bg-white/60 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-velora-burgundy">Transparent ingredients</h2>
              <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/70">
                What you see on the label is what we stand behind. We avoid exaggerated claims and
                keep our messaging honest.
              </p>
            </article>
            <article className="rounded-2xl bg-white/60 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-velora-burgundy">UAE-first shopping</h2>
              <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/70">
                Checkout supports card payment and cash on delivery where configured. Prices are shown
                in AED; shipping is offered within the United Arab Emirates.
              </p>
            </article>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold text-velora-burgundy">Customer stories</h2>
            <p className="mt-3 text-sm leading-relaxed text-velora-burgundy/65">
              We only publish reviews that are genuine and approved. Visit our main store to read
              verified customer experiences when they are available.
            </p>
            <Link href="/#reviews" className="mt-6 inline-block text-sm font-medium text-velora-burgundy underline-offset-4 hover:underline">
              View reviews on the main site
            </Link>
          </div>
        </section>

        <section className="bg-velora-burgundy px-4 py-10 text-velora-cream md:px-8">
          <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-8 gap-y-3 text-center text-sm">
            {trustStrip.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="bg-velora-burgundy-dark px-4 py-12 text-velora-cream md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <VeloraLogo variant="footer" />
            <p className="mt-3 text-sm text-velora-cream/80">{brand.nameEn}</p>
            <p className="mt-1 text-xs text-velora-cream/55">{brand.country}</p>
          </div>
          <nav className="mx-auto mt-8 max-w-md">
            <ul className="space-y-2 text-sm">
              {footer.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block border-b border-white/10 py-2 text-velora-cream/85 hover:text-velora-champagne"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/lp" className="block border-b border-white/10 py-2 text-velora-cream/85">
                  Brand landing (English)
                </Link>
              </li>
            </ul>
          </nav>
          <p className="mt-10 text-center text-xs text-velora-cream/45">
            © {new Date().getFullYear()} {brand.nameEn}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
