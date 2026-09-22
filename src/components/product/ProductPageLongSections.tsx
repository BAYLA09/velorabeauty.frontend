import { ProductFaq } from "@/components/product/ProductFaq";
import { TestimonialsProductStrip } from "@/components/testimonials/TestimonialsProductStrip";
import { ProductPageImage } from "@/components/product/ProductPageImage";
import { uaeDeliveryCities } from "@/config/productPageShared";
import type { ProductPageConfig } from "@/config/productPages";

export function ProductPageLongSections({
  page,
  productImageSrc,
}: {
  page: ProductPageConfig;
  productImageSrc: string;
}) {
  return (
    <>
      <section className="border-y border-velora-burgundy/10 bg-velora-cream-dark py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-6 sm:px-6">
          {page.postCtaTrust.map((t) => (
            <div
              key={t}
              className="rounded-xl border border-velora-burgundy/10 bg-white px-2 py-3 text-center text-[10px] font-semibold text-velora-burgundy/75 sm:text-xs"
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="inline-block max-w-full overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl">
                <ProductPageImage src={productImageSrc} alt={page.hook} />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 lg:col-span-7">
              <p className="text-base leading-relaxed text-velora-burgundy/70 sm:text-lg">{page.hookSub}</p>
              <div className="rounded-3xl bg-velora-burgundy p-6 text-velora-cream shadow-xl sm:p-8">
                <p className="text-4xl font-extrabold tabular-nums text-velora-champagne sm:text-5xl">
                  {page.highlightStat.value}
                </p>
                <p className="mt-4 text-sm leading-relaxed sm:text-base">{page.highlightStat.label}</p>
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
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {page.formulaBadges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-velora-burgundy/15 bg-velora-cream px-3 py-1 text-xs font-bold text-velora-burgundy"
              >
                {b}
              </span>
            ))}
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

      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-velora-burgundy/10 bg-velora-cream p-8 sm:p-10">
          <p className="text-sm font-bold text-velora-champagne-dark">{page.brandQuoteTitle}</p>
          <p className="mt-4 text-lg leading-relaxed text-velora-burgundy/80">{page.brandQuote}</p>
        </div>
      </section>

      <section className="bg-velora-burgundy py-14 text-velora-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {page.statHighlightGrid.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-2xl font-extrabold tabular-nums text-velora-champagne sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] text-velora-cream/80">{s.label}</p>
              </div>
            ))}
          </div>
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

      <TestimonialsProductStrip title={page.testimonialTitle} subtitle={page.testimonialSubtitle} />

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-velora-burgundy">{page.comparisonTitle}</h2>
          <p className="mt-2 text-center text-sm text-velora-burgundy/60">{page.comparisonSubtitle}</p>
          <div className="mt-8 overflow-hidden rounded-3xl border border-velora-burgundy/10">
            <table className="w-full text-right text-sm">
              <thead className="bg-velora-burgundy text-velora-cream">
                <tr>
                  <th className="p-4 font-bold">المعيار</th>
                  <th className="p-4 font-bold">فيلورا</th>
                  <th className="p-4 font-bold">بدائل</th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonRows.map((row) => (
                  <tr key={row.label} className="border-t border-velora-burgundy/10">
                    <td className="bg-velora-cream-dark p-4 font-semibold text-velora-burgundy">{row.label}</td>
                    <td className="p-4 text-velora-burgundy">{row.velora}</td>
                    <td className="p-4 text-velora-burgundy/60">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-velora-cream py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-extrabold text-velora-burgundy">{page.guaranteeTitle}</h2>
          <p className="mt-2 text-sm text-velora-burgundy/65">{page.guaranteeSubtitle}</p>
          <ol className="mt-8 space-y-4 text-right">
            {page.guaranteeSteps.map((s) => (
              <li key={s.title} className="flex gap-4 rounded-2xl border border-velora-burgundy/10 bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-velora-burgundy text-sm font-bold text-velora-cream">
                  {s.step}
                </span>
                <div>
                  <p className="font-bold text-velora-burgundy">{s.title}</p>
                  <p className="mt-1 text-sm text-velora-burgundy/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-velora-burgundy/55">{page.guaranteeFooter}</p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-velora-burgundy">{page.usageTitle}</h2>
          <p className="mt-2 text-center text-sm text-velora-burgundy/60">{page.usageSubtitle}</p>
          <ol className="mt-8 space-y-3">
            {page.usageSteps.map((step) => (
              <li key={step.title} className="rounded-2xl border border-velora-burgundy/10 bg-velora-cream p-4">
                <p className="font-bold text-velora-burgundy">{step.title}</p>
                <p className="mt-1 text-sm text-velora-burgundy/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-velora-cream-dark py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-velora-burgundy">{page.deliveryTitle}</h2>
          <p className="mt-2 text-center text-sm text-velora-burgundy/65">{page.deliverySubtitle}</p>
          <ol className="mt-8 space-y-4">
            {page.deliverySteps.map((s) => (
              <li key={s.title} className="flex gap-4 rounded-2xl border border-velora-burgundy/10 bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-velora-champagne text-sm font-bold text-velora-burgundy-dark">
                  {s.step}
                </span>
                <div>
                  <p className="font-bold text-velora-burgundy">{s.title}</p>
                  <p className="mt-1 text-sm text-velora-burgundy/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-center text-sm font-bold text-velora-burgundy">مدن التوصيل</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {uaeDeliveryCities.map((city) => (
              <span
                key={city}
                className="rounded-full border border-velora-burgundy/15 bg-white px-3 py-1 text-xs text-velora-burgundy/80"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ProductFaq items={page.preOrderFaq} title={page.preOrderFaqTitle} />
      <ProductFaq items={page.faq} title="الأسئلة الشائعة" />
    </>
  );
}
