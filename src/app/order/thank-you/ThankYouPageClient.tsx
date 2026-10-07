"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { codFee, currencyLabel, formatPrice } from "@/config/pricing";
import {
  clearOrderDraft,
  readOrderDraft,
  type OrderDraft,
} from "@/lib/orderStorage";
import { getProductPath } from "@/lib/productCatalog";

export function ThankYouPageClient() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("id");
  const [order, setOrder] = useState<OrderDraft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const draft = readOrderDraft();
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
                createdAt: string;
              };
            };
            if (!cancelled) {
              setOrder({
                orderId: data.order.id,
                productSlug: data.order.productSlug,
                productName: data.order.productName,
                quantity: data.order.quantity,
                method: data.order.paymentMethod,
                totalAed: data.order.totalAed,
                deliveryFeeAed: data.order.deliveryFeeAed,
                customerName: data.order.customerName,
                phone: data.order.phone,
                emirate: data.order.emirate,
                address: data.order.address,
                createdAt: data.order.createdAt,
              });
            }
            setLoading(false);
            return;
          }
        } catch {
          /* fall through to draft */
        }
      }
      if (!cancelled) {
        setOrder(draft);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [orderIdFromUrl]);

  const methodLabel =
    order?.method === "cod" ? "الدفع عند الاستلام" : "الدفع بالبطاقة";

  return (
    <>
      <ProductStoreHeader />
      <main className="min-h-[70vh] bg-velora-cream px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-velora-burgundy/10 text-3xl text-velora-burgundy">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-black text-velora-burgundy-dark sm:text-3xl">
            شكراً — طلبك وصلنا
          </h1>
          {loading ? (
            <p className="mt-4 text-base text-velora-burgundy/70">جاري تحميل تفاصيل الطلب…</p>
          ) : (
            <p className="mt-4 text-base leading-relaxed text-velora-burgundy/80">
              {order ? (
                <>
                  {order.customerName}، بدأنا نجهّز روتين{" "}
                  <span className="font-bold">{order.productName}</span>. فريق فيلورا يتصل بك على{" "}
                  <span dir="ltr" className="font-semibold">
                    {order.phone}
                  </span>{" "}
                  خلال ساعات لتأكيد العنوان — خطوة صغيرة قبل ما يطلع طلبك للتوصيل.
                </>
              ) : (
                <>
                  إذا أكملتِ الطلب للتو، سيتصل بك فريقنا قريباً. يمكنك العودة للمنتجات أو التواصل
                  معنا على واتساب.
                </>
              )}
            </p>
          )}

          {order && (
            <div className="mt-8 rounded-2xl border border-velora-burgundy/10 bg-white p-5 text-right text-sm shadow-sm">
              {order.orderId && (
                <p className="text-[11px] font-bold tracking-wide text-velora-burgundy/45">
                  رقم الطلب · {order.orderId.slice(0, 8).toUpperCase()}
                </p>
              )}
              <p className="mt-1 font-bold text-velora-burgundy">{order.productName}</p>
              <p className="mt-2 text-velora-burgundy/70">
                {order.emirate} — {order.address}
              </p>
              <p className="mt-3 flex flex-wrap justify-between gap-2 border-t border-velora-burgundy/10 pt-3">
                <span>{methodLabel}</span>
                <span className="text-lg font-black text-velora-burgundy">
                  {formatPrice(order.totalAed)}
                </span>
              </p>
              {order.method === "cod" && (order.deliveryFeeAed ?? codFee) > 0 && (
                <p className="mt-2 text-xs text-velora-burgundy/55">
                  يشمل رسوم التوصيل +{order.deliveryFeeAed ?? codFee} {currencyLabel}
                </p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-velora-burgundy/55">
                {order.method === "card"
                  ? "بعد التأكيد بالهاتف، نرسل لك رابط دفع آمن — شحن مجاني."
                  : "الدفع عند الاستلام — كاش أو بطاقة للمندوب."}
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {order?.productSlug && order.productSlug !== "velora-offer" && (
              <Link
                href={getProductPath(order.productSlug)}
                className="rounded-full bg-velora-burgundy px-6 py-3 text-sm font-bold text-velora-cream"
                onClick={() => clearOrderDraft()}
              >
                العودة للمنتج
              </Link>
            )}
            <Link
              href="/"
              className="rounded-full border border-velora-burgundy/20 bg-white px-6 py-3 text-sm font-bold text-velora-burgundy"
              onClick={() => clearOrderDraft()}
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
