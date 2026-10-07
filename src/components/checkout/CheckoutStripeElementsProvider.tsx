"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { stripeElementsAppearance } from "@/components/checkout/stripeAppearance";
import type { BundleQuantity } from "@/config/pricing";

type StripeCtx = {
  paymentIntentId: string;
  paymentReady: boolean;
  setPaymentReady: (ready: boolean) => void;
  loading: boolean;
  error: string | null;
};

const CheckoutStripeContext = createContext<StripeCtx | null>(null);

export function useCheckoutStripe() {
  const ctx = useContext(CheckoutStripeContext);
  if (!ctx) {
    throw new Error("useCheckoutStripe must be used within CheckoutStripeElementsProvider");
  }
  return ctx;
}

let stripePromise: Promise<Stripe | null> | null = null;

function getStripePromise(publishableKey: string) {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey, { locale: "ar" });
  }
  return stripePromise;
}

type Props = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  children: ReactNode;
};

export function CheckoutStripeElementsProvider({
  productSlug,
  productName,
  quantity,
  children,
}: Props) {
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paymentReady, setPaymentReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const piRef = useRef("");

  const initPayment = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPaymentReady(false);
    try {
      const configRes = await fetch("/api/stripe/config", { cache: "no-store" });
      const config = (await configRes.json()) as {
        ready?: boolean;
        publishableKey?: string | null;
      };
      if (!config.ready || !config.publishableKey) {
        setError("stripe_publishable_missing");
        return;
      }
      setPublishableKey(config.publishableKey);

      const piRes = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          quantity,
          paymentIntentId: piRef.current || undefined,
        }),
      });
      const piData = (await piRes.json()) as {
        clientSecret?: string;
        paymentIntentId?: string;
        error?: string;
      };
      if (!piRes.ok || !piData.clientSecret || !piData.paymentIntentId) {
        setError(piData.error ?? "stripe_payment_intent_failed");
        return;
      }
      piRef.current = piData.paymentIntentId;
      setPaymentIntentId(piData.paymentIntentId);
      setClientSecret(piData.clientSecret);
    } catch {
      setError("stripe_payment_intent_failed");
    } finally {
      setLoading(false);
    }
  }, [productSlug, productName, quantity]);

  useEffect(() => {
    void initPayment();
  }, [initPayment]);

  const ctx = useMemo<StripeCtx>(
    () => ({
      paymentIntentId,
      paymentReady,
      setPaymentReady,
      loading,
      error,
    }),
    [paymentIntentId, paymentReady, loading, error],
  );

  if (error === "stripe_publishable_missing") {
    return (
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-bold">الدفع بالبطاقة غير متاح حالياً</p>
        <p className="mt-2 text-xs leading-relaxed">
          أضيفي <span className="font-mono">STRIPE_PUBLISHABLE_KEY=pk_live_...</span> f Easypanel ثم
          Redeploy.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <p className="font-bold">تعذّر تحميل نموذج الدفع</p>
        <button
          type="button"
          onClick={() => void initPayment()}
          className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-bold text-red-900 shadow-sm"
        >
          إعادة المحاولة
        </button>
      </section>
    );
  }

  if (loading || !clientSecret || !publishableKey) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] py-12 text-sm text-neutral-500">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-[#134E3A]"
          aria-hidden
        />
        <span>جارٍ تحميل نموذج الدفع...</span>
      </div>
    );
  }

  return (
    <CheckoutStripeContext.Provider value={ctx}>
      <Elements
        stripe={getStripePromise(publishableKey)}
        options={{
          clientSecret,
          appearance: stripeElementsAppearance,
          locale: "ar",
        }}
      >
        {children}
      </Elements>
    </CheckoutStripeContext.Provider>
  );
}
