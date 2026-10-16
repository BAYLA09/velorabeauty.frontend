"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { CodThankYouSuccess } from "@/components/order/CodThankYouSuccess";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import type { CartLine } from "@/lib/cart/cartTypes";
import {
  clearOrderDraft,
  readOrderDraft,
  type OrderDraft,
} from "@/lib/orderStorage";

export function ThankYouPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("id");
  const sessionIdFromUrl = searchParams.get("session_id");
  const paymentIntentFromUrl = searchParams.get("payment_intent");
  const [order, setOrder] = useState<OrderDraft | null>(null);
  const [purchaseVerified, setPurchaseVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const draft = readOrderDraft();
      if (orderIdFromUrl && (sessionIdFromUrl || paymentIntentFromUrl)) {
        try {
          await fetch("/api/checkout/stripe/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderIdFromUrl,
              sessionId: sessionIdFromUrl ?? undefined,
              paymentIntentId: paymentIntentFromUrl ?? undefined,
            }),
          });
        } catch {
          /* webhook or retry later */
        }
      }
      if (orderIdFromUrl) {
        try {
          const res = await fetch(`/api/orders/${encodeURIComponent(orderIdFromUrl)}`);
          if (res.ok) {
            const data = (await res.json()) as {
              order: {
                id: string;
                productSlug: string;
                productName: string;
                quantity: OrderDraft["quantity"];
                paymentMethod: OrderDraft["method"];
                totalAed: number;
                deliveryFeeAed: number;
                customerName: string;
                phone: string;
                emirate: string;
                address: string;
                subtotalAed: number;
                createdAt: string;
                status: string;
                cartLines?: CartLine[];
              };
            };
            if (!cancelled) {
              if (data.order.paymentMethod === "card") {
                const q = new URLSearchParams({ id: data.order.id });
                if (sessionIdFromUrl) q.set("session_id", sessionIdFromUrl);
                if (paymentIntentFromUrl) q.set("payment_intent", paymentIntentFromUrl);
                router.replace(`/checkout/success?${q.toString()}`);
                return;
              }
              const draftCartLines =
                draft?.orderId === data.order.id ? draft.cartLines : undefined;
              const cartLines =
                data.order.cartLines && data.order.cartLines.length > 0
                  ? data.order.cartLines
                  : draftCartLines;
              setPurchaseVerified(true);
              setOrder({
                orderId: data.order.id,
                productSlug: data.order.productSlug,
                productName: data.order.productName,
                quantity: data.order.quantity,
                method: data.order.paymentMethod,
                totalAed: data.order.totalAed,
                deliveryFeeAed: data.order.deliveryFeeAed,
                subtotalAed: data.order.subtotalAed,
                status: data.order.status,
                customerName: data.order.customerName,
                phone: data.order.phone,
                emirate: data.order.emirate,
                address: data.order.address,
                createdAt: data.order.createdAt,
                ...(cartLines?.length ? { cartLines } : {}),
              });
            }
            setLoading(false);
            return;
          }
        } catch {
          /* fall through */
        }
        if (!cancelled) {
          setOrder(null);
          setPurchaseVerified(false);
          setLoading(false);
        }
        return;
      }
      if (!cancelled) {
        if (draft?.method === "card" && orderIdFromUrl) {
          router.replace(`/checkout/success?id=${encodeURIComponent(orderIdFromUrl)}`);
          return;
        }
        if (draft) {
          setOrder(draft);
          setPurchaseVerified(false);
        }
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
      <main className="min-h-[75vh] bg-velora-cream px-4 py-8 sm:py-12">
        {loading ? (
          <div className="mx-auto max-w-xl text-center">
            <p className="text-base text-velora-burgundy/70">جاري تحميل تفاصيل الطلب…</p>
          </div>
        ) : !order ? (
          <div className="mx-auto max-w-md text-center">
            <p className="text-base text-velora-burgundy/75">
              ما لقينا تفاصيل الطلب. إذا أكملتِ الطلب للتو، انتظري لحظات أو راجعي رسائل الجوال.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-velora-burgundy px-6 py-3 text-sm font-bold text-velora-cream"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        ) : (
          <CodThankYouSuccess
            order={order}
            purchaseVerified={purchaseVerified}
            onNavigateAway={() => clearOrderDraft()}
          />
        )}
      </main>
      <FooterSection />
    </>
  );
}
