import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function ConfigFootnote({ fees }: { fees: FeeConfig }) {
  return (
    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
      Server config (Easypanel env): payment fee {fees.payment.paymentFeePercent}% · card shipping{" "}
      {money(fees.payment.shippingDeliveredUsd)}/order · COGS eye {money(fees.products.eyeSerum)} /
      skin {money(fees.products.skinGummies)} · COD ship {money(fees.cod.shippingDeliveredUsd)} ·
      return {money(fees.cod.shippingReturnUsd)} · COD fee {money(fees.cod.codFeesPerOrderUsd)}/delivered
      · other {money(fees.cod.otherFeesPerOrderUsd)}/order · FX {fees.aedPerUsd} AED/USD
    </p>
  );
}
