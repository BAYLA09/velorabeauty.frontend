"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { checkout } from "@/config/content";
import {
  checkoutEmirates,
  productCheckoutCopy,
} from "@/config/productCheckout";
import { getCheckoutTotal, type BundleQuantity, type PaymentMethod } from "@/config/pricing";
import { saveOrderDraft } from "@/lib/orderStorage";

type Props = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
};

export function ProductCheckoutSection({
  productSlug,
  productName,
  quantity,
  method,
  onMethodChange,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState(checkoutEmirates[0] ?? "دبي");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !trimmedPhone || !trimmedAddress) {
      setError("عفواً — أكملي الاسم والهاتف والعنوان.");
      return;
    }

    const totalAed = getCheckoutTotal(quantity, method);
    saveOrderDraft({
      productSlug,
      productName,
      quantity,
      method,
      totalAed,
      customerName: trimmedName,
      phone: trimmedPhone,
      emirate,
      address: trimmedAddress,
      createdAt: new Date().toISOString(),
    });
    router.push("/order/thank-you");
  }

  return (
    <section
      id="checkout"
      className="scroll-mt-24 border-y border-lara-green/10 bg-lara-green py-14 text-velora-cream sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-velora-champagne">
            فيلورا بيوتي — الإمارات
          </p>
          <h2 className="mt-3 text-2xl font-black leading-snug sm:text-3xl lg:text-4xl">
            {productCheckoutCopy.sectionTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-velora-cream/75 sm:text-base">
            {productCheckoutCopy.sectionLead}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start"
        >
          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-velora-cream">
                {productCheckoutCopy.formTitle}
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-velora-cream/70">
                    {productCheckoutCopy.fields.name}
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-velora-cream/70">
                    {productCheckoutCopy.fields.phone}
                  </span>
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
                    autoComplete="tel"
                    placeholder="+971"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-velora-cream/70">
                    {productCheckoutCopy.fields.emirate}
                  </span>
                  <select
                    value={emirate}
                    onChange={(e) => setEmirate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
                  >
                    {checkoutEmirates.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-velora-cream/70">
                    {productCheckoutCopy.fields.address}
                  </span>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1.5 w-full resize-none rounded-xl border border-white/15 bg-white px-3 py-3 text-sm text-velora-burgundy-dark outline-none ring-velora-champagne/40 focus:ring-2"
                  />
                </label>
              </div>
              {error && (
                <p className="mt-3 text-sm font-semibold text-rose-200" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white p-5 sm:p-6">
              <PaymentMethodSelector
                method={method}
                quantity={quantity}
                onChange={onMethodChange}
              />
              <p className="mt-4 text-xs leading-relaxed text-velora-burgundy/65">
                {method === "card"
                  ? productCheckoutCopy.cardNextStep
                  : productCheckoutCopy.codNextStep}
              </p>
            </div>
          </div>

          <CheckoutSummary
            quantity={quantity}
            method={method}
            submitLabel={checkout.submit}
            submitType="submit"
            variant="dark"
          />
        </form>

        <p className="mx-auto mt-8 max-w-xl text-center text-[11px] leading-relaxed text-velora-cream/50">
          {productCheckoutCopy.submitHint}
        </p>
      </div>
    </section>
  );
}
