import type { ProductPageConfig } from "@/config/productPages";

type Props = {
  page: Pick<
    ProductPageConfig,
    "guaranteeTitle" | "guaranteeSubtitle" | "guaranteeSteps" | "guaranteeFooter"
  >;
  /** Tighter spacing when shown in the buy-box column */
  variant?: "inline" | "section";
};

export function ProductVeloraGuaranteeBlock({ page, variant = "section" }: Props) {
  const card = (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f5e6d3] via-velora-cream-dark to-[#e8d7b8] p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full border-4 border-velora-champagne/40 bg-velora-champagne/20"
        aria-hidden
      />
      <p className="text-center text-[11px] font-bold tracking-[0.25em] text-velora-burgundy/60">
        ضمان فيلورا
      </p>
      <h2 className="mt-2 text-center text-xl font-extrabold text-velora-burgundy-dark sm:text-2xl">
        {page.guaranteeTitle}
      </h2>
      <p className="mt-2 text-center text-sm text-velora-burgundy/65">{page.guaranteeSubtitle}</p>
      <ol className="mt-5 space-y-4">
        {page.guaranteeSteps.map((s) => (
          <li key={s.title} className="relative pt-4">
            <span className="absolute left-1/2 top-0 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#2c1318] text-xs font-black text-velora-cream sm:h-9 sm:w-9 sm:text-sm">
              {s.step}
            </span>
            <div className="rounded-[1.25rem] bg-white px-3 pb-3 pt-7 text-center shadow-sm sm:px-4 sm:pb-4 sm:pt-8">
              <p className="text-sm font-extrabold text-velora-burgundy-dark sm:text-base">{s.title}</p>
              <p className="mt-1 text-xs text-velora-burgundy/70 sm:text-sm">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-center text-[11px] text-velora-burgundy/50">{page.guaranteeFooter}</p>
    </div>
  );

  if (variant === "inline") {
    return <div className="mt-4 w-full min-w-0">{card}</div>;
  }

  return (
    <section className="bg-velora-cream py-10 sm:py-14">
      <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6 lg:max-w-[1200px]">{card}</div>
    </section>
  );
}
