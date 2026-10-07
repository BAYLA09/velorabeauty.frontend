import type { Metadata } from "next";
import { OrderChrome } from "@/components/order/OrderChrome";
import { PaymentChoice } from "@/components/order/PaymentChoice";
import { resolveOrderContext } from "@/lib/resolveOrderContext";

export const metadata: Metadata = {
  title: "طريقة الدفع | Velora Beauty",
};

type Props = {
  searchParams: Promise<{ product?: string; qty?: string }>;
};

export default async function OrderChoicePage({ searchParams }: Props) {
  const params = await searchParams;
  const order = resolveOrderContext(params.product, params.qty);

  return (
    <OrderChrome>
      <PaymentChoice
        productSlug={order.productSlug}
        productName={order.productName}
        quantity={order.quantity}
      />
    </OrderChrome>
  );
}
