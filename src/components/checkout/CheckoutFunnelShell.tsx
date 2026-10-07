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

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function CheckoutFunnelShell({ currentStep, children, maxWidth = "lg" }: Props) {
  const maxClass = maxWidth === "md" ? "max-w-2xl" : "max-w-6xl";

  return (
    <>
      <ProductStoreHeader />
      <main className="min-h-screen bg-[#f4f4f5] px-4 pb-16 pt-5 sm:px-6 sm:pb-20 sm:pt-6">
        <div className={`mx-auto ${maxClass}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] font-medium text-neutral-500">
              <IconShield className="h-4 w-4 text-emerald-700" />
              دفع آمن 100% — بياناتك محمية دائماً
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
