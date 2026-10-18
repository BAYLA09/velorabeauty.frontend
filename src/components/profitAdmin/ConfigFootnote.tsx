import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function ConfigFootnote({ fees }: { fees: FeeConfig }) {
  return (
    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
      <span className="text-slate-400">Card orders:</span> Stripe {fees.payment.stripePercent}% +{" "}
      {money(fees.payment.stripeFixedUsd)}/order · shipping {money(fees.payment.shippingPerOrderUsd)}
      . <span className="text-slate-400">COD orders:</span> call center{" "}
      {money(fees.cod.callCenterNoAnswerUsd)} / {money(fees.cod.callCenterReturnedUsd)} /{" "}
      {money(fees.cod.callCenterDeliveredUsd)} · ship {money(fees.cod.shippingReturnedUsd)} returned
      / {money(fees.cod.shippingDeliveredUsd)} delivered · service fee {fees.cod.serviceFeePercent}%
      of delivered COD cash only. COGS eye {money(fees.products.eyeSerum)} / skin{" "}
      {money(fees.products.skinGummies)} · FX {fees.aedPerUsd} AED/USD. Fees are never combined on
      one order.
    </p>
  );
}
