import {
  codPanelInputFromFees,
  computeCodPanel,
  computePaymentPanel,
  type CodPanelResult,
  type PaymentPanelResult,
} from "@/lib/profitAdmin/calculations";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import { computeMarketingMetrics } from "@/lib/profitAdmin/marketingMetrics";
import type { ProfitDashboardState } from "@/lib/profitAdmin/settingsRepository";
import { computeSnapchatAdSpendUsd } from "@/lib/profitAdmin/snapAdSpend";

export type BreakEvenUnitEconomics = {
  avgCardRevenueUsd: number;
  avgCardProductCostUsd: number;
  codSellingPriceUsd: number;
  codProductCostUsd: number;
};

export type BreakEvenScenarioResult = {
  totalLeads: number;
  cardLeads: number;
  codLeads: number;
  cardLeadPct: number;
  codLeadPct: number;
  card: PaymentPanelResult;
  cod: CodPanelResult;
  cardAdSpendUsd: number;
  codAdSpendUsd: number;
  adSpendUsd: number;
  grossProfitUsd: number;
  netProfitUsd: number;
  /** Max CPA (USD/lead) before net profit hits zero at this mix. */
  maxCpaBreakEvenUsd: number | null;
  maxCpaCardChannelUsd: number | null;
  maxCpaCodChannelUsd: number | null;
  breakEvenRoas: number | null;
  currentRoas: number | null;
  netPerLeadUsd: number | null;
};

export function defaultBreakEvenUnitEconomics(fees: FeeConfig): BreakEvenUnitEconomics {
  const avgCogs =
    (fees.products.hairGummies + fees.products.skinGummies + fees.products.eyeSerum) / 3;
  return {
    avgCardRevenueUsd: fees.cod.defaultSellingPricePerOrderUsd,
    avgCardProductCostUsd: avgCogs,
    codSellingPriceUsd: fees.cod.defaultSellingPricePerOrderUsd,
    codProductCostUsd: fees.cod.defaultProductCostPerOrderUsd,
  };
}

export function breakEvenUnitEconomicsFromPayment(
  fees: FeeConfig,
  payment: { orderCount: number; revenueUsd: number; productCostUsd: number } | null | undefined,
): BreakEvenUnitEconomics {
  const base = defaultBreakEvenUnitEconomics(fees);
  if (!payment || payment.orderCount <= 0) return base;
  return {
    ...base,
    avgCardRevenueUsd: payment.revenueUsd / payment.orderCount,
    avgCardProductCostUsd: payment.productCostUsd / payment.orderCount,
  };
}

function splitLeads(totalLeads: number, cardLeadPct: number): { cardLeads: number; codLeads: number } {
  const total = Math.max(0, Math.round(totalLeads));
  const pct = Math.min(100, Math.max(0, cardLeadPct));
  const cardLeads = Math.round((total * pct) / 100);
  const codLeads = Math.max(0, total - cardLeads);
  return { cardLeads, codLeads };
}

export function computeBreakEvenScenario(
  fees: FeeConfig,
  state: Pick<
    ProfitDashboardState,
    | "confirmationRatePct"
    | "deliveryRatePct"
    | "snapCpaUsd"
    | "breakEvenSimLeadCount"
    | "breakEvenCardLeadPct"
  >,
  units: BreakEvenUnitEconomics,
): BreakEvenScenarioResult {
  const totalLeads = Math.max(0, Math.round(state.breakEvenSimLeadCount));
  const cardLeadPct = Math.min(100, Math.max(0, state.breakEvenCardLeadPct));
  const codLeadPct = 100 - cardLeadPct;
  const { cardLeads, codLeads } = splitLeads(totalLeads, cardLeadPct);

  const card = computePaymentPanel({
    orderCount: cardLeads,
    totalRevenueUsd: cardLeads * units.avgCardRevenueUsd,
    productCostUsd: cardLeads * units.avgCardProductCostUsd,
    shippingCostUsd: cardLeads * fees.payment.shippingPerOrderUsd,
    stripePercent: fees.payment.stripePercent,
    stripeFixedUsd: fees.payment.stripeFixedUsd,
  });

  const cod = computeCodPanel(
    codPanelInputFromFees(
      {
        totalOrders: codLeads,
        confirmationRatePct: state.confirmationRatePct,
        deliveryRatePct: state.deliveryRatePct,
        sellingPricePerOrderUsd: units.codSellingPriceUsd,
        productCostPerOrderUsd: units.codProductCostUsd,
      },
      fees,
    ),
  );

  const adSpendUsd = computeSnapchatAdSpendUsd(state.snapCpaUsd, totalLeads);
  const cardAdSpendUsd = computeSnapchatAdSpendUsd(state.snapCpaUsd, cardLeads);
  const codAdSpendUsd = computeSnapchatAdSpendUsd(state.snapCpaUsd, codLeads);
  const grossProfitUsd = card.profitUsd + cod.profitUsd;
  const netProfitUsd = grossProfitUsd - adSpendUsd;

  const marketing = computeMarketingMetrics({ adSpendUsd, payment: card, cod });

  const maxCpaBreakEvenUsd = totalLeads > 0 ? grossProfitUsd / totalLeads : null;
  const maxCpaCardChannelUsd = cardLeads > 0 ? card.profitUsd / cardLeads : null;
  const maxCpaCodChannelUsd = codLeads > 0 ? cod.profitUsd / codLeads : null;
  const netPerLeadUsd = totalLeads > 0 ? netProfitUsd / totalLeads : null;

  return {
    totalLeads,
    cardLeads,
    codLeads,
    cardLeadPct,
    codLeadPct,
    card,
    cod,
    cardAdSpendUsd,
    codAdSpendUsd,
    adSpendUsd,
    grossProfitUsd,
    netProfitUsd,
    maxCpaBreakEvenUsd,
    maxCpaCardChannelUsd,
    maxCpaCodChannelUsd,
    breakEvenRoas: marketing.breakEvenRoas,
    currentRoas: marketing.roas,
    netPerLeadUsd,
  };
}
