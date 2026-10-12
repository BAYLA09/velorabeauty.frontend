"use client";

import { Elements } from "@stripe/react-stripe-js";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PaymentFieldsSkeleton } from "@/components/checkout/PaymentFieldsSkeleton";
import { stripeElementsAppearance } from "@/components/checkout/stripeAppearance";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";
import {
  readStripeCheckoutPrefetch,
  writeStripeCheckoutPrefetch,
  type StripePrefetchParams,
} from "@/lib/stripeCheckoutPrefetch";
import { preloadStripeJs, primeStripeJsSync } from "@/lib/stripeJsLoader";
import type { BundleQuantity } from "@/config/pricing";

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
  eligibleUnits?: number;
  itemsParam?: string;
  bootstrap: StripeCardBootstrap | null;
  children: ReactNode;
};

export function CheckoutStripeElementsProvider({
  productSlug,
  productName,
  quantity,
  eligibleUnits,
  itemsParam,
  bootstrap,
  children,
}: Props) {
  const prefetchParams = useMemo<StripePrefetchParams>(
    () => ({
      productSlug,
      productName,
      quantity,
      eligibleUnits,
      itemsParam,
    }),
    [productSlug, productName, quantity, eligibleUnits, itemsParam],
  );
  const [publishableKey, setPublishableKey] = useState<string | null>(() => {
    if (bootstrap?.publishableKey) return bootstrap.publishableKey;
    if (typeof window !== "undefined" && window.__VELORA_STRIPE_BOOT?.publishableKey) {
      return window.__VELORA_STRIPE_BOOT.publishableKey;
    }
    return null;
  });
  const [clientSecret, setClientSecret] = useState<string | null>(() => {
    if (bootstrap?.clientSecret) return bootstrap.clientSecret;
    if (typeof window !== "undefined" && window.__VELORA_STRIPE_BOOT?.clientSecret) {
      return window.__VELORA_STRIPE_BOOT.clientSecret;
    }
    return null;
  });
  const [paymentIntentId, setPaymentIntentId] = useState(() => {
    if (bootstrap?.paymentIntentId) return bootstrap.paymentIntentId;
    if (typeof window !== "undefined" && window.__VELORA_STRIPE_BOOT?.paymentIntentId) {
      return window.__VELORA_STRIPE_BOOT.paymentIntentId;
    }
    return "";
  });
  const [paymentReady, setPaymentReady] = useState(false);
  const [elementsLoading, setElementsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const piRef = useRef(bootstrap?.paymentIntentId ?? "");

  useLayoutEffect(() => {
    const pk =
      bootstrap?.publishableKey ??
      publishableKey ??
      (typeof window !== "undefined" ? window.__VELORA_STRIPE_BOOT?.publishableKey : null);
    if (pk) primeStripeJsSync(pk);

    if (bootstrap?.publishableKey) {
      writeStripeCheckoutPrefetch(prefetchParams, bootstrap);
      void preloadStripeJs(bootstrap.publishableKey);
      return;
    }
    const cached = readStripeCheckoutPrefetch(prefetchParams);
    if (cached) {
      piRef.current = cached.paymentIntentId;
      setPublishableKey(cached.publishableKey);
      setClientSecret(cached.clientSecret);
      setPaymentIntentId(cached.paymentIntentId);
      void preloadStripeJs(cached.publishableKey);
    }
  }, [bootstrap, prefetchParams]);

  useEffect(() => {
    if (clientSecret) return;

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
              eligibleUnits,
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
        writeStripeCheckoutPrefetch(prefetchParams, {
          publishableKey: config.publishableKey,
          clientSecret: piData.clientSecret,
          paymentIntentId: piData.paymentIntentId,
        });
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
  }, [clientSecret, prefetchParams, productSlug, productName, quantity, eligibleUnits]);

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
