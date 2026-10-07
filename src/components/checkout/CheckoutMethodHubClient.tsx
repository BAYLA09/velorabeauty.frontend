"use client";

import Link from "next/link";
import { FooterSection } from "@/components/FooterSection";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { checkoutExperience } from "@/config/checkoutExperience";
import {
  codFee,
  currencyLabel,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
} from "@/config/pricing";
import { buildCheckoutPath } from "@/lib/checkoutRoutes";

type Props = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
};

export function CheckoutMethodHubClient({ productSlug, productName, quantity }: Props) {
  const cardTotal = getCheckoutTotal(quantity, "card");
  const codTotal = getCheckoutTotal(quantity, "cod");
  const query = { product: productSlug, quantity };

  return (
    <>
      <ProductStoreHeader />
      <main className="min-h-screen bg-gradient-to-b from-[#2c1318] via-[#3a1820] to-velora-cream px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center text-velora-cream">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-velora-champagne">
            {checkoutExperience.hub.title}
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{productName}</h1>
          <p className="mt-4 text-base text-velora-cream/75">{checkoutExperience.hub.lead}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          <Link
            href={buildCheckoutPath("card", query)}
            className="group relative overflow-hidden rounded-[2rem] border border-velora-champagne/35 bg-gradient-to-br from-[#fdf8ef] to-white p-8 text-right shadow-2xl transition hover:-translate-y-1 hover:shadow-velora-champagne/20"
          >
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-velora-champagne/20 blur-2xl transition group-hover:bg-velora-champagne/30" />
            <p className="relative text-xs font-bold tracking-[0.2em] text-velora-champagne-dark">
              CARD · شحن مجاني
            </p>
            <h2 className="relative mt-3 text-2xl font-black text-velora-burgundy-dark">
              الدفع بالبطاقة
            </h2>
            <p className="relative mt-3 text-sm leading-relaxed text-velora-burgundy/70">
              {checkoutExperience.card.lead}
            </p>
            <p className="relative mt-8 text-4xl font-black text-velora-burgundy">
              {formatPrice(cardTotal)}
            </p>
            <span className="relative mt-6 inline-flex rounded-full bg-velora-burgundy px-5 py-2.5 text-sm font-bold text-velora-cream">
              متابعة الدفع بالبطاقة ←
            </span>
          </Link>

          <Link
            href={buildCheckoutPath("cod", query)}
            className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#2c1318] to-[#1a0c10] p-8 text-right text-velora-cream shadow-2xl transition hover:-translate-y-1 hover:border-white/25"
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-velora-burgundy/40 blur-2xl" />
            <p className="relative text-xs font-bold tracking-[0.2em] text-velora-champagne">
              COD · +{codFee} {currencyLabel}
            </p>
            <h2 className="relative mt-3 text-2xl font-black">الدفع عند الاستلام</h2>
            <p className="relative mt-3 text-sm leading-relaxed text-velora-cream/75">
              {checkoutExperience.cod.lead}
            </p>
            <p className="relative mt-8 text-4xl font-black">{formatPrice(codTotal)}</p>
            <span className="relative mt-6 inline-flex rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-bold backdrop-blur-sm">
              متابعة الدفع عند الاستلام ←
            </span>
          </Link>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
