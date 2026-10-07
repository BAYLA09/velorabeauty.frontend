import { CheckoutConfirmClient } from "@/components/checkout/CheckoutConfirmClient";
import { getCheckoutProductImage } from "@/lib/checkoutProductMeta";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CodCheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ctx = resolveCheckoutContext(sp);
  const productImageSrc = getCheckoutProductImage(ctx.productSlug);

  return (
    <CheckoutConfirmClient
      paymentMethod="cod"
      productSlug={ctx.productSlug}
      productName={ctx.productName}
      productImageSrc={productImageSrc}
      quantity={ctx.quantity}
    />
  );
}
