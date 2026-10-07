"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { checkout } from "@/config/content";
import type { BundleQuantity, PaymentMethod } from "@/config/pricing";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";
import { HOMEPAGE_PRODUCT_SLUG } from "@/lib/resolveCheckoutContext";
import { BundleSelector } from "./BundleSelector";
import { CheckoutSummary } from "./CheckoutSummary";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

export function CheckoutSection() {
  const router = useRouter();
  const [quantity, setQuantity] = useState<BundleQuantity>(3);
  const [method, setMethod] = useState<PaymentMethod>("card");

  function handleSubmit() {
    router.push(
      buildCheckoutPaymentStepPath(
        { product: HOMEPAGE_PRODUCT_SLUG, quantity },
        method,
      ),
    );
  }

  return (
    <section id="checkout" className="scroll-mt-24 bg-velora-cream-dark px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-velora-burgundy md:text-4xl">
          {checkout.title}
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <BundleSelector selected={quantity} onChange={setQuantity} />
            <PaymentMethodSelector method={method} quantity={quantity} onChange={setMethod} />
          </div>
          <CheckoutSummary
            quantity={quantity}
            method={method}
            submitType="button"
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
}
