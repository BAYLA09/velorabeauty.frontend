"use client";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCheckoutCardForm } from "@/components/checkout/CheckoutCardFormContext";
import { CheckoutPayButton } from "@/components/checkout/CheckoutPayButton";
import {
  CheckoutStripeElementsProvider,
  useCheckoutStripe,
} from "@/components/checkout/CheckoutStripeElementsProvider";
import { CheckoutStripePaymentElement } from "@/components/checkout/CheckoutStripePaymentElement";
import { getCheckoutTotal } from "@/config/pricing";
import { saveOrderDraft } from "@/lib/orderStorage";
import type { OrderRecord } from "@/lib/ordersRepository";
import { prefetchStripeCardCheckout } from "@/lib/prefetchStripeCardCheckout";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

function StripeCardPaySection() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { productSlug, productName, quantity, form } = useCheckoutCardForm();
  const { paymentIntentId } = useCheckoutStripe();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const total = getCheckoutTotal(quantity, "card");

  async function handlePay() {
    setError(null);

    if (!stripe || !elements) {
      setError("نموذج الدفع ما زال يحمّل — انتظري لحظة.");
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
          hint="أدخلي بيانات البطاقة أعلاه ثم أكّدي الدفع."
          onClick={() => void handlePay()}
        />
      </div>
    </>
  );
}

type IslandProps = {
  bootstrap: StripeCardBootstrap | null;
};

export function CheckoutStripePaymentIsland({ bootstrap }: IslandProps) {
  const { productSlug, productName, quantity } = useCheckoutCardForm();

  useEffect(() => {
    void prefetchStripeCardCheckout({ productSlug, productName, quantity });
  }, [productSlug, productName, quantity]);

  return (
    <CheckoutStripeElementsProvider
      productSlug={productSlug}
      productName={productName}
      quantity={quantity}
      bootstrap={bootstrap}
    >
      <StripeCardPaySection />
    </CheckoutStripeElementsProvider>
  );
}
