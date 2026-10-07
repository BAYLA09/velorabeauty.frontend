import type { Metadata } from "next";
import { MethodCheckout } from "@/components/order/MethodCheckout";
import { OrderChrome } from "@/components/order/OrderChrome";
import { resolveOrderContext } from "@/lib/resolveOrderContext";

export const metadata: Metadata = {
  title: "الدفع عند الاستلام | Velora Beauty",
};

type Props = {
  searchParams: Promise<{ product?: string; qty?: string }>;
};

export default async function CodOrderPage({ searchParams }: Props) {
  const params = await searchParams;
  const order = resolveOrderContext(params.product, params.qty);

  return (
    <OrderChrome tone="warm">
      <MethodCheckout
        method="cod"
        productSlug={order.productSlug}
        productName={order.productName}
        quantity={order.quantity}
      />
    </OrderChrome>
  );
}
