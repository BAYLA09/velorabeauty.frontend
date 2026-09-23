import { ProductFaq } from "@/components/product/ProductFaq";
import { IconClock, IconLeaf, IconSparkles } from "@/components/product/ProductFunnelIcons";
import { ProductMarketingGallery } from "@/components/product/ProductMarketingGallery";
import { TestimonialsProductStrip } from "@/components/testimonials/TestimonialsProductStrip";
import { uaeDeliveryCities } from "@/config/productPageShared";
import type { ProductPageConfig } from "@/config/productPages";

function SectionIntro({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-8 max-w-2xl text-right lg:mx-auto lg:text-center">
      {eyebrow ? (
        <p className="mb-2 text-[11px] font-bold tracking-[0.28em] text-velora-champagne-dark">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-extrabold leading-snug text-velora-burgundy-dark sm:text-3xl">{title}</h2>
      {lead ? <p className="mt-3 text-base leading-relaxed text-velora-burgundy/65">{lead}</p> : null}
    </div>
  );
}

const usageIcons = [IconClock, IconSparkles, IconLeaf] as const;

export function ProductPageLongSections({
  page,
  marketingSpotlight,
  productName,
}: {
  page: ProductPageConfig;
  marketingSpotlight?: string;
  productName: string;
}) {
  return (
    <>
      <section className="bg-velora-cream py-12 sm:py-16">
        <div className="mx-auto max-w-lg px-4 sm:max-w-2xl sm:px-6">
          <SectionIntro eyebrow={page.painEyebrow} title={page.painTitle} lead={page.painLead} />
          <ul className="space-y-6 border-r-2 border-velora-champagne/60 pr-5">
            {page.painItems.map((item) => (
              <li key={item.problem}>
                <p className="text-sm font-medium leading-relaxed text-velora-burgundy/90">{item.problem}</p>
                <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/65">{item.solution}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#2c1318] py-14 text-center sm:py-20">
        <div className="mx-auto max-w-lg px-6 sm:max-w-2xl">
          <h2 className="text-2xl font-extrabold leading-snug text-velora-cream sm:text-3xl">
            {page.lifestyleTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-velora-cream/75">{page.lifestyleLine}</p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-lg px-4 text-center sm:max-w-2xl sm:px-6">
          <p className="text-[11px] font-bold tracking-[0.28em] text-velora-champagne-dark">التحوّل</p>
          <h2 className="mt-3 text-2xl font-extrabold text-velora-burgundy-dark sm:text-3xl">
            {page.transformationTitle}
          </h2>
          <ul className="mt-8 space-y-3">
            {page.transformationPillars.map((line) => (
              <li key={line} className="text-lg font-semibold text-velora-burgundy/80">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-velora-cream py-12 sm:py-16">
        <div className="mx-auto max-w-lg px-4 sm:max-w-2xl sm:px-6">
          <SectionIntro eyebrow={page.formulaEyebrow} title={page.formulaTitle} lead={page.formulaSubtitle} />
          <div className="space-y-4">
            {page.formulaCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.5rem] border border-velora-burgundy/10 bg-white px-6 py-6 text-right shadow-sm"
              >
                <h3 className="text-xl font-extrabold text-velora-burgundy-dark">{card.title}</h3>
                {card.lines.map((line) => (
                  <p key={line} className="mt-2 text-sm leading-relaxed text-velora-burgundy/75">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            {page.formulaBadges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-velora-burgundy/12 px-3 py-1 text-[11px] font-bold text-velora-burgundy-dark"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ProductMarketingGallery src={marketingSpotlight} productName={productName} />

      <section className="mx-auto max-w-lg px-4 py-8 sm:max-w-2xl sm:px-6">
        <blockquote className="text-right">
          <p className="text-lg font-medium leading-[1.85] text-velora-burgundy-dark sm:text-xl">{page.brandQuote}</p>
          <footer className="mt-4 text-xs font-bold tracking-wide text-velora-champagne-dark">{page.brandQuoteTitle}</footer>
        </blockquote>
      </section>

      <section className="bg-velora-cream-dark/40 py-10">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 px-4 sm:max-w-2xl sm:px-6">
          {page.statHighlightGrid.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white px-3 py-5 text-center">
              <p className="text-2xl font-black tabular-nums text-velora-champagne-dark">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold text-velora-burgundy/65">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-velora-cream py-12 sm:py-16">
        <div className="mx-auto max-w-lg px-4 sm:max-w-2xl sm:px-6">
          <SectionIntro eyebrow="الرحلة" title={page.timelineTitle} lead={page.timelineNote} />
          <ol className="space-y-4">
            {page.timelineSteps.map((step) => (
              <li
                key={step.title}
                className="rounded-[1.25rem] border border-velora-burgundy/10 bg-white px-5 py-4 text-right"
              >
                <p className="text-xs font-black text-velora-champagne-dark">{step.step}</p>
                <p className="mt-1 font-extrabold text-velora-burgundy-dark">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-velora-burgundy/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TestimonialsProductStrip title={page.testimonialTitle} subtitle={page.testimonialSubtitle} layout="pdp" />

      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-2xl sm:px-6">
          <SectionIntro title={page.comparisonTitle} lead={page.comparisonSubtitle} />
          <div className="overflow-hidden rounded-[1.25rem] border border-velora-burgundy/10">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#2c1318] text-velora-cream">
                <tr>
                  <th className="p-3 font-bold">المعيار</th>
                  <th className="p-3 font-bold">VELORA</th>
                  <th className="p-3 font-bold text-velora-cream/70">غير ذلك</th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-velora-cream-dark/40"}>
                    <td className="p-3 font-semibold text-velora-burgundy">{row.label}</td>
                    <td className="p-3 text-velora-burgundy-dark">{row.velora}</td>
                    <td className="p-3 text-velora-burgundy/55">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-velora-cream py-12 sm:py-14">
        <div className="mx-auto max-w-lg px-4 text-center sm:max-w-2xl sm:px-6">
          <h2 className="text-2xl font-extrabold text-velora-burgundy-dark">{page.guaranteeTitle}</h2>
          <p className="mt-2 text-sm text-velora-burgundy/65">{page.guaranteeSubtitle}</p>
          <ol className="mt-8 space-y-3 text-right">
            {page.guaranteeSteps.map((s) => (
              <li key={s.title} className="rounded-xl bg-white px-4 py-3 text-sm">
                <span className="font-extrabold text-velora-burgundy-dark">{s.title}</span>
                <span className="text-velora-burgundy/70"> — {s.text}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] text-velora-burgundy/45">{page.guaranteeFooter}</p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-lg px-4 sm:max-w-2xl sm:px-6">
          <SectionIntro eyebrow={page.usageTitle} title={page.usageSubtitle} />
          <ol className="space-y-3">
            {page.usageSteps.map((step, i) => {
              const UsageIcon = usageIcons[i] ?? IconSparkles;
              return (
                <li key={step.title} className="flex items-start gap-3 rounded-xl border border-velora-burgundy/10 px-4 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-velora-cream-dark text-velora-burgundy">
                    <UsageIcon className="h-4 w-4" />
                  </span>
                  <div className="text-right">
                    <p className="font-extrabold text-velora-burgundy-dark">{step.title}</p>
                    <p className="mt-1 text-sm text-velora-burgundy/70">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-velora-cream-dark/50 py-12 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-2xl sm:px-6">
          <SectionIntro eyebrow={page.deliveryTitle} title={page.deliverySubtitle} />
          <ol className="space-y-3">
            {page.deliverySteps.map((s) => (
              <li key={s.title} className="rounded-xl bg-white px-4 py-4 text-right shadow-sm">
                <p className="text-xs font-black text-velora-champagne-dark">{s.step}</p>
                <p className="mt-1 font-extrabold text-velora-burgundy-dark">{s.title}</p>
                <p className="mt-1 text-sm text-velora-burgundy/70">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-xs text-velora-burgundy/50">
            {uaeDeliveryCities.slice(0, 4).join(" · ")} · ومناطق أخرى
          </p>
        </div>
      </section>

      <section className="bg-[#2c1318] py-16 text-center sm:py-20">
        <div className="mx-auto max-w-lg px-6 sm:max-w-xl">
          <h2 className="text-3xl font-extrabold text-velora-cream sm:text-4xl">{page.finalCtaTitle}</h2>
          <p className="mt-4 text-base text-velora-cream/75">{page.finalCtaLine}</p>
          <a
            href="#purchase"
            className="mt-8 inline-block rounded-full bg-velora-champagne px-8 py-4 text-sm font-black text-[#2c1318] transition hover:bg-velora-champagne/90"
          >
            ابدئي روتينك
          </a>
        </div>
      </section>

      <ProductFaq items={[...page.preOrderFaq, ...page.faq]} title={page.preOrderFaqTitle} />
    </>
  );
}
