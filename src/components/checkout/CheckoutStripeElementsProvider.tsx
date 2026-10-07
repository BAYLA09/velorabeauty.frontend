"use client";

import { Elements } from "@stripe/react-stripe-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PaymentFieldsSkeleton } from "@/components/checkout/PaymentFieldsSkeleton";
import { stripeElementsAppearance } from "@/components/checkout/stripeAppearance";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";
import { preloadStripeJs } from "@/lib/stripeJsLoader";
import { readStripePiCache } from "@/lib/stripePiSessionCache";
import type { BundleQuantity } from "@/config/pricing";

function mergeStripeBootstrap(
  bootstrap: StripeCardBootstrap | null,
  productSlug: string,
  quantity: BundleQuantity,
): StripeCardBootstrap | null {
  if (bootstrap?.clientSecret && bootstrap.publishableKey) return bootstrap;
  const cached = readStripePiCache(productSlug, quantity);
  if (!cached) return bootstrap;
  return {
    publishableKey: cached.publishableKey,
    clientSecret: cached.clientSecret,
    paymentIntentId: cached.paymentIntentId,
  };
}

type StripeCtx = {
  paymentIntentId: string;
  paymentReady: boolean;
  setPaymentReady: (ready: boolean) => void;
  elementsLoading: boolean;
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

type Props = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  bootstrap: StripeCardBootstrap | null;
  children: ReactNode;
};

export function CheckoutStripeElementsProvider({
  productSlug,
  productName,
  quantity,
  bootstrap,
  children,
}: Props) {
  const mergedBootstrap = mergeStripeBootstrap(bootstrap, productSlug, quantity);
  const [publishableKey, setPublishableKey] = useState<string | null>(
    mergedBootstrap?.publishableKey ?? null,
  );
  const [clientSecret, setClientSecret] = useState<string | null>(
    mergedBootstrap?.clientSecret ?? null,
  );
  const [paymentIntentId, setPaymentIntentId] = useState(mergedBootstrap?.paymentIntentId ?? "");
  const [paymentReady, setPaymentReady] = useState(false);
  const [elementsLoading, setElementsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const piRef = useRef(mergedBootstrap?.paymentIntentId ?? "");

  useEffect(() => {
    const merged = mergeStripeBootstrap(bootstrap, productSlug, quantity);
    if (merged?.publishableKey) {
      void preloadStripeJs(merged.publishableKey);
    }
    if (merged?.clientSecret && merged.publishableKey) {
      piRef.current = merged.paymentIntentId;
      setPublishableKey(merged.publishableKey);
      setClientSecret(merged.clientSecret);
      setPaymentIntentId(merged.paymentIntentId);
    }
  }, [bootstrap, productSlug, quantity]);

  useEffect(() => {
    if (mergeStripeBootstrap(bootstrap, productSlug, quantity)?.clientSecret) return;
    if (clientSecret && publishableKey) return;

    let cancelled = false;

    async function loadClientSide() {
      setElementsLoading(true);
      setError(null);
      setPaymentReady(false);
      try {
        const [configRes, piRes] = await Promise.all([
          fetch("/api/stripe/config", { cache: "no-store" }),
          fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productSlug,
              productName,
              quantity,
              paymentIntentId: piRef.current || undefined,
            }),
          }),
        ]);

        const config = (await configRes.json()) as {
          ready?: boolean;
          publishableKey?: string | null;
        };
        const piData = (await piRes.json()) as {
          clientSecret?: string;
          paymentIntentId?: string;
          error?: string;
        };

        if (cancelled) return;

        if (!config.ready || !config.publishableKey) {
          setError("stripe_publishable_missing");
          return;
        }
        if (!piRes.ok || !piData.clientSecret || !piData.paymentIntentId) {
          setError(piData.error ?? "stripe_payment_intent_failed");
          return;
        }

        void preloadStripeJs(config.publishableKey);
        piRef.current = piData.paymentIntentId;
        setPublishableKey(config.publishableKey);
        setClientSecret(piData.clientSecret);
        setPaymentIntentId(piData.paymentIntentId);
      } catch {
        if (!cancelled) setError("stripe_payment_intent_failed");
      } finally {
        if (!cancelled) setElementsLoading(false);
      }
    }

    void loadClientSide();
    return () => {
      cancelled = true;
    };
  }, [bootstrap, productSlug, productName, quantity, clientSecret, publishableKey]);

  const ctx = useMemo<StripeCtx>(
    () => ({
      paymentIntentId,
      paymentReady,
      setPaymentReady,
      elementsLoading: elementsLoading || !clientSecret || !publishableKey,
      error,
    }),
    [paymentIntentId, paymentReady, elementsLoading, clientSecret, publishableKey, error],
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
      </section>
    );
  }

  const stripePromise =
    publishableKey && clientSecret ? preloadStripeJs(publishableKey) : null;

  return (
    <CheckoutStripeContext.Provider value={ctx}>
      {stripePromise && clientSecret && publishableKey ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: stripeElementsAppearance,
            locale: "ar",
            loader: "never",
          }}
        >
          {children}
        </Elements>
      ) : (
        <div className="rounded-lg border border-[#d9d9d9] bg-white p-4 sm:p-5">
          <PaymentFieldsSkeleton />
        </div>
      )}
    </CheckoutStripeContext.Provider>
  );
}
