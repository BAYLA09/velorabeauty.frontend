import { CheckoutExperienceLayout } from "@/components/checkout/CheckoutExperienceLayout";
import { CheckoutOrderForm } from "@/components/checkout/CheckoutOrderForm";
import { checkoutExperience } from "@/config/checkoutExperience";
import { resolveCheckoutContext } from "@/lib/resolveCheckoutContext";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CodCheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const ctx = resolveCheckoutContext(sp);
  const copy = checkoutExperience.cod;

  return (
    <CheckoutExperienceLayout
      accent={copy.accent}
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      heroBadge={copy.heroBadge}
      perks={copy.perks}
    >
      <CheckoutOrderForm
        paymentMethod="cod"
        accent="burgundy"
        productSlug={ctx.productSlug}
        productName={ctx.productName}
        quantity={ctx.quantity}
      />
    </CheckoutExperienceLayout>
  );
}
