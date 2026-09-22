"use client";

import { useState } from "react";
import type { BundleQuantity, PaymentMethod } from "@/lib/pricing";
import { BundleSelector } from "./BundleSelector";
import { CheckoutSummary } from "./CheckoutSummary";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

export function CheckoutSection() {
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [method, setMethod] = useState<PaymentMethod>("card");

  return (
    <section id="checkout" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">
          Velora Beauty · UAE
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
          الأسعار · Pricing
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <BundleSelector selected={quantity} onChange={setQuantity} />
          <PaymentMethodSelector
            method={method}
            quantity={quantity}
            onChange={setMethod}
          />
        </div>
        <CheckoutSummary quantity={quantity} method={method} />
      </div>
    </section>
  );
}
