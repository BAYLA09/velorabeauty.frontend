import { ProductFaq } from "@/components/product/ProductFaq";
import {
  IconBox,
  IconCard,
  IconClock,
  IconDroplet,
  IconLeaf,
  IconPhone,
  IconSparkles,
  IconStethoscope,
  IconTruck,
} from "@/components/product/ProductFunnelIcons";
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
    <div className="mb-8 max-w-3xl text-right lg:mx-auto lg:text-center">
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

export function ProductPageLongSections({
  page,
  marketingSpotlight,
  productName,
}: {
  page: ProductPageConfig;
  marketingSpotlight?: string;
  productName: string;
}) {
  const survey = page.internalSurvey;

  return (
    <>
      {survey ? (
        <section className="mx-auto max-w-lg px-4 py-6 sm:max-w-3xl sm:px-6">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#2c1318] px-4 py-5 text-velora-cream sm:px-6 sm:py-6">
            <div className="flex items-stretch gap-3 sm:gap-4">
              <div className="flex h-16 w-[4.25rem] shrink-0 items-center justify-center rounded-xl bg-velora-champagne sm:h-[4.75rem] sm:w-[5rem]">
                <span className="text-[1.65rem] font-black tabular-nums text-[#2c1318]">{survey.value}</span>
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-[13px] font-extrabold leading-[1.55] sm:text-[15px]">{survey.headline}</p>
                <p className="mt-2 text-[10px] text-velora-cream/50 sm:text-[11px]">{survey.source}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-velora-cream py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <SectionIntro eyebrow={page.painEyebrow} title={page.painTitle} lead={page.painLead} />
          <div className="space-y-4">
            {page.painItems.map((item) => (
              <div
                key={item.problem}
                className="overflow-hidden rounded-[1.5rem] border border-velora-burgundy/10 bg-white shadow-sm"
              >
                <div className="flex items-start gap-3 p-4 sm:p-5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700"
                    aria-hidden
                  >
                    ✕
                  </span>
                  <p className="flex-1 text-sm font-medium italic leading-relaxed text-velora-burgundy">
                    {item.problem}
                  </p>
                </div>
                <div className="flex items-start gap-3 border-t border-velora-burgundy/8 bg-velora-cream-dark/90 p-4 sm:p-5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <p className="flex-1 text-sm leading-relaxed text-velora-burgundy/85">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <SectionIntro
            eyebrow={page.formulaEyebrow}
            title={page.formulaTitle}
            lead={page.formulaSubtitle}
          />
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {page.formulaBadges.map((b) => (
              <div
                key={b}
                className="rounded-2xl border border-velora-burgundy/12 bg-velora-cream px-2 py-3 text-center text-xs font-extrabold text-velora-burgundy-dark sm:text-sm"
              >
                {b}
              </div>
            ))}
          </div>
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
                <p className="mt-1 text-xs font-bold text-velora-champagne-dark">جرعة يومية مدروسة</p>
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
        </div>
      </section>

      <ProductMarketingGallery src={marketingSpotlight} productName={productName} />

      <section className="bg-velora-cream py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-velora-burgundy-dark sm:text-3xl">
            {page.notIncludedTitle}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {page.notIncluded.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-velora-burgundy/10 bg-white px-3 py-4 text-right"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  ✕
                </span>
                <span className="text-[11px] font-semibold leading-snug text-velora-burgundy/80 sm:text-xs">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-4 py-6 sm:max-w-3xl sm:px-6">
        <div className="rounded-[1.75rem] border border-velora-burgundy/10 bg-white p-5 shadow-sm sm:p-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-900">
            <IconStethoscope className="h-4 w-4" />
            {page.brandQuoteTitle}
          </span>
          <p className="mt-4 text-base leading-[1.85] text-velora-burgundy/85 sm:text-lg">{page.brandQuote}</p>
          <p className="mt-3 text-xs font-bold text-velora-champagne-dark">تركيبة مدروسة للاستخدام اليومي</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {page.statHighlightGrid.slice(0, 2).map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-velora-cream-dark px-3 py-4 text-center"
              >
                <p className="text-2xl font-black tabular-nums text-velora-champagne-dark">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold text-velora-burgundy/65">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-velora-cream-dark py-8">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 px-4 sm:max-w-3xl sm:px-6">
          {page.statHighlightGrid.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-velora-burgundy/8 bg-white px-3 py-4 text-center shadow-sm"
            >
              <p className="text-2xl font-black tabular-nums text-velora-champagne-dark">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold text-velora-burgundy/65">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-velora-cream py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <SectionIntro
            eyebrow="نتيجة من أول علبة"
            title={page.timelineTitle}
            lead={page.timelineNote}
          />
          <ol className="space-y-5">
            {page.timelineSteps.map((step) => (
              <li key={step.title} className="relative pt-4">
                <span className="absolute left-1/2 top-0 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-[#2c1318] text-sm font-black text-velora-cream">
                  {step.step}
                </span>
                <div className="rounded-[1.5rem] border border-velora-burgundy/10 bg-white px-4 pb-5 pt-8 text-center shadow-sm">
                  <p className="font-extrabold text-velora-burgundy-dark">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-velora-burgundy/70">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TestimonialsProductStrip title={page.testimonialTitle} subtitle={page.testimonialSubtitle} layout="pdp" />

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <SectionIntro
            eyebrow="ليش فيلورا تختلف؟"
            title={page.comparisonTitle}
            lead={page.comparisonSubtitle}
          />
          <div className="space-y-4">
            {page.competitorBlocks.map((block) => (
              <div
                key={block.title}
                className="rounded-[1.5rem] border border-velora-burgundy/10 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start gap-2">
                  <span className="text-rose-600" aria-hidden>
                    ⚠
                  </span>
                  <div>
                    <p className="font-extrabold text-velora-burgundy-dark">{block.title}</p>
                    <p className="mt-0.5 text-xs font-bold text-rose-800/80">{block.tagline}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {block.bullets.map((b) => (
                    <li key={b} className="flex items-center justify-between gap-2 text-sm text-velora-burgundy/70">
                      <span>{b}</span>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-700">
                        ✕
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mb-4 mt-10 text-center text-xl font-extrabold text-velora-burgundy-dark">
            {page.quickComparisonTitle}
          </h3>
          <div className="overflow-hidden rounded-[1.5rem] border border-velora-burgundy/10">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#2c1318] text-velora-cream">
                <tr>
                  <th className="p-3 font-bold">المعيار</th>
                  <th className="p-3 font-bold">فيلورا</th>
                  <th className="p-3 font-bold">بدائل</th>
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
                        <span className="text-emerald-700" aria-hidden>
                          ✓
                        </span>
                        {row.velora}
                      </span>
                    </td>
                    <td className="p-3 text-velora-burgundy/60">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-rose-600" aria-hidden>
                          ✕
                        </span>
                        {row.others}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-velora-cream py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <div className="rounded-[2rem] bg-velora-cream-dark p-4 sm:p-6">
            <h2 className="text-center text-2xl font-extrabold text-velora-burgundy-dark">{page.guaranteeTitle}</h2>
            <p className="mt-2 text-center text-sm text-velora-burgundy/65">{page.guaranteeSubtitle}</p>
            <ol className="mt-6 space-y-5">
              {page.guaranteeSteps.map((s) => (
                <li key={s.title} className="relative pt-4">
                  <span className="absolute left-1/2 top-0 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-[#2c1318] text-sm font-black text-velora-cream">
                    {s.step}
                  </span>
                  <div className="rounded-[1.25rem] bg-white px-4 pb-4 pt-8 text-center shadow-sm">
                    <p className="font-extrabold text-velora-burgundy-dark">{s.title}</p>
                    <p className="mt-1 text-sm text-velora-burgundy/70">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-center text-[11px] text-velora-burgundy/50">{page.guaranteeFooter}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <SectionIntro eyebrow={page.usageTitle} title={page.usageSubtitle} />
          <ol className="space-y-3">
            {page.usageSteps.map((step, i) => {
              const UsageIcon = usageIcons[i] ?? IconSparkles;
              return (
              <li
                key={step.title}
                className="flex items-start gap-3 rounded-[1.25rem] border border-velora-burgundy/10 bg-velora-cream p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-velora-burgundy/20 bg-white text-velora-burgundy">
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
        </div>
      </section>

      <section className="bg-velora-cream-dark py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6">
          <SectionIntro
            eyebrow={page.deliveryTitle}
            title={page.deliverySubtitle}
            lead="بطاقة (شحن مجاني) أو دفع عند الاستلام"
          />
          <ol className="space-y-4">
            {page.deliverySteps.map((s) => (
              <li
                key={s.title}
                className="relative rounded-[1.5rem] border border-velora-burgundy/10 bg-white p-4 pt-8 shadow-sm sm:p-5 sm:pt-9"
              >
                <span className="absolute left-4 top-3 text-xs font-black text-velora-champagne-dark">
                  {s.step}
                </span>
                <span className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2c1318] text-velora-cream">
                  {s.step === "1" ? (
                    <IconCard className="h-4 w-4" />
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

          <div className="mt-8 rounded-[1.75rem] border border-velora-burgundy/10 bg-white p-5 shadow-sm">
            <h3 className="text-center text-xl font-extrabold text-velora-burgundy-dark">
              نوصّل لكل مناطق الإمارات
            </h3>
            <p className="mt-2 text-center text-sm font-bold text-velora-burgundy/60">مدن التوصيل</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {uaeDeliveryCities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1 rounded-full border border-velora-burgundy/12 bg-velora-cream px-3 py-1.5 text-[11px] font-semibold text-velora-burgundy/80"
                >
                  <span className="text-emerald-700" aria-hidden>
                    ✓
                  </span>
                  {city}
                </span>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] text-velora-burgundy/50">
              شركات توصيل معتمدة داخل الإمارات
            </p>
          </div>
        </div>
      </section>

      <ProductFaq
        items={[...page.preOrderFaq, ...page.faq]}
        title={page.preOrderFaqTitle}
        subtitle="كل اللي تحتاجين تعرفينه"
      />
    </>
  );
}
