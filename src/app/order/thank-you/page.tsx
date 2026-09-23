"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { formatPrice } from "@/config/pricing";
import { clearOrderDraft, readOrderDraft, type OrderDraft } from "@/lib/orderStorage";
import { getProductPath } from "@/lib/productCatalog";

export default function ThankYouPage() {
  const [order, setOrder] = useState<OrderDraft | null>(null);

  useEffect(() => {
    setOrder(readOrderDraft());
  }, []);

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
          <p className="mt-4 text-base leading-relaxed text-velora-burgundy/80">
            {order ? (
              <>
                {order.customerName}، بدأنا نجهّز روتين{" "}
                <span className="font-bold">{order.productName}</span>. فريق فيلورا
                يتصل بك على{" "}
                <span dir="ltr" className="font-semibold">
                  {order.phone}
                </span>{" "}
                خلال ساعات لتأكيد العنوان — خطوة صغيرة قبل ما يطلع طلبك للتوصيل.
              </>
            ) : (
              <>
                إذا أكملتِ الطلب للتو، سيتصل بك فريقنا قريباً. يمكنك العودة للمنتجات
                أو التواصل معنا على واتساب.
              </>
            )}
          </p>

          {order && (
            <div className="mt-8 rounded-2xl border border-velora-burgundy/10 bg-white p-5 text-right text-sm shadow-sm">
              <p className="font-bold text-velora-burgundy">{order.productName}</p>
              <p className="mt-2 text-velora-burgundy/70">
                {order.emirate} — {order.address}
              </p>
              <p className="mt-3 flex flex-wrap justify-between gap-2 border-t border-velora-burgundy/10 pt-3">
                <span>{methodLabel}</span>
                <span className="text-lg font-black text-velora-burgundy">
                  {formatPrice(order.totalAed)}
                </span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-velora-burgundy/55">
                {order.method === "card"
                  ? "بعد التأكيد بالهاتف، نرسل لك رابط دفع آمن — شحن مجاني."
                  : "الدفع عند الاستلام — كاش أو بطاقة للمندوب."}
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {order?.productSlug && (
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
