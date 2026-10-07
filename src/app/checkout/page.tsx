import { CheckoutMethodHubClient } from "@/components/checkout/CheckoutMethodHubClient";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutMethodHubPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ctx = resolveCheckoutContext(sp);

  return (
    <CheckoutMethodHubClient
      productSlug={ctx.productSlug}
      productName={ctx.productName}
      quantity={ctx.quantity}
    />
  );
}
