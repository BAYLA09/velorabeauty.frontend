"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckoutCardPaymentBlock } from "@/components/checkout/CheckoutCardPaymentBlock";
import { CheckoutDeliveryFields } from "@/components/checkout/CheckoutDeliveryFields";
import {
  clearStoredCheckoutExternalId,
  resolveCheckoutExternalId,
  useCaptureBackendCheckout,
} from "@/components/checkout/useCaptureBackendCheckout";
import { CheckoutLaraShell } from "@/components/checkout/CheckoutLaraShell";
import { CheckoutPayButton } from "@/components/checkout/CheckoutPayButton";
import { checkoutPaymentCopy } from "@/config/checkoutTrust";
import type { BundleQuantity } from "@/config/pricing";
import { resolveCheckoutTotalAed } from "@/lib/checkoutTotals";
import { IconCard, IconTruck } from "@/components/product/ProductFunnelIcons";
import { parseCheckoutLines } from "@/lib/checkoutUpsell";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";

const CheckoutSummarySidebar = dynamic(
  () =>
    import("@/components/checkout/CheckoutSummarySidebar").then(
      (mod) => mod.CheckoutSummarySidebar,
    ),
  {
    ssr: false,
    loading: () => (
      <aside
        className="hidden min-h-[280px] rounded-xl border border-[#d9d9d9] bg-neutral-50 lg:block lg:min-w-[280px]"
        aria-hidden
      />
    ),
  },
);

export type CheckoutCardLegacyCheckoutProps = {
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
  backHref: string;
  cartLines: ReturnType<typeof parseCheckoutLines>;
  sendCartLines: boolean;
};

export function CheckoutCardLegacyCheckout({
  productSlug,
  productName,
  productImageSrc,
  quantity,
  eligibleUnits,
  backHref,
  cartLines,
  sendCartLines,
}: CheckoutCardLegacyCheckoutProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { externalCheckoutId, syncNow } = useCaptureBackendCheckout({
    email,
    marketingConsent,
    customerName: name,
    phone,
    emirate,
    paymentMethod: "card",
    productSlug,
    quantity,
    cartLines,
    sendCartLines,
  });
  const [submitting, setSubmitting] = useState(false);
  const total = resolveCheckoutTotalAed(quantity, "card", eligibleUnits, cartLines);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !trimmedPhone || !trimmedAddress || !emirate) {
      setError("أكملي الاسم والهاتف والإمارة وعنوان التوصيل.");
      return;
    }

    const buildingPart = building.trim();
    const fullAddress = buildingPart
      ? `${trimmedAddress} — ${buildingPart}`
      : trimmedAddress;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          quantity,
          paymentMethod: "card",
          customerName: trimmedName,
          phone: trimmedPhone,
          email: email.trim() || undefined,
          marketingConsent,
          externalCheckoutId: resolveCheckoutExternalId(externalCheckoutId),
          emirate,
          address: fullAddress,
          ...(sendCartLines ? { cartLines } : {}),
        }),
      });

      const data = (await res.json()) as { order?: OrderRecord; error?: string };
      if (!res.ok || !data.order) {
        setError(data.error ?? "تعذّر حفظ الطلب.");
        return;
      }

      const order = data.order;
      clearStoredCheckoutExternalId();
      saveOrderDraft({
        orderId: order.id,
        productSlug: order.productSlug,
        productName: order.productName,
        quantity: order.quantity,
        method: order.paymentMethod,
        totalAed: order.totalAed,
        deliveryFeeAed: order.deliveryFeeAed,
        customerName: order.customerName,
        phone: order.phone,
        emirate: order.emirate,
        address: order.address,
        createdAt: order.createdAt,
      });
      router.push(`/order/thank-you?id=${encodeURIComponent(order.id)}`);
    } catch {
      setError("تعذّر الاتصال. حاولي مجدداً.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CheckoutLaraShell
      title="إتمام الطلب"
      subtitle="أكملي معلومات التوصيل ثم أدخلي بيانات البطاقة"
      backHref={backHref}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[#d9d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8"
        >
          <div className="space-y-8">
            <CheckoutDeliveryFields
              email={email}
              setEmail={setEmail}
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              emirate={emirate}
              setEmirate={setEmirate}
              address={address}
              setAddress={setAddress}
              building={building}
              setBuilding={setBuilding}
              marketingConsent={marketingConsent}
              setMarketingConsent={setMarketingConsent}
              onEmailBlur={syncNow}
            />

            <CheckoutCardPaymentBlock stripeEnabled={false} />

            {error ? (
              <p className="text-sm font-bold text-rose-700" role="alert">
                {error}
              </p>
            ) : null}

            <div className="border-t border-neutral-100 pt-6">
              <CheckoutPayButton
                totalAed={total}
                loading={submitting}
                hint={checkoutPaymentCopy.payRedirectHint}
              />
            </div>
          </div>
        </form>

        <CheckoutSummarySidebar
          productSlug={productSlug}
          productName={productName}
          productImageSrc={productImageSrc}
          quantity={quantity}
          paymentMethod="card"
          totalLabel="المجموع الكلي"
          showTrust
          editableBasket
          footer={
            <div className="flex items-center justify-center gap-2 rounded-lg bg-[#e8f5e9] px-3 py-3 text-center text-xs font-bold text-emerald-900">
              <IconTruck className="h-4 w-4 shrink-0" />
              <span>شحن مجاني مع الدفع بالبطاقة</span>
              <IconCard className="h-4 w-4 shrink-0" />
            </div>
          }
        />
      </div>
    </CheckoutLaraShell>
  );
}
