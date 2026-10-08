"use client";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckoutCardPaymentBlock } from "@/components/checkout/CheckoutCardPaymentBlock";
import { CheckoutFormSection } from "@/components/checkout/CheckoutFormSection";
import { CheckoutLaraShell } from "@/components/checkout/CheckoutLaraShell";
import { CheckoutPayButton } from "@/components/checkout/CheckoutPayButton";
import { CheckoutSummarySidebar } from "@/components/checkout/CheckoutSummarySidebar";
import {
  CheckoutStripeElementsProvider,
  useCheckoutStripe,
} from "@/components/checkout/CheckoutStripeElementsProvider";
import { CheckoutStripePaymentElement } from "@/components/checkout/CheckoutStripePaymentElement";
import {
  checkoutFieldLabelClass,
  checkoutInputClass,
} from "@/components/checkout/checkoutFieldStyles";
import { checkoutPaymentCopy } from "@/config/checkoutTrust";
import { checkoutEmirates } from "@/config/productCheckout";
import { getCheckoutTotal, type BundleQuantity } from "@/config/pricing";
import { IconCard, IconTruck } from "@/components/product/ProductFunnelIcons";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

type Props = {
  productSlug: string;
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
  stripeEnabled?: boolean;
  stripeBootstrap?: StripeCardBootstrap | null;
};

type DeliveryFormState = {
  email: string;
  name: string;
  phone: string;
  emirate: string;
  address: string;
  building: string;
};

function CheckoutDeliveryFields(props: {
  email: string;
  setEmail: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  emirate: string;
  setEmirate: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  building: string;
  setBuilding: (v: string) => void;
}) {
  const {
    email,
    setEmail,
    name,
    setName,
    phone,
    setPhone,
    emirate,
    setEmirate,
    address,
    setAddress,
    building,
    setBuilding,
  } = props;

  return (
    <>
      <CheckoutFormSection
        title="معلومات التواصل"
        subtitle="لإرسال تأكيد الطلب وتحديثات التوصيل"
      >
        <div>
          <label htmlFor="email" className={checkoutFieldLabelClass}>
            البريد الإلكتروني{" "}
            <span className="font-normal text-neutral-400">(اختياري)</span>
          </label>
          <input
            id="email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="name@email.com"
            className={checkoutInputClass}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="name" className={checkoutFieldLabelClass}>
            الاسم الكامل
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="مثال: نورة العتيبي"
            className={checkoutInputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="phone" className={checkoutFieldLabelClass}>
            رقم الهاتف
          </label>
          <input
            id="phone"
            required
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
            placeholder="0501234567"
            className={checkoutInputClass}
            autoComplete="tel"
          />
        </div>
      </CheckoutFormSection>

      <CheckoutFormSection title="عنوان التوصيل">
        <div>
          <label htmlFor="area" className={checkoutFieldLabelClass}>
            المنطقة
          </label>
          <select
            id="area"
            required
            value={emirate}
            onChange={(ev) => setEmirate(ev.target.value)}
            className={checkoutInputClass}
          >
            <option value="">اختاري الإمارة</option>
            {checkoutEmirates.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="address" className={checkoutFieldLabelClass}>
            العنوان / تفاصيل التوصيل
          </label>
          <input
            id="address"
            required
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            placeholder="مثال: دبي مارينا، برج …"
            className={checkoutInputClass}
            autoComplete="street-address"
          />
        </div>
        <div>
          <label htmlFor="building" className={checkoutFieldLabelClass}>
            رقم المبنى / الشقة{" "}
            <span className="font-normal text-neutral-400">(اختياري)</span>
          </label>
          <input
            id="building"
            value={building}
            onChange={(ev) => setBuilding(ev.target.value)}
            placeholder="مثال: برج 5، شقة 1204"
            className={checkoutInputClass}
          />
        </div>
      </CheckoutFormSection>
    </>
  );
}

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

function StripeCardPaymentAndSubmit({
  productSlug,
  productName,
  quantity,
  form,
}: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  form: DeliveryFormState;
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { paymentIntentId, paymentReady } = useCheckoutStripe();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const total = getCheckoutTotal(quantity, "card");

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

    const buildingPart = form.building.trim();
    const fullAddress = buildingPart
      ? `${trimmedAddress} — ${buildingPart}`
      : trimmedAddress;

    setSubmitting(true);
    try {
      const finalizeRes = await fetch("/api/stripe/finalize-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          productSlug,
          productName,
          quantity,
          customerName: trimmedName,
          phone: trimmedPhone,
          email: form.email.trim() || undefined,
          emirate: form.emirate,
          address: fullAddress,
        }),
      });
      const finalizeData = (await finalizeRes.json()) as {
        orderId?: string;
        order?: OrderRecord;
        error?: string;
      };
      if (!finalizeRes.ok || !finalizeData.orderId || !finalizeData.order) {
        setError(finalizeData.error ?? "تعذّر حفظ الطلب.");
        return;
      }

      const order = finalizeData.order;
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
      const returnUrl = `${origin}/order/thank-you?id=${encodeURIComponent(order.id)}`;
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: {
            billing_details: {
              name: trimmedName,
              email: form.email.trim() || undefined,
              phone: trimmedPhone,
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message ?? "تعذّر إتمام الدفع.");
        return;
      }

      router.push(`/order/thank-you?id=${encodeURIComponent(order.id)}`);
    } catch {
      setError("تعذّر الاتصال. حاولي مجدداً.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <CheckoutStripePaymentElement />

      {error ? (
        <p className="mt-4 text-sm font-bold text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="border-t border-neutral-100 pt-6">
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

function CheckoutCardStripeForm({
  productSlug,
  productName,
  productImageSrc,
  quantity,
  backHref,
  stripeBootstrap,
}: Props & { backHref: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");

  const formState: DeliveryFormState = {
    email,
    name,
    phone,
    emirate,
    address,
    building,
  };

  return (
    <CheckoutLaraShell
      title="إتمام الطلب"
      subtitle="أكملي معلومات التوصيل ثم أدخلي بيانات البطاقة"
      backHref={backHref}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-8">
        <form
          onSubmit={(e) => e.preventDefault()}
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
            />

            <CheckoutStripeElementsProvider
              productSlug={productSlug}
              productName={productName}
              quantity={quantity}
              bootstrap={stripeBootstrap ?? null}
            >
              <StripeCardPaymentAndSubmit
                productSlug={productSlug}
                productName={productName}
                quantity={quantity}
                form={formState}
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
    </CheckoutLaraShell>
  );
}

function CheckoutCardLegacyForm({
  productSlug,
  productName,
  productImageSrc,
  quantity,
  backHref,
}: Props & { backHref: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const total = getCheckoutTotal(quantity, "card");

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
          emirate,
          address: fullAddress,
        }),
      });

      const data = (await res.json()) as { order?: OrderRecord; error?: string };
      if (!res.ok || !data.order) {
        setError(data.error ?? "تعذّر حفظ الطلب.");
        return;
      }

      const order = data.order;
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

        <CheckoutSummaryColumn
          productSlug={productSlug}
          productName={productName}
          productImageSrc={productImageSrc}
          quantity={quantity}
        />
      </div>
    </CheckoutLaraShell>
  );
}

export function CheckoutCardConfirmClient({
  productSlug,
  productName,
  productImageSrc,
  quantity,
  stripeEnabled = false,
  stripeBootstrap = null,
}: Props) {
  const backHref = buildCheckoutPaymentStepPath({ product: productSlug, quantity }, "card");

  if (stripeEnabled) {
    return (
      <CheckoutCardStripeForm
        productSlug={productSlug}
        productName={productName}
        productImageSrc={productImageSrc}
        quantity={quantity}
        backHref={backHref}
        stripeBootstrap={stripeBootstrap}
      />
    );
  }

  return (
    <CheckoutCardLegacyForm
      productSlug={productSlug}
      productName={productName}
      productImageSrc={productImageSrc}
      quantity={quantity}
      backHref={backHref}
    />
  );
}
