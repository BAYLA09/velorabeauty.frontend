import { CheckoutPaymentStepClient } from "@/components/checkout/CheckoutPaymentStepClient";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutMethodHubPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ctx = resolveCheckoutContext(sp);

  return (
    <CheckoutPaymentStepClient
      productSlug={ctx.productSlug}
      productName={ctx.productName}
      quantity={ctx.quantity}
    />
  );
}
