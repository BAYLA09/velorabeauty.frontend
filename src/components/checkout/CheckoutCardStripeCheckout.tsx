"use client";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutDeliveryFields } from "@/components/checkout/CheckoutDeliveryFields";
import { CheckoutEmailMarketingFields } from "@/components/checkout/CheckoutEmailMarketingFields";
import {
  clearStoredCheckoutExternalId,
  resolveCheckoutExternalId,
  useCaptureBackendCheckout,
} from "@/components/checkout/useCaptureBackendCheckout";
import { CheckoutLaraShell } from "@/components/checkout/CheckoutLaraShell";
import { CheckoutSupportBlock } from "@/components/support/CheckoutSupportBlock";
import { CheckoutPayButton } from "@/components/checkout/CheckoutPayButton";
import { isHairGummiesBackorderReservation } from "@/config/hairGummiesBackorder";
import { HairGummiesBackorderNotice } from "@/components/product/HairGummiesBackorderNotice";
import {
  CheckoutStripeElementsProvider,
  useCheckoutStripe,
} from "@/components/checkout/CheckoutStripeElementsProvider";
import { CheckoutStripePaymentElement } from "@/components/checkout/CheckoutStripePaymentElement";
import { useStripeCheckoutPrefetch } from "@/components/checkout/useStripeCheckoutPrefetch";
import type { BundleQuantity } from "@/config/pricing";
import { resolveCheckoutTotalAed } from "@/lib/checkoutTotals";
import { IconCard, IconTruck } from "@/components/product/ProductFunnelIcons";
import { parseCheckoutLines } from "@/lib/checkoutUpsell";
import { validateUaeMobilePhone } from "@/lib/phone/uaePhone";
import { readCheckoutApiJson } from "@/lib/checkout/readCheckoutApiJson";
import { formatCheckoutPayError } from "@/lib/checkout/formatCheckoutPayError";
import { STRIPE_CHECKOUT_BILLING_COUNTRY } from "@/lib/checkout/stripePaymentElementConfig";
import { getCheckoutAttributionForOrder } from "@/lib/attribution/checkoutAttributionClient";
import { trackSnapAddBilling } from "@/lib/analytics/trackSnapCommerce";
import { confirmCardPaymentOnServer } from "@/lib/checkout/confirmCardPaymentOnServer";
import { submitAndConfirmStripePayment } from "@/lib/checkout/submitAndConfirmStripePayment";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

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

type DeliveryFormState = {
  email: string;
  name: string;
  phone: string;
  emirate: string;
  address: string;
  building: string;
  marketingConsent: boolean;
  externalCheckoutId: string;
};

export type CheckoutCardStripeCheckoutProps = {
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
  stripeBootstrap?: StripeCardBootstrap | null;
  backHref: string;
  cartLines: ReturnType<typeof parseCheckoutLines>;
  sendCartLines: boolean;
  cartItemsParam?: string;
};

function CheckoutSummaryColumn({
  productSlug,
  productName,
  productImageSrc,
  quantity,
}: {
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
}) {
  return (
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
  );
}

function CheckoutCardPaySection({
  productSlug,
  productName,
  quantity,
  eligibleUnits,
  form,
  cartLines,
  sendCartLines,
  syncNow,
  stripeBootstrap,
}: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
  form: DeliveryFormState;
  cartLines: ReturnType<typeof parseCheckoutLines>;
  sendCartLines: boolean;
  syncNow: () => void;
  stripeBootstrap?: StripeCardBootstrap | null;
}) {
  const { elementsLoading } = useCheckoutStripe();
  const total = resolveCheckoutTotalAed(
    quantity,
    "card",
    eligibleUnits,
    cartLines,
    productSlug,
  );

  if (elementsLoading) {
    return (
      <div className="border-t border-neutral-100 pt-6">
        <CheckoutPayButton totalAed={total} disabled hint="جاري تحميل الدفع…" />
      </div>
    );
  }

  return (
    <StripeCardPaymentAndSubmit
      productSlug={productSlug}
      productName={productName}
      quantity={quantity}
      eligibleUnits={eligibleUnits}
      form={form}
      cartLines={cartLines}
      sendCartLines={sendCartLines}
      syncNow={syncNow}
      stripeBootstrap={stripeBootstrap}
    />
  );
}

function StripeCardPaymentAndSubmit({
  productSlug,
  productName,
  quantity,
  eligibleUnits,
  form,
  cartLines,
  sendCartLines,
  syncNow,
  stripeBootstrap,
}: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
  form: DeliveryFormState;
  cartLines: ReturnType<typeof parseCheckoutLines>;
  sendCartLines: boolean;
  syncNow: () => void;
  stripeBootstrap?: StripeCardBootstrap | null;
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { paymentIntentId, paymentReady } = useCheckoutStripe();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const total = resolveCheckoutTotalAed(
    quantity,
    "card",
    eligibleUnits,
    cartLines,
    productSlug,
  );

  async function handlePay() {
    setError(null);

    if (!stripe || !elements) {
      setError("نموذج الدفع ما زال يحمّل — انتظري ثوانٍ.");
      return;
    }

    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedAddress = form.address.trim();
    if (!trimmedName || !trimmedPhone || !trimmedAddress || !form.emirate) {
      setError("أكملي الاسم والهاتف والإمارة وعنوان التوصيل.");
      return;
    }
    const phoneCheck = validateUaeMobilePhone(trimmedPhone);
    if (!phoneCheck.ok) {
      setError(phoneCheck.error);
      return;
    }

    const buildingPart = form.building.trim();
    const fullAddress = buildingPart
      ? `${trimmedAddress} — ${buildingPart}`
      : trimmedAddress;

    setSubmitting(true);
    try {
      syncNow();
      const finalizeRes = await fetch("/api/stripe/finalize-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          productSlug,
          productName,
          quantity,
          customerName: trimmedName,
          phone: phoneCheck.normalized,
          email: form.email.trim() || undefined,
          marketingConsent: form.marketingConsent,
          externalCheckoutId: resolveCheckoutExternalId(form.externalCheckoutId),
          emirate: form.emirate,
          address: fullAddress,
          attribution: getCheckoutAttributionForOrder(),
          ...(sendCartLines ? { cartLines } : {}),
        }),
      });
      const parsed = await readCheckoutApiJson<{
        orderId?: string;
        order?: OrderRecord;
        paymentIntentStatus?: string;
        error?: string;
      }>(finalizeRes);
      if (!parsed.ok) {
        setError("تعذّر الاتصال بالخادم. تحققي من الشبكة أو أعيدي تحميل الصفحة.");
        return;
      }
      const finalizeData = parsed.data;
      if (!finalizeRes.ok || !finalizeData.orderId || !finalizeData.order) {
        setError(finalizeData.error ?? "تعذّر حفظ الطلب.");
        return;
      }

      const order = finalizeData.order;
      trackSnapAddBilling({
        productSlug,
        quantity,
        valueAed: order.totalAed,
        ...(sendCartLines ? { cartLines } : {}),
      });
      if (finalizeData.paymentIntentStatus === "succeeded") {
        await confirmCardPaymentOnServer({
          orderId: order.id,
          paymentIntentId,
        });
        clearStoredCheckoutExternalId();
        router.push(`/checkout/success?id=${encodeURIComponent(order.id)}`);
        return;
      }

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

      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://www.velorabeauty.world";
      const returnUrl = `${origin}/checkout/success?id=${encodeURIComponent(order.id)}`;
      const payment = await submitAndConfirmStripePayment(stripe, elements, {
        returnUrl,
        billingDetails: {
          name: trimmedName,
          email: form.email.trim() || undefined,
          phone: phoneCheck.normalized,
          addressLine1: trimmedAddress,
          addressLine2: buildingPart || undefined,
          addressCity: form.emirate,
          addressState: form.emirate,
          addressCountry: STRIPE_CHECKOUT_BILLING_COUNTRY,
        },
      });
      if (!payment.ok) {
        setError(payment.message);
        return;
      }

      await confirmCardPaymentOnServer({
        orderId: order.id,
        paymentIntentId,
      });
      router.push(`/checkout/success?id=${encodeURIComponent(order.id)}`);
    } catch (err) {
      console.error("[checkout-card-pay]", err);
      setError(formatCheckoutPayError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {error ? (
        <p className="mt-4 text-sm font-bold text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="border-t border-neutral-100 pt-6">
        {isHairGummiesBackorderReservation(productSlug) ? (
          <HairGummiesBackorderNotice className="mb-4" />
        ) : null}
        <CheckoutPayButton
          totalAed={total}
          loading={submitting}
          disabled={!paymentReady}
          loadingLabel="جاري معالجة الدفع…"
          hint="أدخلي بيانات البطاقة أعلاه ثم أكّدي الدفع."
          onClick={() => void handlePay()}
        />
      </div>
    </>
  );
}

export function CheckoutCardStripeCheckout({
  productSlug,
  productName,
  productImageSrc,
  quantity,
  eligibleUnits,
  backHref,
  stripeBootstrap,
  cartLines,
  sendCartLines,
  cartItemsParam,
}: CheckoutCardStripeCheckoutProps) {
  useStripeCheckoutPrefetch({
    productSlug,
    productName,
    quantity,
    eligibleUnits,
    itemsParam: cartItemsParam,
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
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
    paymentIntentId: stripeBootstrap?.paymentIntentId,
  });

  const formState: DeliveryFormState = {
    email,
    name,
    phone,
    emirate,
    address,
    building,
    marketingConsent,
    externalCheckoutId,
  };

  return (
    <CheckoutLaraShell
      title="إتمام الطلب"
      subtitle="أدخلي بيانات البطاقة ثم أكملي عنوان التوصيل"
      backHref={backHref}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-xl border border-[#d9d9d9] bg-white p-5 shadow-sm sm:p-6 lg:p-8"
        >
          <div className="space-y-8">
            <CheckoutStripeElementsProvider
              productSlug={productSlug}
              productName={productName}
              quantity={quantity}
              eligibleUnits={eligibleUnits}
              itemsParam={cartItemsParam}
              bootstrap={stripeBootstrap ?? null}
            >
              <CheckoutStripePaymentElement />

              <CheckoutEmailMarketingFields
                email={email}
                setEmail={setEmail}
                marketingConsent={marketingConsent}
                setMarketingConsent={setMarketingConsent}
                onEmailBlur={syncNow}
              />

              <CheckoutDeliveryFields
                hideEmailMarketing
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

              <CheckoutCardPaySection
                productSlug={productSlug}
                productName={productName}
                quantity={quantity}
                eligibleUnits={eligibleUnits}
                form={formState}
                cartLines={cartLines}
                sendCartLines={sendCartLines}
                syncNow={syncNow}
                stripeBootstrap={stripeBootstrap}
              />
            </CheckoutStripeElementsProvider>
          </div>
        </form>

        <CheckoutSummaryColumn
          productSlug={productSlug}
          productName={productName}
          productImageSrc={productImageSrc}
          quantity={quantity}
        />
      </div>

      <CheckoutSupportBlock className="mx-auto mt-8 max-w-2xl" />
    </CheckoutLaraShell>
  );
}
