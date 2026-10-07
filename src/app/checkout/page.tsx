import { CheckoutPaymentStepClient } from "@/components/checkout/CheckoutPaymentStepClient";
import type { PaymentMethod } from "@/config/pricing";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";

function parsePreferredMethod(raw: string | string[] | undefined): PaymentMethod | undefined {
  const value = typeof raw === "string" ? raw : undefined;
  return value === "card" || value === "cod" ? value : undefined;
}

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
      initialMethod={parsePreferredMethod(sp.method)}
    />
  );
}
