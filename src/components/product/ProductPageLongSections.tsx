import { ProductFaq } from "@/components/product/ProductFaq";
import {
  IconCheckCircle,
  IconLeaf,
  IconPhone,
  IconSparkles,
  IconTruck,
  IconXCircle,
  IconClock,
  IconBox,
  IconDroplet,
} from "@/components/product/ProductFunnelIcons";
import { TestimonialsProductStrip } from "@/components/testimonials/TestimonialsProductStrip";
import { uaeDeliveryCities } from "@/config/productPageShared";
import { productPageFlags } from "@/config/productPageFlags";
import type { ProductPageConfig } from "@/config/productPages";
import type { ProductId } from "@/config/products";

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
    <div className="mb-6 max-w-3xl text-right">
      {eyebrow ? (
        <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-velora-champagne-dark">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-extrabold leading-snug text-velora-burgundy-dark sm:text-3xl">
        {title}
      </h2>
      {lead ? <p className="mt-3 text-base text-velora-burgundy/65">{lead}</p> : null}
    </div>
  );
}

const usageIcons = [IconClock, IconBox, IconDroplet, IconSparkles] as const;
const mechanismIcons = [IconDroplet, IconLeaf, IconSparkles] as const;

function ProductPagePainItemCards({ page }: { page: ProductPageConfig }) {
  return (
    <div className="space-y-4">
      {page.painItems.map((item) => (
        <div
          key={item.problem}
          className="overflow-hidden rounded-[1.5rem] border border-velora-burgundy/10 bg-white shadow-sm"
        >
          <div className="flex items-start gap-3 p-4 sm:p-5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700/90"
              aria-hidden
            >
              <IconXCircle className="h-4 w-4" />
            </span>
            <p className="flex-1 text-sm font-bold leading-relaxed text-velora-burgundy">
              {item.problem}
            </p>
          </div>
          <div className="flex items-start gap-3 border-t border-velora-burgundy/8 bg-velora-cream-dark/90 p-4 sm:p-5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800/90"
              aria-hidden
            >
              <IconCheckCircle className="h-4 w-4" />
            </span>
            <p className="flex-1 text-sm leading-relaxed text-velora-burgundy/85">
              {item.solution}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Pain eyebrow, title, and lead — story image is placed in the PDP layout after this block. */
export function ProductPagePainNarrativeIntro({ page }: { page: ProductPageConfig }) {
  return (
    <section className="bg-velora-cream pt-8 sm:pt-10 pb-3 sm:pb-4">
      <SectionIntro eyebrow={page.painEyebrow} title={page.painTitle} lead={page.painLead} />
    </section>
  );
}

/** Complaint / solution cards — rendered after the problem story image on catalog PDPs. */
export function ProductPagePainNarrativeCards({ page }: { page: ProductPageConfig }) {
  return (
    <section className="bg-velora-cream pb-8 sm:pb-10 pt-4 sm:pt-5">
      <ProductPagePainItemCards page={page} />
    </section>
  );
}

export function ProductPageFormulaMarketing({ page }: { page: ProductPageConfig }) {
  const formulaBadges = productPageFlags.showCertBadges
    ? ["GMP", "حلال", "جودة معتمدة", "تصنيع مدروس"]
    : page.formulaBadges;

  return (
    <section className="bg-white py-8 sm:py-10">
      <SectionIntro
        eyebrow={page.formulaEyebrow}
        title={page.formulaTitle}
        lead={page.formulaSubtitle}
      />
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {formulaBadges.map((b) => (
          <div
            key={b}
            className="rounded-2xl border border-velora-burgundy/12 bg-velora-cream px-2 py-3 text-center text-xs font-extrabold text-velora-burgundy-dark sm:text-sm"
          >
            {b}
          </div>
        ))}
      </div>
      <ol className="mb-6 grid gap-3 sm:grid-cols-3">
        {page.mechanismSteps.map((step, i) => {
          const MechIcon = mechanismIcons[i] ?? IconSparkles;
          return (
            <li
              key={step.title}
              className="rounded-2xl border border-velora-burgundy/10 bg-velora-cream p-4 text-center"
            >
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-velora-burgundy">
                <MechIcon className="h-5 w-5" />
              </span>
              <p className="mt-2 text-sm font-extrabold text-velora-burgundy-dark">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-velora-burgundy/70">{step.text}</p>
            </li>
          );
        })}
      </ol>
      <div className="space-y-4">
        {page.formulaCards.map((card) => (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-[1.5rem] border border-velora-burgundy/10 bg-white p-5 shadow-sm sm:p-6"
          >
            <span
              className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-velora-cream-dark text-velora-burgundy"
              aria-hidden
            >
              <IconLeaf className="h-5 w-5" />
            </span>
            <h3 className="pr-12 text-lg font-extrabold text-velora-burgundy-dark">{card.title}</h3>
            <ul className="mt-3 space-y-1.5">
              {card.lines.map((line) => (
                <li key={line} className="text-sm leading-relaxed text-velora-burgundy/75">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductPageUsageAndResults({ page }: { page: ProductPageConfig }) {
  return (
    <section className="bg-velora-cream py-8 sm:py-10">
      <SectionIntro title={page.resultsPromiseTitle} lead={page.resultsPromiseLead} />
      <SectionIntro eyebrow={page.usageTitle} title={page.usageSubtitle} />
      <ol className="space-y-3">
        {page.usageSteps.map((step, i) => {
          const UsageIcon = usageIcons[i] ?? IconSparkles;
          return (
            <li
              key={step.title}
              className="flex items-start gap-3 rounded-[1.25rem] border border-velora-burgundy/10 bg-white p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-velora-burgundy/20 bg-velora-cream text-velora-burgundy">
                <UsageIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-extrabold text-velora-burgundy-dark">{step.title}</p>
                <p className="mt-1 text-sm text-velora-burgundy/70">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ProductPageComparisonSection({ page }: { page: ProductPageConfig }) {
  return (
    <section className="bg-white py-8 sm:py-10">
      <SectionIntro title={page.comparisonTitle} lead={page.comparisonSubtitle} />
      <div className="overflow-x-auto overflow-y-hidden rounded-[1.5rem] border border-velora-burgundy/10">
        <table className="w-full min-w-[520px] text-right text-sm">
          <thead className="bg-[#2c1318] text-velora-cream">
            <tr>
              <th className="p-3 font-bold">المعيار</th>
              <th className="p-3 font-bold">فيلورا</th>
              <th className="p-3 font-bold">إبر وبوتوكس</th>
              <th className="p-3 font-bold">كريمات غالية</th>
            </tr>
          </thead>
          <tbody>
            {page.comparisonRows.map((row, i) => (
              <tr
                key={row.label}
                className={i % 2 === 0 ? "bg-white" : "bg-velora-cream-dark/50"}
              >
                <td className="p-3 font-semibold text-velora-burgundy">{row.label}</td>
                <td className="p-3 text-velora-burgundy">
                  <span className="inline-flex items-center gap-1">
                    <IconCheckCircle className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                    {row.velora}
                  </span>
                </td>
                <td className="p-3 text-velora-burgundy/60">{row.injections}</td>
                <td className="p-3 text-velora-burgundy/60">{row.creams}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ProductPageTestimonials({
  page,
  productId,
}: {
  page: ProductPageConfig;
  productId: ProductId;
}) {
  if (!productPageFlags.showSocialProof) return null;
  return (
    <TestimonialsProductStrip
      title={page.testimonialTitle}
      subtitle={page.testimonialSubtitle}
      layout="pdp"
      productId={productId}
    />
  );
}

export function ProductPageDeliveryAndFaq({ page }: { page: ProductPageConfig }) {
  const faqItems = [...page.preOrderFaq, ...page.faq].filter(
    (item, index, arr) => arr.findIndex((x) => x.question === item.question) === index,
  );

  return (
    <>
      <section className="bg-white py-8 sm:py-10">
        <SectionIntro eyebrow={page.deliveryTitle} title={page.deliverySubtitle} />
        <ol className="space-y-4">
          {page.deliverySteps.map((s) => (
            <li
              key={s.title}
              className="relative rounded-[1.5rem] border border-velora-burgundy/10 bg-velora-cream p-4 pt-8 shadow-sm sm:p-5 sm:pt-9"
            >
              <span className="absolute left-4 top-3 text-xs font-black text-velora-champagne-dark">
                {s.step}
              </span>
              <span className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2c1318] text-velora-cream">
                {s.step === "1" ? (
                  <IconBox className="h-4 w-4" />
                ) : s.step === "2" ? (
                  <IconPhone className="h-4 w-4" />
                ) : (
                  <IconTruck className="h-4 w-4" />
                )}
              </span>
              <p className="mt-2 font-extrabold text-velora-burgundy-dark">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/70">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-[1.75rem] border border-velora-burgundy/10 bg-velora-cream p-5 shadow-sm">
          <h3 className="text-center text-xl font-extrabold text-velora-burgundy-dark">
            نوصّل لكل مناطق الإمارات
          </h3>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {uaeDeliveryCities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1 rounded-full border border-velora-burgundy/12 bg-white px-3 py-1.5 text-[11px] font-semibold text-velora-burgundy/80"
              >
                <IconCheckCircle className="h-3 w-3 shrink-0 text-emerald-700/90" aria-hidden />
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ProductFaq items={faqItems} title={page.preOrderFaqTitle} subtitle="إجابات واضحة قبل الطلب" />
    </>
  );
}

/** @deprecated Use ProductPageDeliveryAndFaq + ProductPageTestimonials in Lara order */
export function ProductPagePdpTail({
  page,
  productId,
}: {
  page: ProductPageConfig;
  productId: ProductId;
}) {
  return (
    <>
      <ProductPageTestimonials page={page} productId={productId} />
      <ProductPageDeliveryAndFaq page={page} />
    </>
  );
}
