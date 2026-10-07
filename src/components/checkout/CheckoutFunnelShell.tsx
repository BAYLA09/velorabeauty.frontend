import type { ReactNode } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { CheckoutStepper } from "./CheckoutStepper";

type Step = 1 | 2 | 3;

type Props = {
  currentStep: Step;
  children: ReactNode;
  maxWidth?: "md" | "lg";
};

export function CheckoutFunnelShell({ currentStep, children, maxWidth = "lg" }: Props) {
  const maxClass = maxWidth === "md" ? "max-w-2xl" : "max-w-6xl";

  return (
    <>
      <ProductStoreHeader />
      <main className="min-h-screen bg-[#f7f4f0] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
        <div className={`mx-auto ${maxClass}`}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-velora-burgundy/10 bg-white px-3 py-1.5 text-[11px] font-bold text-velora-burgundy/70">
              <span aria-hidden>🔒</span>
              دفع آمن ومشفّر
            </span>
          </div>
          <CheckoutStepper current={currentStep} />
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
