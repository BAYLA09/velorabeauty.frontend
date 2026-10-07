import type { Metadata } from "next";
import { MethodCheckout } from "@/components/order/MethodCheckout";
import { OrderChrome } from "@/components/order/OrderChrome";
import { resolveOrderContext } from "@/lib/resolveOrderContext";

export const metadata: Metadata = {
  title: "الدفع بالبطاقة | Velora Beauty",
};

type Props = {
  searchParams: Promise<{ product?: string; qty?: string }>;
};

export default async function CardOrderPage({ searchParams }: Props) {
  const params = await searchParams;
  const order = resolveOrderContext(params.product, params.qty);

  return (
    <OrderChrome>
      <MethodCheckout
        method="card"
        productSlug={order.productSlug}
        productName={order.productName}
        quantity={order.quantity}
      />
    </OrderChrome>
  );
}
