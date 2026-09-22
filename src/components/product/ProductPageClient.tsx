"use client";

import { useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductFaq } from "@/components/product/ProductFaq";
import { ProductGallery } from "@/components/product/ProductGallery";
import {
  ProductPurchasePanel,
  type PurchaseState,
} from "@/components/product/ProductPurchasePanel";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { VeloraImage } from "@/components/ui/VeloraImage";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import type { ProductWithPage } from "@/lib/productCatalog";

type Props = {
  product: ProductWithPage;
  allProducts: ProductWithPage[];
};

export function ProductPageClient({ product, allProducts }: Props) {
  const [purchase, setPurchase] = useState<PurchaseState | null>(null);
  const page = product.page;

  return (
    <>
      <ProductAnnouncementBar />
      <ProductStoreHeader />
      <main className="bg-white pb-24 md:pb-0">
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductGallery
              mainSrc={product.image.src}
              productName={product.name}
              placeholders={page.galleryPlaceholders}
              laraFrame
            />

            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {page.statChips.map((chip) => (
                  <div
                    key={chip.label}
                    className="rounded-xl border border-velora-burgundy/10 bg-white px-2 py-2.5 text-center shadow-sm"
                  >
                    <p className="text-base font-extrabold tabular-nums text-velora-burgundy sm:text-lg">
                      {chip.value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium leading-tight text-velora-burgundy/55">
                      {chip.label}
                    </p>
                  </div>
                ))}
              </div>

              <h1 className="text-2xl font-extrabold leading-[1.15] text-velora-burgundy sm:text-3xl lg:text-[2rem]">
                {page.headlineQuestion}
              </h1>
              <p className="text-sm leading-relaxed text-velora-burgundy/65 sm:text-base">{page.subhook}</p>

              <p className="text-sm font-extrabold text-velora-burgundy">
                من {formatPrice(singleProductPrice)} / منتج
              </p>

              <p className="rounded-xl border border-velora-champagne/40 bg-velora-cream-dark px-3 py-2.5 text-xs font-bold leading-relaxed text-velora-burgundy sm:text-sm">
                {page.urgencyLine}
              </p>

              <ProductPurchasePanel form={page.form} onChange={setPurchase} />
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <VeloraImage
                  src={product.image.src}
                  alt={page.hook}
                  placeholder={page.problemImagePlaceholder}
                  className="aspect-[4/5] overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>
              <div className="flex flex-col justify-center gap-6 lg:col-span-7">
                <p className="text-base leading-relaxed text-velora-burgundy/70 sm:text-lg">{page.hookSub}</p>
                <div className="rounded-3xl bg-velora-burgundy p-6 text-velora-cream shadow-xl sm:p-8">
                  <p className="text-2xl font-extrabold leading-snug sm:text-3xl">{page.hook}</p>
                  <p className="mt-3 text-[11px] text-velora-cream/60">VELORA BEAUTY — الإمارات</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-velora-cream py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 max-w-3xl lg:mx-auto lg:text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-velora-champagne-dark">
                {page.painEyebrow}
              </p>
              <h2 className="text-2xl font-extrabold text-velora-burgundy sm:text-3xl lg:text-4xl">
                {page.painTitle}
              </h2>
              <p className="mt-4 text-base text-velora-burgundy/65">{page.painLead}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              {page.painItems.map((item) => (
                <div
                  key={item.problem}
                  className="overflow-hidden rounded-3xl border border-velora-burgundy/10 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-3 border-b border-velora-burgundy/10 p-5">
                    <span className="mt-0.5 text-velora-burgundy/50" aria-hidden>
                      ✕
                    </span>
                    <p className="flex-1 text-sm font-medium italic leading-relaxed text-velora-burgundy">
                      {item.problem}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-velora-cream-dark p-5">
                    <span className="mt-0.5 text-velora-champagne-dark" aria-hidden>
                      ✓
                    </span>
                    <p className="flex-1 text-sm leading-relaxed text-velora-burgundy/80">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 max-w-3xl lg:mx-auto lg:text-center">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-velora-champagne-dark">
                {page.formulaEyebrow}
              </p>
              <h2 className="text-2xl font-extrabold text-velora-burgundy sm:text-3xl">{page.formulaTitle}</h2>
              <p className="mt-4 text-base text-velora-burgundy/65">{page.formulaSubtitle}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.formulaCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-velora-burgundy/10 bg-velora-cream p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-velora-burgundy">{card.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {card.lines.map((line) => (
                      <li key={line} className="text-sm text-velora-burgundy/70">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-velora-cream-dark py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-xl font-bold text-velora-burgundy">{page.notIncludedTitle}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {page.notIncluded.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-velora-burgundy/75">
                  <span className="text-velora-burgundy/40">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-extrabold text-velora-burgundy">{page.timelineTitle}</h2>
            <p className="mt-2 text-center text-sm text-velora-burgundy/55">{page.timelineNote}</p>
            <ol className="mt-8 space-y-4">
              {page.timelineSteps.map((step) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-velora-burgundy/10 bg-velora-cream p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-velora-burgundy text-sm font-bold text-velora-cream">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-bold text-velora-burgundy">{step.title}</p>
                    <p className="mt-1 text-sm text-velora-burgundy/70">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-velora-cream px-4 py-14 md:px-6">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-dashed border-velora-burgundy/20 bg-white p-8 text-center">
            <p className="text-5xl text-velora-champagne/80" aria-hidden>
              ❝
            </p>
            <p className="mt-4 text-lg text-velora-burgundy/70">اكتبي تجربة عميلة حقيقية هنا.</p>
            <p className="mt-2 text-sm font-semibold text-velora-burgundy">اسم العميلة — مدينة الإمارات</p>
            <div className="mx-auto mt-6 h-24 w-24 overflow-hidden rounded-full border-2 border-velora-champagne/40">
              <VeloraImage
                src="/images/testimonials/customer-01.webp"
                alt=""
                placeholder="[صورة العميلة هنا]"
                className="h-full w-full rounded-full"
                sizes="96px"
              />
            </div>
          </div>
        </section>

        <ProductFaq items={page.faq} title="الأسئلة الشائعة" />
        <RelatedProducts currentSlug={product.slug} products={allProducts} />
      </main>
      <FooterSection />

      {purchase && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white p-3 shadow-[0_-8px_30px_rgba(58,24,32,0.12)] md:hidden">
          <button
            type="button"
            className="w-full rounded-full bg-velora-burgundy py-3.5 text-sm font-extrabold text-velora-cream"
          >
            {purchase.ctaLabel}
          </button>
        </div>
      )}
    </>
  );
}
