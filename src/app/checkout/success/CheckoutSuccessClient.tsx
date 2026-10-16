"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { CardThankYouSuccess } from "@/components/order/card-thank-you/CardThankYouSuccess";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import {
  confirmStripePaymentIfNeeded,
  fetchOrderDraftById,
} from "@/lib/order/loadOrderForThankYou";
import { clearOrderDraft, readOrderDraft, type OrderDraft } from "@/lib/orderStorage";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdFromUrl = searchParams.get("id");
  const sessionIdFromUrl = searchParams.get("session_id");
  const paymentIntentFromUrl = searchParams.get("payment_intent");
  const [order, setOrder] = useState<OrderDraft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await confirmStripePaymentIfNeeded({
        orderId: orderIdFromUrl,
        sessionId: sessionIdFromUrl,
        paymentIntentId: paymentIntentFromUrl,
      });

      const draft = readOrderDraft();

      if (orderIdFromUrl) {
        const { order: loaded, status } = await fetchOrderDraftById(orderIdFromUrl, draft);
        if (!cancelled && loaded) {
          if (loaded.method === "cod") {
            router.replace(`/order/thank-you?id=${encodeURIComponent(orderIdFromUrl)}`);
            return;
          }
          setOrder({ ...loaded, status: status ?? loaded.status });
          setLoading(false);
          return;
        }
      }

      if (!cancelled) {
        if (draft?.method === "cod") {
          router.replace(
            orderIdFromUrl
              ? `/order/thank-you?id=${encodeURIComponent(orderIdFromUrl)}`
              : "/order/thank-you",
          );
          return;
        }
        setOrder(draft);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [orderIdFromUrl, sessionIdFromUrl, paymentIntentFromUrl, router]);

  return (
    <>
      <ProductStoreHeader />
      <main className="min-h-[75vh] bg-gradient-to-b from-velora-cream via-white to-velora-cream-dark/30 px-4 py-8 sm:py-12">
        {loading ? (
          <div
            className="mx-auto max-w-[440px] animate-pulse overflow-hidden rounded-[1.75rem] bg-white/80 p-8 shadow-lg ring-1 ring-velora-burgundy/8"
            aria-busy
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-velora-burgundy/10" />
            <div className="mx-auto mt-6 h-6 w-48 rounded bg-velora-burgundy/10" />
            <div className="mx-auto mt-3 h-4 w-full max-w-xs rounded bg-velora-burgundy/5" />
            <p className="mt-8 text-center text-sm text-velora-burgundy/60">جاري تأكيد الدفع…</p>
          </div>
        ) : order ? (
          <CardThankYouSuccess order={order} onNavigateAway={() => clearOrderDraft()} />
        ) : (
          <div className="mx-auto max-w-md text-center">
            <p className="text-base text-velora-burgundy/75">
              ما لقينا تفاصيل الطلب. راجعي بريدك أو تواصلي مع الدعم.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-velora-burgundy px-6 py-3 text-sm font-bold text-velora-cream"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        )}
      </main>
      <FooterSection />
    </>
  );
}
